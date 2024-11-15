function isPathClear(boardState, from, to) {
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);

    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;

    while (currentRow !== to.row || currentCol !== to.col) {
        if (boardState[currentRow][currentCol] !== ' ') return false;
        currentRow += rowStep;
        currentCol += colStep;
    }

    return true;
}