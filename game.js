let selectedPiece = null;
let selectedPos = null;

let turn = 'white';

let lastMove = null;

let whiteKingMoved = false;
let blackKingMoved = false;
let whiteLeftRookMoved = false;
let whiteRightRookMoved = false;
let blackLeftRookMoved = false;
let blackRightRookMoved = false;

// let whiteKingMoved = true;
// let blackKingMoved = true;
// let whiteLeftRookMoved = true;
// let whiteRightRookMoved = true;
// let blackLeftRookMoved = true;
// let blackRightRookMoved = true;

// let bot = 'none';
let bot = 'black';
// let bot = 'white';

let legalMoveCells = [];

let movable = bot !== 'white';

const pieceValues = {
    '♖': 5, '♘': 3, '♗': 3, '♕': 9, '♙': 1, '♔': 0,
    '♜': 5, '♞': 3, '♝': 3, '♛': 9, '♟': 1, '♚': 0,
}

canvas.addEventListener('click', handleClick);

function handleClick(event) {
    if (!movable) return;
    const col = Math.floor(event.offsetX / TILE_SIZE);
    const row = Math.floor(event.offsetY / TILE_SIZE);

    if (!selectedPiece && boardState[row][col] !== ' ') {
        selectedPiece = boardState[row][col];
        selectedPos = { row, col };
        legalMoveCells = findAllPossibleMovesForPiece(
            boardState,
            selectedPiece,
            selectedPos,
            turn,
            whiteKingMoved,
            whiteLeftRookMoved,
            whiteRightRookMoved,
            blackKingMoved,
            blackLeftRookMoved,
            blackRightRookMoved
        );
        render(legalMoveCells);
    } else if (selectedPiece) {
        let moved = false;
        if (
            (['♖', '♘', '♗', '♕', '♔', '♙'].includes(selectedPiece) && turn === 'white') ||
            (['♜', '♞', '♝', '♛', '♚', '♟'].includes(selectedPiece) && turn === 'black')
        ) {
            const validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                {
                    row,
                    col
                },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            );
            if (validMove) {
                const copyBoardState = boardState.map(row => [...row]);
                if (validMove === 'castling left') {
                    copyBoardState[selectedPos.row][3 - flipped] = selectedPiece;
                    if (isKingInCheck(
                        turn,
                        copyBoardState,
                        whiteKingMoved,
                        whiteLeftRookMoved,
                        whiteRightRookMoved,
                        blackKingMoved,
                        blackLeftRookMoved,
                        blackRightRookMoved
                    )) {
                        return
                    }

                } else if (validMove === 'castling right') {
                    copyBoardState[selectedPos.row][5 + flipped] = selectedPiece;
                    if (isKingInCheck(
                        turn,
                        copyBoardState,
                        whiteKingMoved,
                        whiteLeftRookMoved,
                        whiteRightRookMoved,
                        blackKingMoved,
                        blackLeftRookMoved,
                        blackRightRookMoved
                    )) {
                        return
                    }
                }
                copyBoardState[selectedPos.row][selectedPos.col] = ' ';
                copyBoardState[row][col] = selectedPiece;

                if (!isKingInCheck(turn, copyBoardState)) {
                    boardState[selectedPos.row][selectedPos.col] = ' ';
                    if (validMove === 'castling left') {
                        boardState[selectedPos.row][0] = ' ';
                        boardState[selectedPos.row][3 - flipped] = selectedPiece === '♔' ? '♖' : '♜';
                        boardState[selectedPos.row][2 - flipped] = selectedPiece;
                    } else if (validMove === 'castling right') {
                        boardState[selectedPos.row][7] = ' ';
                        boardState[selectedPos.row][5 - flipped] = selectedPiece === '♔' ? '♖' : '♜';
                        boardState[selectedPos.row][6 - flipped] = selectedPiece;
                    } else {
                        if (selectedPiece === '♙' && row === flipped * 7) {
                            boardState[row][col] = '♕';
                        } else if (selectedPiece === '♟' && row === 7 - flipped * 7) {
                            boardState[row][col] = '♛';
                        } else {
                            boardState[row][col] = selectedPiece;
                        }
                    }
                    moved = true;
                    if (validMove === 'en passant') {
                        boardState[selectedPos.row][col] = ' ';
                    }
                    if (turn === 'white') {
                        turn = 'black';
                    } else {
                        turn = 'white';
                    }
                    if (selectedPiece === '♔') {
                        whiteKingMoved = true;
                    }
                    if (selectedPiece === '♚') {
                        blackKingMoved = true;
                    }
                    if (selectedPiece === '♖') {
                        if (selectedPos.col === 0) {
                            whiteLeftRookMoved = true;
                        }
                        if (selectedPos.col === 7) {
                            whiteRightRookMoved = true;
                        }
                    }
                    if (selectedPiece === '♜') {
                        if (selectedPos.col === 0) {
                            blackLeftRookMoved = true;
                        }
                        if (selectedPos.col === 7) {
                            blackRightRookMoved = true;
                        }
                    }

                    if (col === 0 && row === 7 - 7 * flipped) {
                        whiteLeftRookMoved = true;
                    }
                    if (col === 7 && row === 7 - 7 * flipped) {
                        whiteRightRookMoved = true;
                    }

                    if (col === 0 && row === 7 * flipped) {
                        blackLeftRookMoved = true;
                    }
                    if (col === 7 && row === 7 * flipped) {
                        blackRightRookMoved = true;
                    }
                    lastMove = { piece: selectedPiece, from: selectedPos, to: { row, col } };
                    legalMoveCells = [];
                    selectedPiece = null;
                    selectedPos = null;
                    
                    if (turn === bot) {
                        movable = false;

                        setTimeout(() => {
                            const allPossibleMoves = findAllPossibleMoves(
                                boardState,
                                turn,
                                whiteKingMoved,
                                whiteLeftRookMoved,
                                whiteRightRookMoved,
                                blackKingMoved,
                                blackLeftRookMoved,
                                blackRightRookMoved
                            );
                            if (allPossibleMoves.length === 0) {
                                render([]);
                                setTimeout(() => alert('You won!'), 100);
                                movable = true;
                                return;
                            }

                            // const bestMove = findBestMoveRandom(allPossibleMoves, boardState);
                            // const bestMove = findBestMove(allPossibleMoves, boardState);
                            // const {bestMove, evaluation} = findBestMoveRecursive(allPossibleMoves, boardState, turn);
                            const {bestMove, evaluation} = findBestMoveWithMinimax(
                                boardState,
                                turn,
                                whiteKingMoved,
                                whiteLeftRookMoved,
                                whiteRightRookMoved,
                                blackKingMoved,
                                blackLeftRookMoved,
                                blackRightRookMoved,
                            );
                            if (bestMove.type === 'castling left') {
                                boardState[bestMove.from.row][0] = ' ';
                                boardState[bestMove.from.row][3 - flipped] = boardState[bestMove.from.row][bestMove.from.col] === '♔' ? '♖' : '♜';
                                boardState[bestMove.from.row][2 - flipped] = boardState[bestMove.from.row][bestMove.from.col];
                            } else if (bestMove.type === 'castling right') {
                                boardState[bestMove.from.row][7] = ' ';
                                boardState[bestMove.from.row][5 - flipped] = boardState[bestMove.from.row][bestMove.from.col] === '♔' ? '♖' : '♜';
                                boardState[bestMove.from.row][6 - flipped] = boardState[bestMove.from.row][bestMove.from.col];
                            } else {
                                if (boardState[bestMove.from.row][bestMove.from.col] === '♙' && bestMove.to.row === flipped * 7) {
                                    boardState[bestMove.to.row][bestMove.to.col] = '♕';
                                } else if (boardState[bestMove.from.row][bestMove.from.col] === '♟' && bestMove.to.row === 7 - flipped * 7) {
                                    boardState[bestMove.to.row][bestMove.to.col] = '♛';
                                } else {
                                    boardState[bestMove.to.row][bestMove.to.col] = boardState[bestMove.from.row][bestMove.from.col];
                                }
                            }
                            moved = true;
                            if (bestMove.type === 'en passant') {
                                boardState[bestMove.from.row][bestMove.to.col] = ' ';
                            }
                            boardState[bestMove.from.row][bestMove.from.col] = ' ';

                            if (boardState[bestMove.to.row][bestMove.to.col] === '♔') {
                                whiteKingMoved = true;
                            }
                            if (boardState[bestMove.to.row][bestMove.to.col] === '♚') {
                                blackKingMoved = true;
                            }
                            if (boardState[bestMove.to.row][bestMove.to.col] === '♖') {
                                if (bestMove.from.col === 0) {
                                    whiteLeftRookMoved = true;
                                }
                                if (bestMove.from.col === 7) {
                                    whiteRightRookMoved = true;
                                }
                            }
                            if (boardState[bestMove.to.row][bestMove.to.col] === '♜') {
                                if (bestMove.from.col === 0) {
                                    blackLeftRookMoved = true;
                                }
                                if (bestMove.from.col === 7) {
                                    blackRightRookMoved = true;
                                }
                            }

                            if (bestMove.to.col === 0 && bestMove.to.row === 7 - 7 * flipped) {
                                whiteLeftRookMoved = true;
                            }
                            if (bestMove.to.col === 7 && bestMove.to.row === 7 - 7 * flipped) {
                                whiteRightRookMoved = true;
                            }
        
                            if (bestMove.to.col === 0 && bestMove.to.row === 7 * flipped) {
                                blackLeftRookMoved = true;
                            }
                            if (bestMove.to.col === 7 && bestMove.to.row === 7 * flipped) {
                                blackRightRookMoved = true;
                            }
                            if (allPossibleMoves.length) {
                                if (turn === 'white') {
                                    turn = 'black';
                                } else {
                                    turn = 'white';
                                }
                            }
                            lastMove = { piece: bestMove.piece, from: bestMove.from, to: bestMove.to };
                            movable = true;
                            render([]);
                        }, 500)
                    }
                }
            }
        }

        const targetSquare = boardState[row][col];
        if (targetSquare !== ' ' && isPieceYour(targetSquare, turn)) {
            selectedPiece = targetSquare;
            selectedPos = { row, col };
            legalMoveCells = findAllPossibleMovesForPiece(
                boardState,
                selectedPiece,
                selectedPos,
                turn,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            );
        } else {
            selectedPiece = null;
            selectedPos = null;
            legalMoveCells = [];
        }

        if (moved) {
            render([]);
        } else {
            render(legalMoveCells);
        }

        const allPossibleMoves = findAllPossibleMoves(
            boardState,
            turn,
            whiteKingMoved,
            whiteLeftRookMoved,
            whiteRightRookMoved,
            blackKingMoved,
            blackLeftRookMoved,
            blackRightRookMoved
        );
        if (!allPossibleMoves.length) {
            if (bot !== turn) {
                setTimeout(() => alert('You lost!'), 100);
                movable = true;
            } else if (bot === 'none') {
                if (turn === 'black') {
                    setTimeout(() => alert('White lost!'), 100);
                    movable = true;
                } else {
                    setTimeout(() => alert('Black lost!'), 100);
                    movable = true;
                }
            }
        }
    }
}

function render(legalMoveCells) {
    drawBoard(legalMoveCells, lastMove);
    drawPieces();
}

render([]);
