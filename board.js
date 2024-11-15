const canvas = document.getElementById('chessBoard');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 50;
const BOARD_SIZE = 8;

function drawBoard(legalMoveCells) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#eee' : '#666';
            ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    ctx.fillStyle = "#ff000099";
    for (const cell of legalMoveCells) {
        ctx.beginPath();
        ctx.arc(cell.col * TILE_SIZE + TILE_SIZE / 2, cell.row * TILE_SIZE + TILE_SIZE / 2, (0.5 * TILE_SIZE) / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
