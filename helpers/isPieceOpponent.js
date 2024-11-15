function isPieceOpponent(piece, turn) {
    const whiteDangerPieces = ['♚', '♛', '♜', '♝', '♞', '♟'];
    const blackDangerPieces = ['♔', '♕', '♖', '♗', '♘', '♙'];

    if (turn === 'white') {
        return blackDangerPieces.includes(piece); // Opponent pieces are black
    } else if (turn === 'black') {
        return whiteDangerPieces.includes(piece); // Opponent pieces are white
    }
    return false; // Empty squares or invalid pieces
}