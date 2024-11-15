function isValidQueenMove(boardState, from, to) {
    // Queen moves like a Rook or a Bishop
    return isValidRookMove(boardState, from, to) || isValidBishopMove(boardState, from, to);
}