const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({ console, performance, Math });

function load(relativePath) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    vm.runInContext(source, context, { filename: relativePath });
}

vm.runInContext(`
    const BOARD_SIZE = 8;
    let flipped = false;
    let lastMove = null;
    const pieceValues = {
        '♖': 5, '♘': 3, '♗': 3, '♕': 9, '♙': 1, '♔': 0,
        '♜': 5, '♞': 3, '♝': 3, '♛': 9, '♟': 1, '♚': 0,
    };
    const openingBook = {};
`, context);

load('helpers/isPieceYour.js');
load('botFunctions/evaluatePosition.js');
load('botFunctions/boardStateToFEN.js');
load('botFunctions/findBestMoveRecursiveV2.js');

const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];
const flippedInitialBoard = [
    ['♖', '♘', '♗', '♔', '♕', '♗', '♘', '♖'],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['♜', '♞', '♝', '♚', '♛', '♝', '♞', '♜'],
];

context.testBoard = initialBoard.map(row => [...row]);
context.testFlippedBoard = flippedInitialBoard.map(row => [...row]);
vm.runInContext(`
    function testPosition(board = testBoard, side = 'white') {
        return searchPositionFromArguments(
            board, side, false, false, false, false, false, false
        );
    }

    function testPerft(position, depth) {
        if (depth === 0) return 1;
        let nodes = 0;
        for (const move of searchGenerateLegalMoves(position)) {
            const undo = searchMakeMove(position, move);
            nodes += testPerft(position, depth - 1);
            searchUndoMove(position, move, undo);
        }
        return nodes;
    }

    globalThis.testInitialMoves = searchGenerateLegalMoves(testPosition()).length;
    globalThis.testPerft2 = testPerft(testPosition(), 2);
    globalThis.testPerft3 = testPerft(testPosition(), 3);
    globalThis.testBeforeSearch = JSON.stringify(testBoard);
    globalThis.testResult = findBestMoveWithMinimax(
        testBoard, 'white', false, false, false, false, false, false,
        3, true, -Infinity, Infinity, 1, 10000
    );
    globalThis.testAfterSearch = JSON.stringify(testBoard);
    globalThis.testWhiteEvaluation = evaluatePosition(testBoard, 'white');
    globalThis.testBlackEvaluation = evaluatePosition(testBoard, 'black');
    flipped = true;
    globalThis.testFlippedMoves = searchGenerateLegalMoves(testPosition(testFlippedBoard)).length;
    globalThis.testFlippedPerft2 = testPerft(testPosition(testFlippedBoard), 2);

    flipped = false;
    const castlingBoard = Array.from({ length: 8 }, () => Array(8).fill(' '));
    castlingBoard[7][4] = '♔';
    castlingBoard[7][0] = '♖';
    castlingBoard[7][7] = '♖';
    castlingBoard[0][4] = '♚';
    const castlingPosition = testPosition(castlingBoard);
    const castlingBefore = JSON.stringify(castlingBoard);
    const castlingMoves = searchGenerateLegalMoves(castlingPosition);
    globalThis.testCastlingTypes = castlingMoves
        .filter(move => String(move.type).startsWith('castling'))
        .map(move => move.type)
        .sort();
    for (const move of castlingMoves) {
        const undo = searchMakeMove(castlingPosition, move);
        searchUndoMove(castlingPosition, move, undo);
    }
    globalThis.testCastlingRestored = JSON.stringify(castlingBoard) === castlingBefore;

    const enPassantBoard = Array.from({ length: 8 }, () => Array(8).fill(' '));
    enPassantBoard[7][4] = '♔';
    enPassantBoard[0][4] = '♚';
    enPassantBoard[3][4] = '♙';
    enPassantBoard[3][3] = '♟';
    const enPassantPosition = testPosition(enPassantBoard);
    enPassantPosition.enPassant = { row: 3, col: 3 };
    globalThis.testEnPassant = searchGenerateLegalMoves(enPassantPosition)
        .some(move => move.type === 'en passant' && move.to.row === 2 && move.to.col === 3);

    const promotionBoard = Array.from({ length: 8 }, () => Array(8).fill(' '));
    promotionBoard[7][4] = '♔';
    promotionBoard[0][4] = '♚';
    promotionBoard[1][0] = '♙';
    globalThis.testPromotion = searchGenerateLegalMoves(testPosition(promotionBoard))
        .some(move => move.promotion === '♕' && move.to.row === 0);
`, context);

assert.equal(context.testInitialMoves, 20, 'initial position must have 20 legal moves');
assert.equal(context.testPerft2, 400, 'initial perft(2) must be 400');
assert.equal(context.testPerft3, 8902, 'initial perft(3) must be 8902');
assert.equal(context.testBeforeSearch, context.testAfterSearch, 'search must restore the board');
assert.ok(context.testResult.bestMove, 'search must return a move');
assert.equal(context.testResult.stats.depth, 3, 'search must complete requested depth');
assert.ok(context.testResult.stats.nodes > 0, 'search must report visited nodes');
assert.ok(Math.abs(context.testWhiteEvaluation + context.testBlackEvaluation) < 1e-9,
    'evaluation must be antisymmetric');
assert.equal(context.testFlippedMoves, 20, 'flipped initial position must have 20 legal moves');
assert.equal(context.testFlippedPerft2, 400, 'flipped initial perft(2) must be 400');
assert.deepEqual(
    [...context.testCastlingTypes],
    ['castling left', 'castling right'],
    'both castling moves must be generated'
);
assert.equal(context.testCastlingRestored, true, 'castling make/undo must restore the board');
assert.equal(context.testEnPassant, true, 'en passant must be generated from position state');
assert.equal(context.testPromotion, true, 'promotion must be generated');

console.log('searchEngine.test.js: all checks passed');
