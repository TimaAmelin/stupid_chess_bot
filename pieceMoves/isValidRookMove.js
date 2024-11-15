function isValidRookMove(boardState, from, to) {
    if (from.row !== to.row && from.col !== to.col) return false;
    return isPathClear(boardState, from, to);
}