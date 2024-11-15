function isValidKingMove(boardState, piece, from, to, rowDiff, colDiff) {
    if (Math.abs(colDiff) > 1 && Math.abs(rowDiff) === 0) {
        if (piece === '♔' && !whiteKingMoved) {
            if (colDiff < 0 && isPathClear(boardState, from, { col: 0, row: from.row }) && !whiteLeftRookMoved) {
                return 'castling left';
            }
            if (colDiff > 0 && isPathClear(boardState, from, { col: 7, row: from.row }) && !whiteRightRookMoved) {
                return 'castling right';
            }
        }
        if (piece === '♚' && !blackKingMoved) {
            if (colDiff < 0 && isPathClear(boardState, from, { col: 0, row: from.row }) && !blackLeftRookMoved) {
                return 'castling left';
            }
            if (colDiff > 0 && isPathClear(boardState, from, { col: 7, row: from.row }) && !blackRightRookMoved) {
                return 'castling right';
            }
        }
    }
    return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
}