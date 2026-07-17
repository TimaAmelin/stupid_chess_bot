const SEARCH_MATE = 1000000;
const SEARCH_INFINITY = 2000000;
const SEARCH_PIECES = ['♖', '♘', '♗', '♕', '♔', '♙', '♜', '♞', '♝', '♛', '♚', '♟'];
const SEARCH_PIECE_INDEX = Object.fromEntries(SEARCH_PIECES.map((piece, index) => [piece, index]));
const SEARCH_KNIGHT_STEPS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const SEARCH_KING_STEPS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const SEARCH_BISHOP_DIRECTIONS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const SEARCH_ROOK_DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const SEARCH_CAPTURE_VALUES = {
    '♙': 100, '♟': 100, '♘': 300, '♞': 300, '♗': 300, '♝': 300,
    '♖': 500, '♜': 500, '♕': 900, '♛': 900, '♔': 20000, '♚': 20000,
};

// Deterministic Zobrist keys. Two 32-bit halves make accidental collisions
// sufficiently unlikely for this small, in-browser transposition table.
function createSearchRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return state >>> 0;
    };
}

const searchRandomA = createSearchRandom(0x9e3779b9);
const searchRandomB = createSearchRandom(0x243f6a88);
const SEARCH_ZOBRIST = {
    piecesA: Array.from({ length: 12 }, () => Array.from({ length: 64 }, searchRandomA)),
    piecesB: Array.from({ length: 12 }, () => Array.from({ length: 64 }, searchRandomB)),
    sideA: searchRandomA(),
    sideB: searchRandomB(),
    flippedA: searchRandomA(),
    flippedB: searchRandomB(),
    castlingA: Array.from({ length: 64 }, searchRandomA),
    castlingB: Array.from({ length: 64 }, searchRandomB),
    epA: Array.from({ length: 8 }, searchRandomA),
    epB: Array.from({ length: 8 }, searchRandomB),
};

const searchTranspositionTable = new Map();
const searchHistory = new Int32Array(64 * 64);
const searchKillers = [];
let lastSearchStats = null;

function searchIsWhite(piece) {
    return piece === '♖' || piece === '♘' || piece === '♗' ||
        piece === '♕' || piece === '♔' || piece === '♙';
}

function searchOwnPiece(piece, side) {
    return piece !== ' ' && searchIsWhite(piece) === (side === 'white');
}

function searchInside(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function searchOpposite(side) {
    return side === 'white' ? 'black' : 'white';
}

function searchSquare(row, col) {
    return row * 8 + col;
}

function searchMoveKey(move) {
    return searchSquare(move.from.row, move.from.col) * 64 + searchSquare(move.to.row, move.to.col);
}

function searchSameMove(first, second) {
    return first && second &&
        first.from.row === second.from.row && first.from.col === second.from.col &&
        first.to.row === second.to.row && first.to.col === second.to.col &&
        first.type === second.type;
}

function searchCastlingMask(position) {
    return (!position.rights.whiteKingMoved ? 1 : 0) |
        (!position.rights.whiteLeftRookMoved ? 2 : 0) |
        (!position.rights.whiteRightRookMoved ? 4 : 0) |
        (!position.rights.blackKingMoved ? 8 : 0) |
        (!position.rights.blackLeftRookMoved ? 16 : 0) |
        (!position.rights.blackRightRookMoved ? 32 : 0);
}

function searchHash(position) {
    let hashA = 0;
    let hashB = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const pieceIndex = SEARCH_PIECE_INDEX[position.board[row][col]];
            if (pieceIndex === undefined) continue;
            const square = searchSquare(row, col);
            hashA ^= SEARCH_ZOBRIST.piecesA[pieceIndex][square];
            hashB ^= SEARCH_ZOBRIST.piecesB[pieceIndex][square];
        }
    }
    if (position.side === 'black') {
        hashA ^= SEARCH_ZOBRIST.sideA;
        hashB ^= SEARCH_ZOBRIST.sideB;
    }
    if (flipped) {
        hashA ^= SEARCH_ZOBRIST.flippedA;
        hashB ^= SEARCH_ZOBRIST.flippedB;
    }
    const castling = searchCastlingMask(position);
    hashA ^= SEARCH_ZOBRIST.castlingA[castling];
    hashB ^= SEARCH_ZOBRIST.castlingB[castling];
    if (position.enPassant) {
        hashA ^= SEARCH_ZOBRIST.epA[position.enPassant.col];
        hashB ^= SEARCH_ZOBRIST.epB[position.enPassant.col];
    }
    return `${hashA >>> 0}:${hashB >>> 0}`;
}

function searchFindKing(position, side) {
    const king = side === 'white' ? '♔' : '♚';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (position.board[row][col] === king) return { row, col };
        }
    }
    return null;
}

function searchIsSquareAttacked(position, row, col, bySide) {
    const board = position.board;
    const pawn = bySide === 'white' ? '♙' : '♟';
    const pawnDirection = bySide === 'white' ? (flipped ? 1 : -1) : (flipped ? -1 : 1);
    const pawnRow = row - pawnDirection;
    if (searchInside(pawnRow, col - 1) && board[pawnRow][col - 1] === pawn) return true;
    if (searchInside(pawnRow, col + 1) && board[pawnRow][col + 1] === pawn) return true;

    const knight = bySide === 'white' ? '♘' : '♞';
    for (const [dr, dc] of SEARCH_KNIGHT_STEPS) {
        const fromRow = row + dr;
        const fromCol = col + dc;
        if (searchInside(fromRow, fromCol) && board[fromRow][fromCol] === knight) return true;
    }

    const king = bySide === 'white' ? '♔' : '♚';
    for (const [dr, dc] of SEARCH_KING_STEPS) {
        const fromRow = row + dr;
        const fromCol = col + dc;
        if (searchInside(fromRow, fromCol) && board[fromRow][fromCol] === king) return true;
    }

    const bishop = bySide === 'white' ? '♗' : '♝';
    const rook = bySide === 'white' ? '♖' : '♜';
    const queen = bySide === 'white' ? '♕' : '♛';
    for (const [dr, dc] of SEARCH_BISHOP_DIRECTIONS) {
        for (let fromRow = row + dr, fromCol = col + dc;
            searchInside(fromRow, fromCol);
            fromRow += dr, fromCol += dc) {
            const piece = board[fromRow][fromCol];
            if (piece === ' ') continue;
            if (piece === bishop || piece === queen) return true;
            break;
        }
    }
    for (const [dr, dc] of SEARCH_ROOK_DIRECTIONS) {
        for (let fromRow = row + dr, fromCol = col + dc;
            searchInside(fromRow, fromCol);
            fromRow += dr, fromCol += dc) {
            const piece = board[fromRow][fromCol];
            if (piece === ' ') continue;
            if (piece === rook || piece === queen) return true;
            break;
        }
    }
    return false;
}

function searchInCheck(position, side) {
    const king = searchFindKing(position, side);
    return king ? searchIsSquareAttacked(position, king.row, king.col, searchOpposite(side)) : true;
}

function searchPushMove(moves, position, fromRow, fromCol, toRow, toCol, type = true, promotion = null) {
    const captured = type === 'en passant'
        ? position.board[fromRow][toCol]
        : position.board[toRow][toCol];
    moves.push({
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        piece: position.board[fromRow][fromCol],
        type,
        captured,
        promotion,
    });
}

function searchGeneratePseudoMoves(position, capturesOnly = false) {
    const moves = [];
    const board = position.board;
    const side = position.side;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (!searchOwnPiece(piece, side)) continue;

            if (piece === '♙' || piece === '♟') {
                const direction = piece === '♙' ? (flipped ? 1 : -1) : (flipped ? -1 : 1);
                const promotionRow = piece === '♙' ? (flipped ? 7 : 0) : (flipped ? 0 : 7);
                const startingRow = piece === '♙' ? (flipped ? 1 : 6) : (flipped ? 6 : 1);
                const nextRow = row + direction;
                if (!capturesOnly && searchInside(nextRow, col) && board[nextRow][col] === ' ') {
                    searchPushMove(moves, position, row, col, nextRow, col, true,
                        nextRow === promotionRow ? (side === 'white' ? '♕' : '♛') : null);
                    const doubleRow = row + direction * 2;
                    if (row === startingRow && board[doubleRow][col] === ' ') {
                        searchPushMove(moves, position, row, col, doubleRow, col);
                    }
                }
                for (const dc of [-1, 1]) {
                    const toCol = col + dc;
                    if (!searchInside(nextRow, toCol)) continue;
                    if (board[nextRow][toCol] !== ' ' && !searchOwnPiece(board[nextRow][toCol], side)) {
                        searchPushMove(moves, position, row, col, nextRow, toCol, true,
                            nextRow === promotionRow ? (side === 'white' ? '♕' : '♛') : null);
                    } else if (position.enPassant &&
                        position.enPassant.row === row &&
                        position.enPassant.col === toCol &&
                        board[row][toCol] === (side === 'white' ? '♟' : '♙')) {
                        searchPushMove(moves, position, row, col, nextRow, toCol, 'en passant');
                    }
                }
                continue;
            }

            if (piece === '♘' || piece === '♞') {
                for (const [dr, dc] of SEARCH_KNIGHT_STEPS) {
                    const toRow = row + dr;
                    const toCol = col + dc;
                    if (!searchInside(toRow, toCol) || searchOwnPiece(board[toRow][toCol], side)) continue;
                    if (!capturesOnly || board[toRow][toCol] !== ' ') {
                        searchPushMove(moves, position, row, col, toRow, toCol);
                    }
                }
                continue;
            }

            if (piece === '♔' || piece === '♚') {
                for (const [dr, dc] of SEARCH_KING_STEPS) {
                    const toRow = row + dr;
                    const toCol = col + dc;
                    if (!searchInside(toRow, toCol) || searchOwnPiece(board[toRow][toCol], side)) continue;
                    if (!capturesOnly || board[toRow][toCol] !== ' ') {
                        searchPushMove(moves, position, row, col, toRow, toCol);
                    }
                }
                if (!capturesOnly) searchAddCastlingMoves(position, moves, row, col, piece);
                continue;
            }

            let directions;
            if (piece === '♗' || piece === '♝') directions = SEARCH_BISHOP_DIRECTIONS;
            else if (piece === '♖' || piece === '♜') directions = SEARCH_ROOK_DIRECTIONS;
            else directions = SEARCH_BISHOP_DIRECTIONS.concat(SEARCH_ROOK_DIRECTIONS);

            for (const [dr, dc] of directions) {
                for (let toRow = row + dr, toCol = col + dc;
                    searchInside(toRow, toCol);
                    toRow += dr, toCol += dc) {
                    const target = board[toRow][toCol];
                    if (searchOwnPiece(target, side)) break;
                    if (!capturesOnly || target !== ' ') {
                        searchPushMove(moves, position, row, col, toRow, toCol);
                    }
                    if (target !== ' ') break;
                }
            }
        }
    }
    return moves;
}

function searchAddCastlingMoves(position, moves, row, col, piece) {
    const side = piece === '♔' ? 'white' : 'black';
    const rights = position.rights;
    if ((side === 'white' && rights.whiteKingMoved) ||
        (side === 'black' && rights.blackKingMoved) ||
        searchInCheck(position, side)) return;

    const opponent = searchOpposite(side);
    const rook = side === 'white' ? '♖' : '♜';
    const configs = [
        {
            rookCol: 0,
            type: 'castling left',
            rookMoved: side === 'white' ? rights.whiteLeftRookMoved : rights.blackLeftRookMoved,
        },
        {
            rookCol: 7,
            type: 'castling right',
            rookMoved: side === 'white' ? rights.whiteRightRookMoved : rights.blackRightRookMoved,
        },
    ];

    for (const config of configs) {
        if (config.rookMoved || position.board[row][config.rookCol] !== rook) continue;
        const direction = config.rookCol < col ? -1 : 1;
        let clear = true;
        for (let scanCol = col + direction; scanCol !== config.rookCol; scanCol += direction) {
            if (position.board[row][scanCol] !== ' ') {
                clear = false;
                break;
            }
        }
        if (!clear) continue;
        if (searchIsSquareAttacked(position, row, col + direction, opponent) ||
            searchIsSquareAttacked(position, row, col + direction * 2, opponent)) continue;
        searchPushMove(moves, position, row, col, row, col + direction * 2, config.type);
    }
}

function searchUpdateRights(position, movingPiece, move, capturedPiece) {
    const rights = position.rights;
    if (movingPiece === '♔') rights.whiteKingMoved = true;
    if (movingPiece === '♚') rights.blackKingMoved = true;
    if (movingPiece === '♖') {
        if (move.from.col === 0) rights.whiteLeftRookMoved = true;
        if (move.from.col === 7) rights.whiteRightRookMoved = true;
    }
    if (movingPiece === '♜') {
        if (move.from.col === 0) rights.blackLeftRookMoved = true;
        if (move.from.col === 7) rights.blackRightRookMoved = true;
    }
    if (capturedPiece === '♖') {
        if (move.to.col === 0) rights.whiteLeftRookMoved = true;
        if (move.to.col === 7) rights.whiteRightRookMoved = true;
    }
    if (capturedPiece === '♜') {
        if (move.to.col === 0) rights.blackLeftRookMoved = true;
        if (move.to.col === 7) rights.blackRightRookMoved = true;
    }
}

function searchMakeMove(position, move) {
    const board = position.board;
    const movingPiece = board[move.from.row][move.from.col];
    const undo = {
        captured: move.type === 'en passant' ? board[move.from.row][move.to.col] : board[move.to.row][move.to.col],
        rights: { ...position.rights },
        enPassant: position.enPassant,
        side: position.side,
    };

    board[move.from.row][move.from.col] = ' ';
    if (move.type === 'en passant') board[move.from.row][move.to.col] = ' ';

    if (move.type === 'castling left' || move.type === 'castling right') {
        const rookFromCol = move.type === 'castling left' ? 0 : 7;
        const direction = rookFromCol < move.from.col ? -1 : 1;
        board[move.to.row][move.to.col] = movingPiece;
        board[move.from.row][move.from.col + direction] = board[move.from.row][rookFromCol];
        board[move.from.row][rookFromCol] = ' ';
    } else {
        board[move.to.row][move.to.col] = move.promotion || movingPiece;
    }

    searchUpdateRights(position, movingPiece, move, undo.captured);
    position.enPassant = null;
    if ((movingPiece === '♙' || movingPiece === '♟') && Math.abs(move.to.row - move.from.row) === 2) {
        position.enPassant = { row: move.to.row, col: move.to.col };
    }
    position.side = searchOpposite(position.side);
    return undo;
}

function searchUndoMove(position, move, undo) {
    const board = position.board;
    position.side = undo.side;
    position.rights = undo.rights;
    position.enPassant = undo.enPassant;

    if (move.type === 'castling left' || move.type === 'castling right') {
        const rookFromCol = move.type === 'castling left' ? 0 : 7;
        const direction = rookFromCol < move.from.col ? -1 : 1;
        board[move.from.row][move.from.col] = move.piece;
        board[move.from.row][rookFromCol] = board[move.from.row][move.from.col + direction];
        board[move.from.row][move.from.col + direction] = ' ';
        board[move.to.row][move.to.col] = ' ';
    } else {
        board[move.from.row][move.from.col] = move.piece;
        board[move.to.row][move.to.col] = undo.captured;
        if (move.type === 'en passant') {
            board[move.to.row][move.to.col] = ' ';
            board[move.from.row][move.to.col] = undo.captured;
        }
    }
}

function searchGenerateLegalMoves(position, capturesOnly = false) {
    const side = position.side;
    const legalMoves = [];
    for (const move of searchGeneratePseudoMoves(position, capturesOnly)) {
        const undo = searchMakeMove(position, move);
        if (!searchInCheck(position, side)) legalMoves.push(move);
        searchUndoMove(position, move, undo);
    }
    return legalMoves;
}

function searchOrderMoves(moves, ttMove, ply) {
    const killerMoves = searchKillers[ply] || [];
    for (const move of moves) {
        if (searchSameMove(move, ttMove)) move.searchScore = 10000000;
        else if (move.promotion) move.searchScore = 9000000;
        else if (move.captured && move.captured !== ' ') {
            move.searchScore = 8000000 +
                SEARCH_CAPTURE_VALUES[move.captured] * 10 -
                SEARCH_CAPTURE_VALUES[move.piece];
        } else if (searchSameMove(move, killerMoves[0])) move.searchScore = 7000000;
        else if (searchSameMove(move, killerMoves[1])) move.searchScore = 6999999;
        else move.searchScore = searchHistory[searchMoveKey(move)];
    }
    moves.sort((first, second) => second.searchScore - first.searchScore);
    return moves;
}

function searchRememberCutoff(move, depth, ply) {
    if (move.captured === ' ') {
        if (!searchKillers[ply]) searchKillers[ply] = [];
        if (!searchSameMove(move, searchKillers[ply][0])) {
            searchKillers[ply][1] = searchKillers[ply][0];
            searchKillers[ply][0] = move;
        }
        const key = searchMoveKey(move);
        searchHistory[key] = Math.min(1000000, searchHistory[key] + depth * depth);
    }
}

function searchCheckTime(context) {
    if ((context.stats.nodes & 1023) === 0 && performance.now() >= context.deadline) {
        context.stopped = true;
    }
    return context.stopped;
}

function searchQuiescence(position, alpha, beta, ply, context) {
    context.stats.qnodes++;
    context.stats.nodes++;
    if (searchCheckTime(context)) return 0;
    if (ply >= 16) return evaluatePosition(position.board, position.side);

    const inCheck = searchInCheck(position, position.side);
    let standPat = evaluatePosition(position.board, position.side);
    if (!inCheck) {
        if (standPat >= beta) return beta;
        if (standPat > alpha) alpha = standPat;
    }

    const moves = searchOrderMoves(searchGenerateLegalMoves(position, !inCheck), null, ply);
    if (inCheck && moves.length === 0) return -SEARCH_MATE + ply;
    for (const move of moves) {
        const undo = searchMakeMove(position, move);
        const score = -searchQuiescence(position, -beta, -alpha, ply + 1, context);
        searchUndoMove(position, move, undo);
        if (context.stopped) return 0;
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }
    return alpha;
}

function searchNegamax(position, depth, alpha, beta, ply, context) {
    context.stats.nodes++;
    if (searchCheckTime(context)) return 0;
    if (depth === 0) return searchQuiescence(position, alpha, beta, ply, context);

    const originalAlpha = alpha;
    const hash = searchHash(position);
    const cached = searchTranspositionTable.get(hash);
    if (cached && cached.depth >= depth) {
        context.stats.ttHits++;
        if (cached.flag === 'exact') return cached.score;
        if (cached.flag === 'lower') alpha = Math.max(alpha, cached.score);
        if (cached.flag === 'upper') beta = Math.min(beta, cached.score);
        if (alpha >= beta) return cached.score;
    }

    const moves = searchOrderMoves(searchGenerateLegalMoves(position), cached && cached.bestMove, ply);
    if (moves.length === 0) {
        return searchInCheck(position, position.side) ? -SEARCH_MATE + ply : 0;
    }

    let bestScore = -SEARCH_INFINITY;
    let bestMove = moves[0];
    for (const move of moves) {
        const undo = searchMakeMove(position, move);
        const score = -searchNegamax(position, depth - 1, -beta, -alpha, ply + 1, context);
        searchUndoMove(position, move, undo);
        if (context.stopped) return 0;
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
        if (score > alpha) alpha = score;
        if (alpha >= beta) {
            context.stats.cutoffs++;
            searchRememberCutoff(move, depth, ply);
            break;
        }
    }

    let flag = 'exact';
    if (bestScore <= originalAlpha) flag = 'upper';
    else if (bestScore >= beta) flag = 'lower';
    searchTranspositionTable.set(hash, { depth, score: bestScore, flag, bestMove });
    return bestScore;
}

function searchRoot(position, depth, alpha, beta, context, preferredMove) {
    const moves = searchOrderMoves(searchGenerateLegalMoves(position), preferredMove, 0);
    if (moves.length === 0) {
        return {
            bestMove: null,
            evaluation: searchInCheck(position, position.side) ? -SEARCH_MATE : 0,
        };
    }

    let bestMove = moves[0];
    let bestScore = -SEARCH_INFINITY;
    for (const move of moves) {
        const undo = searchMakeMove(position, move);
        const score = -searchNegamax(position, depth - 1, -beta, -alpha, 1, context);
        searchUndoMove(position, move, undo);
        if (context.stopped) break;
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
        if (score > alpha) alpha = score;
        if (alpha >= beta) {
            context.stats.cutoffs++;
            break;
        }
    }
    return { bestMove, evaluation: bestScore };
}

function searchPositionFromArguments(
    boardState,
    side,
    whiteKingMoved,
    whiteLeftRookMoved,
    whiteRightRookMoved,
    blackKingMoved,
    blackLeftRookMoved,
    blackRightRookMoved
) {
    let enPassant = null;
    if (lastMove && (lastMove.piece === '♙' || lastMove.piece === '♟') &&
        Math.abs(lastMove.to.row - lastMove.from.row) === 2) {
        enPassant = { row: lastMove.to.row, col: lastMove.to.col };
    }
    return {
        board: boardState,
        side,
        enPassant,
        rights: {
            whiteKingMoved: Boolean(whiteKingMoved),
            whiteLeftRookMoved: Boolean(whiteLeftRookMoved),
            whiteRightRookMoved: Boolean(whiteRightRookMoved),
            blackKingMoved: Boolean(blackKingMoved),
            blackLeftRookMoved: Boolean(blackLeftRookMoved),
            blackRightRookMoved: Boolean(blackRightRookMoved),
        },
    };
}

function findBestMoveWithMinimax(
    boardState,
    side,
    whiteKingMoved,
    whiteLeftRookMoved,
    whiteRightRookMoved,
    blackKingMoved,
    blackLeftRookMoved,
    blackRightRookMoved,
    maxDepth = 6,
    isMaximizing = true,
    alpha = -Infinity,
    beta = Infinity,
    moveNumber = 1,
    timeLimitMs = 1500
) {
    // Opening-book lookup belongs only at the root; doing it in every recursive
    // node previously built a full FEN string thousands of times.
    const fen = boardStateToFEN(
        boardState, side,
        whiteKingMoved, whiteLeftRookMoved, whiteRightRookMoved,
        blackKingMoved, blackLeftRookMoved, blackRightRookMoved
    );
    if (openingBook[fen]) {
        const bookMoves = openingBook[fen];
        const bookMove = bookMoves[Math.floor(Math.random() * bookMoves.length)];
        return { bestMove: { ...bookMove, piece: boardState[bookMove.from.row][bookMove.from.col], type: bookMove.type || true }, evaluation: 0 };
    }

    if (searchTranspositionTable.size > 250000) searchTranspositionTable.clear();
    searchHistory.fill(0);
    searchKillers.length = 0;

    const position = searchPositionFromArguments(
        boardState, side,
        whiteKingMoved, whiteLeftRookMoved, whiteRightRookMoved,
        blackKingMoved, blackLeftRookMoved, blackRightRookMoved
    );
    const startedAt = performance.now();
    const context = {
        deadline: startedAt + Math.max(50, timeLimitMs),
        stopped: false,
        stats: { nodes: 0, qnodes: 0, cutoffs: 0, ttHits: 0, depth: 0, elapsedMs: 0, nps: 0 },
    };

    let completed = searchRoot(position, 1, -SEARCH_INFINITY, SEARCH_INFINITY, context, null);
    let previousScore = completed.evaluation;
    for (let depth = 2; depth <= maxDepth && !context.stopped; depth++) {
        // Aspiration windows improve pruning. On a fail-low/high we repeat with
        // a full window so the returned score remains exact.
        const window = 0.75;
        let iteration = searchRoot(
            position, depth,
            previousScore - window, previousScore + window,
            context, completed.bestMove
        );
        if (!context.stopped &&
            (iteration.evaluation <= previousScore - window || iteration.evaluation >= previousScore + window)) {
            iteration = searchRoot(position, depth, -SEARCH_INFINITY, SEARCH_INFINITY, context, iteration.bestMove);
        }
        if (!context.stopped) {
            completed = iteration;
            previousScore = iteration.evaluation;
            context.stats.depth = depth;
        }
    }

    context.stats.elapsedMs = performance.now() - startedAt;
    context.stats.nps = Math.round(context.stats.nodes * 1000 / Math.max(1, context.stats.elapsedMs));
    if (context.stats.depth === 0) context.stats.depth = 1;
    lastSearchStats = { ...context.stats };
    console.info('Chess search', lastSearchStats);
    return { ...completed, stats: lastSearchStats };
}
