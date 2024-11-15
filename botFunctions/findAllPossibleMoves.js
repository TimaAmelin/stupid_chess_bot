function findAllPossibleMoves(boardState) {
    const allPossibleMoves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (boardState[row][col] === ' ') continue;
            if (
                (['♖', '♘', '♗', '♕', '♔', '♙'].includes(boardState[row][col]) && turn === 'white') ||
                (['♜', '♞', '♝', '♛', '♚', '♟'].includes(boardState[row][col]) && turn === 'black')
            ) {
                const possibleMovesForPiece = findAllPossibleMovesForPiece(boardState, boardState[row][col], { row, col });

                for (const move of possibleMovesForPiece) {
                    allPossibleMoves.push({ from: { row, col }, to: { row: move.row, col: move.col }, piece: boardState[row][col], type: move.validMove });
                }
            }
        }
    }
    return allPossibleMoves;
}