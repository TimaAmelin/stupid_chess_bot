function isValidPawnMove(boardState, piece, from, to, rowDiff, colDiff, targetSquare, direction) {
    // Standard move: move forward one square if the destination is empty
    if (colDiff === 0 && rowDiff === direction && targetSquare === ' ') {
        return true;
    }

    // Double move: move forward two squares if starting from the initial position and both squares are empty
    const startingRow = (flipped ? piece === '♙' : piece === '♟') ? 1 : 6;
    if (colDiff === 0 && rowDiff === 2 * direction && targetSquare === ' ' &&
        from.row === startingRow && boardState[from.row + direction][from.col] === ' ') {
        return true;
    }

    // Capture move: move diagonally one square if capturing an opponent's piece
    if (Math.abs(colDiff) === 1 && rowDiff === direction && targetSquare !== ' ' &&
        !isSameColor(piece, targetSquare)) {
        return true;
    }

    if (lastMove && Math.abs(colDiff) === 1 && rowDiff === direction && targetSquare === ' ') {
        // Check if last move was a double pawn move from the opponent
        const opponentPawnRow = from.row;
        const enPassantPawn = piece === '♙' ? '♟' : '♙';
        if (lastMove &&
            lastMove.piece === enPassantPawn &&
            lastMove.from.row === opponentPawnRow + 2 * direction &&
            lastMove.to.row === from.row &&
            lastMove.to.col === to.col) {
            return 'en passant'; // En passant is valid
        }
    }

    return false;
}