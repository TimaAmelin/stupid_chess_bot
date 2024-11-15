function isValidBishopMove(boardState, from, to) {
    if (Math.abs(to.row - from.row) !== Math.abs(to.col - from.col)) return false;
    return isPathClear(boardState, from, to);
}