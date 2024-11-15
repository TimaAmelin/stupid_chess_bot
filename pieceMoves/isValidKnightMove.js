function isValidKnightMove(boardState, rowDiff, colDiff) {
    return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
}