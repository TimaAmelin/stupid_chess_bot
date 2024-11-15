const initialBoardFlipped = [
    ['♖', '♘', '♗', '♔', '♕', '♗', '♘', '♖'],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['♜', '♞', '♝', '♚', '♛', '♝', '♞', '♜'],
];

const initialBoardUnflipped = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

let initialBoard = initialBoardUnflipped;
let flipped = false;
// const initialBoard = initialBoardFlipped.map(row => [...row]);;
// let flipped = true;

let boardState = JSON.parse(JSON.stringify(initialBoard));

function drawPieces() {
    console.log(boardState)
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = boardState[row][col];
            if (piece !== ' ') {
                ctx.fillStyle = piece === piece.toUpperCase() ? 'black' : 'white';
                ctx.fillText(piece, col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2);
            }
        }
    }
}
