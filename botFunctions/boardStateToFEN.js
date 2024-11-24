function boardStateToFEN(boardState, side, whiteKingMoved, whiteLeftRookMoved, whiteRightRookMoved, blackKingMoved, blackLeftRookMoved, blackRightRookMoved) {
    let fen = "";

    // Map the piece symbols to their corresponding FEN characters
    const pieceMap = {
        '♖': 'R', '♘': 'N', '♗': 'B', '♕': 'Q', '♔': 'K', '♚': 'k', // White pieces
        '♜': 'r', '♞': 'n', '♝': 'b', '♛': 'q', '♟': 'p', '♙': 'P', // Black pieces
    };

    // Generate the board part of the FEN
    for (let row = 0; row < 8; row++) {
        let emptySquares = 0;
        for (let col = 0; col < 8; col++) {
            const piece = boardState[row][col];
            if (piece === ' ') {
                emptySquares++;
            } else {
                if (emptySquares > 0) {
                    fen += emptySquares;
                    emptySquares = 0;
                }
                fen += pieceMap[piece] || '';
            }
        }
        if (emptySquares > 0) {
            fen += emptySquares;
        }
        if (row < 7) {
            fen += "/";
        }
    }

    // Add the side to move
    fen += ` ${side === 'white' ? 'w' : 'b'}`;

    // Generate castling availability
    let castling = "";
    if (!whiteKingMoved) {
        if (!whiteLeftRookMoved) castling += "K";
        if (!whiteRightRookMoved) castling += "Q";
    }
    if (!blackKingMoved) {
        if (!blackLeftRookMoved) castling += "k";
        if (!blackRightRookMoved) castling += "q";
    }
    fen += ` ${castling || "-"}`;

    // Placeholder for en passant target square (not implemented here)
    fen += " -";

    // Placeholder for halfmove clock (not implemented here)
    fen += " 0";

    // Placeholder for fullmove number (not implemented here)
    fen += " 1";

    return fen;
}
