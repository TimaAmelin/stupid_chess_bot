function isKingInCheck(
    turn,
    boardState,
    whiteKingMoved,
    whiteLeftRookMoved,
    whiteRightRookMoved,
    blackKingMoved,
    blackLeftRookMoved,
    blackRightRookMoved
) {
    const king = turn === 'white' ? '♔' : '♚';
    const opponentTurn = turn === 'white' ? 'black' : 'white';

    // Locate the king's position
    let kingPosition = null;
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (boardState[row][col] === king) {
                kingPosition = { row, col };
                break;
            }
        }
        if (kingPosition) break;
    }

    // If we didn't find the king, return false (error case, king should always be on board)
    if (!kingPosition) return false;

    // Check if any opponent piece can move to the king's position
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = boardState[row][col];
            if (piece !== ' ' && isPieceOpponent(piece, opponentTurn)) {
                const from = { row, col };
                const to = kingPosition;

                // Check if the piece can legally move to the king's position
                if (isValidMove(
                    boardState,
                    piece,
                    from,
                    to,
                    whiteKingMoved,
                    whiteLeftRookMoved,
                    whiteRightRookMoved,
                    blackKingMoved,
                    blackLeftRookMoved,
                    blackRightRookMoved
                )) {
                    return true; // King is in check
                }
            }
        }
    }

    return false; // King is not in check
}