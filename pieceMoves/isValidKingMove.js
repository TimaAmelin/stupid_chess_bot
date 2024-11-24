function isValidKingMove(boardState, piece, from, to, rowDiff, colDiff, whiteKingMoved, whiteLeftRookMoved, whiteRightRookMoved, blackKingMoved, blackLeftRookMoved, blackRightRookMoved) {
    if (Math.abs(colDiff) > 1 && Math.abs(rowDiff) === 0) {
        if (piece === '♔' && !whiteKingMoved) {
            if (colDiff < 0 && isPathClear(boardState, from, { col: 0, row: from.row }) && !whiteLeftRookMoved && !isKingInCheck(
                'white',
                boardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                return 'castling left';
            }
            if (colDiff > 0 && isPathClear(boardState, from, { col: 7, row: from.row }) && !whiteRightRookMoved && !isKingInCheck(
                'white',
                boardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                return 'castling right';
            }
        }
        if (piece === '♚' && !blackKingMoved) {
            if (colDiff < 0 && isPathClear(boardState, from, { col: 0, row: from.row }) && !blackLeftRookMoved && !isKingInCheck(
                'black',
                boardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                return 'castling left';
            }
            if (colDiff > 0 && isPathClear(boardState, from, { col: 7, row: from.row }) && !blackRightRookMoved && !isKingInCheck(
                'black',
                boardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                return 'castling right';
            }
        }
    }
    return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
}