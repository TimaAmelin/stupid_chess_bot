function findAllPossibleMovesForPiece(boardState, selectedPiece, selectedPos) {
    const legalMoveCells = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const validMove = isValidMove(boardState, selectedPiece, selectedPos, { row, col });
            const copyBoardState = boardState.map(row => [...row]);
            let inCheckCastlingLeft = false;
            let inCheckCastlingRight = false;
            if (validMove === 'castling left') {
                copyBoardState[selectedPos.row][3 - flipped] = selectedPiece;
                if (isKingInCheck(turn, copyBoardState)) {
                    inCheckCastlingLeft = true;
                }
            } else if (validMove === 'castling right') {
                copyBoardState[selectedPos.row][5 + flipped] = selectedPiece;
                if (isKingInCheck(turn, copyBoardState)) {
                    inCheckCastlingRight = true;
                }
            }
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;

            if (validMove && !isKingInCheck(turn, copyBoardState) && !inCheckCastlingLeft && !inCheckCastlingRight) {
                legalMoveCells.push({ row, col, validMove })
            }
        }
    }
    return legalMoveCells;
}