function findAllPossibleMoves(
    boardState,
    turn,
    whiteKingMoved,
    whiteLeftRookMoved,
    whiteRightRookMoved,
    blackKingMoved,
    blackLeftRookMoved,
    blackRightRookMoved
) {
    // The optimized search engine is loaded later by index.html, but is
    // available by the time this function is called from the game. Reusing its
    // ray-based legal generator keeps UI mate checks consistent with the bot.
    if (typeof searchPositionFromArguments === 'function' &&
        typeof searchGenerateLegalMoves === 'function') {
        return searchGenerateLegalMoves(searchPositionFromArguments(
            boardState,
            turn,
            whiteKingMoved,
            whiteLeftRookMoved,
            whiteRightRookMoved,
            blackKingMoved,
            blackLeftRookMoved,
            blackRightRookMoved
        ));
    }

    const allPossibleMoves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (boardState[row][col] === ' ') continue;
            if (
                (['♖', '♘', '♗', '♕', '♔', '♙'].includes(boardState[row][col]) && turn === 'white') ||
                (['♜', '♞', '♝', '♛', '♚', '♟'].includes(boardState[row][col]) && turn === 'black')
            ) {
                const possibleMovesForPiece = findAllPossibleMovesForPiece(
                    boardState,
                    boardState[row][col],
                    { row, col },
                    turn,
                    whiteKingMoved,
                    whiteLeftRookMoved,
                    whiteRightRookMoved,
                    blackKingMoved,
                    blackLeftRookMoved,
                    blackRightRookMoved
                );

                for (const move of possibleMovesForPiece) {
                    allPossibleMoves.push({ from: { row, col }, to: { row: move.row, col: move.col }, piece: boardState[row][col], type: move.validMove });
                }
            }
        }
    }

    return allPossibleMoves;
}
