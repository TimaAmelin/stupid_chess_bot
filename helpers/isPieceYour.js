function isPieceYour(piece, turn) {
    const blackPieces = ['♚', '♛', '♜', '♝', '♞', '♟'];
    const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];

    if (turn === 'black') {
        return blackPieces.includes(piece); // Opponent pieces are black
    } else if (turn === 'white') {
        return whitePieces.includes(piece); // Opponent pieces are white
    }
    return false; // Empty squares or invalid pieces
}