function evaluatePosition(boardState, side) {
    let evaluation = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (boardState[row][col] === ' ') continue;
            evaluation += (2 * isPieceYour(boardState[row][col], side) - 1) * pieceValues[boardState[row][col]];
        }
    }

    return evaluation;
}