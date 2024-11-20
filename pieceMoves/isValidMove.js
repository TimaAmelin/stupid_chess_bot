function isValidMove(boardState, piece, from, to, whiteKingMoved, whiteLeftRookMoved, whiteRightRookMoved, blackKingMoved, blackLeftRookMoved, blackRightRookMoved) {
    // Prevent moving out of bounds
    if (to.row < 0 || to.row >= BOARD_SIZE || to.col < 0 || to.col >= BOARD_SIZE) return false;
    const targetSquare = boardState[to.row][to.col];

    // Prevent moving onto a piece of the same color
    if (
        targetSquare !== ' ' &&
        isSameColor(piece, targetSquare) && 
        !(
            (selectedPiece === '♔' && !whiteKingMoved && (to.col === 0 || to.col === 7)) ||
            (selectedPiece === '♚' && !blackKingMoved && (to.col === 0 || to.col === 7))
        )
    ) return false;

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    switch (piece.toLowerCase()) {
        case '♙': // White Pawn
            return isValidPawnMove(boardState, piece, from, to, rowDiff, colDiff, targetSquare, 2 * flipped - 1);
        case '♟': // Black Pawn
            return isValidPawnMove(boardState, piece, from, to, rowDiff, colDiff, targetSquare, 1 - 2 * flipped);
        case '♖': case '♜': // Rook
            return isValidRookMove(boardState, from, to);
        case '♘': case '♞': // Knight
            return isValidKnightMove(boardState, rowDiff, colDiff);
        case '♗': case '♝': // Bishop
            return isValidBishopMove(boardState, from, to);
        case '♕': case '♛': // Queen
            return isValidQueenMove(boardState, from, to);
        case '♔': case '♚': // King
            return isValidKingMove(boardState, piece, from, to, rowDiff, colDiff, whiteKingMoved, whiteLeftRookMoved, whiteRightRookMoved, blackKingMoved, blackLeftRookMoved, blackRightRookMoved);
        default:
            return false;
    }
}