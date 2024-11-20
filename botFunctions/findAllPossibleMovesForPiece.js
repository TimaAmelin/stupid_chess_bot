function findAllPossibleMovesForPiece(
    boardState,
    selectedPiece,
    selectedPos,
    turn,
    whiteKingMoved,
    whiteLeftRookMoved,
    whiteRightRookMoved,
    blackKingMoved,
    blackLeftRookMoved,
    blackRightRookMoved
) {
    const legalMoveCells = [];
    // for (let row = 0; row < BOARD_SIZE; row++) {
    //     for (let col = 0; col < BOARD_SIZE; col++) {
    //         const validMove = isValidMove(
    //             boardState,
    //             selectedPiece,
    //             selectedPos,
    //             { row, col },
    //             whiteKingMoved,
    //             whiteLeftRookMoved,
    //             whiteRightRookMoved,
    //             blackKingMoved,
    //             blackLeftRookMoved,
    //             blackRightRookMoved
    //         );
    //         const copyBoardState = boardState.map(row => [...row]);
    //         let inCheckCastlingLeft = false;
    //         let inCheckCastlingRight = false;
    //         if (validMove === 'castling left') {
    //             copyBoardState[selectedPos.row][3 - flipped] = selectedPiece;
    //             if (isKingInCheck(
    //                 turn,
    //                 copyBoardState,
    //                 whiteKingMoved,
    //                 whiteLeftRookMoved,
    //                 whiteRightRookMoved,
    //                 blackKingMoved,
    //                 blackLeftRookMoved,
    //                 blackRightRookMoved
    //             )) {
    //                 inCheckCastlingLeft = true;
    //             }
    //         } else if (validMove === 'castling right') {
    //             copyBoardState[selectedPos.row][5 + flipped] = selectedPiece;
    //             if (isKingInCheck(
    //                 turn,
    //                 copyBoardState,
    //                 whiteKingMoved,
    //                 whiteLeftRookMoved,
    //                 whiteRightRookMoved,
    //                 blackKingMoved,
    //                 blackLeftRookMoved,
    //                 blackRightRookMoved
    //             )) {
    //                 inCheckCastlingRight = true;
    //             }
    //         }
    //         copyBoardState[selectedPos.row][selectedPos.col] = ' ';
    //         copyBoardState[row][col] = selectedPiece;

    //         if (validMove && !isKingInCheck(
    //             turn,
    //             copyBoardState,
    //             whiteKingMoved,
    //             whiteLeftRookMoved,
    //             whiteRightRookMoved,
    //             blackKingMoved,
    //             blackLeftRookMoved,
    //             blackRightRookMoved
    //         ) && !inCheckCastlingLeft && !inCheckCastlingRight) {
    //             legalMoveCells.push({ row, col, validMove })
    //         }
    //     }
    // }

    if (['♗', '♝'].includes(selectedPiece)) {
        const moves = [
            [-7, -7], [-6, -6], [-5, -5], [-4, -4], [-3, -3], [-2, -2], [-1, -1],
            [7, 7], [6, 6], [5, 5], [4, 4], [3, 3], [2, 2], [1, 1],
            [7, -7], [6, -6], [5, -5], [4, -4], [3, -3], [2, -2], [1, -1],
            [-7, 7], [-6, 6], [-5, 5], [-4, 4], [-3, 3], [-2, 2], [-1, 1]
        ];
        for (const move of moves) {
            let row = selectedPos.row + move[0];
            let col = selectedPos.col + move[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) continue;
            
            let validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                { row, col },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved,
            );
    
            let copyBoardState = JSON.parse(JSON.stringify(boardState));
            
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;
    
            if (validMove && !isKingInCheck(
                turn,
                copyBoardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                legalMoveCells.push({ row, col, validMove });
            }
        }
    }
    if (['♖', '♜'].includes(selectedPiece)) {
        const moves = [
            [-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0],
            [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0],
            [0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1],
            [0, 7], [0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1]
        ];
        for (const move of moves) {
            let row = selectedPos.row + move[0];
            let col = selectedPos.col + move[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) continue;
            
            let validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                { row, col },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved,
            );
    
            let copyBoardState = JSON.parse(JSON.stringify(boardState));
            
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;
    
            if (validMove && !isKingInCheck(
                turn,
                copyBoardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                legalMoveCells.push({ row, col, validMove });
            }
        }
    }
    if (['♘', '♞'].includes(selectedPiece)) {
        const moves = [[-2, -1], [2, -1], [-2, 1], [2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2]];
        for (const move of moves) {
            let row = selectedPos.row + move[0];
            let col = selectedPos.col + move[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) continue;

            let validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                { row, col },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved,
            );
    
            let copyBoardState = JSON.parse(JSON.stringify(boardState));
            
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;
    
            if (validMove && !isKingInCheck(
                turn,
                copyBoardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                legalMoveCells.push({ row, col, validMove });
            }
        }
    }
    if (['♔', '♚'].includes(selectedPiece)) {
        const moves = [
            [-1, -1], [1, 1], [1, -1], [-1, 1], [-1, 0], [1, 0], [0, -1], [0, 1], [0, -2], [0, 2], [0, -3], [0, 3], [0, -4], [0, 4]
        ];
        for (const move of moves) {
            let row = selectedPos.row + move[0];
            let col = selectedPos.col + move[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) continue;
            
            const validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                { row, col },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            );
            const copyBoardState = JSON.parse(JSON.stringify(boardState));
            let inCheckCastlingLeft = false;
            let inCheckCastlingRight = false;
            if (validMove === 'castling left') {
                copyBoardState[selectedPos.row][3 - flipped] = selectedPiece;
                if (isKingInCheck(
                    turn,
                    copyBoardState,
                    whiteKingMoved,
                    whiteLeftRookMoved,
                    whiteRightRookMoved,
                    blackKingMoved,
                    blackLeftRookMoved,
                    blackRightRookMoved
                )) {
                    inCheckCastlingLeft = true;
                }
                copyBoardState[selectedPos.row][5 + flipped] = ' ';
            } else if (validMove === 'castling right') {
                copyBoardState[selectedPos.row][5 + flipped] = selectedPiece;
                if (isKingInCheck(
                    turn,
                    copyBoardState,
                    whiteKingMoved,
                    whiteLeftRookMoved,
                    whiteRightRookMoved,
                    blackKingMoved,
                    blackLeftRookMoved,
                    blackRightRookMoved
                )) {
                    inCheckCastlingRight = true;
                }
                copyBoardState[selectedPos.row][5 + flipped] = ' ';
            }
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;

            if (validMove && !isKingInCheck(
                turn,
                copyBoardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            ) && !inCheckCastlingLeft && !inCheckCastlingRight) {
                legalMoveCells.push({ row, col, validMove })
            }
        }
    }
    if (['♕', '♛'].includes(selectedPiece)) {
        const moves = [
            [-7, -7], [-6, -6], [-5, -5], [-4, -4], [-3, -3], [-2, -2], [-1, -1],
            [7, 7], [6, 6], [5, 5], [4, 4], [3, 3], [2, 2], [1, 1],
            [7, -7], [6, -6], [5, -5], [4, -4], [3, -3], [2, -2], [1, -1],
            [-7, 7], [-6, 6], [-5, 5], [-4, 4], [-3, 3], [-2, 2], [-1, 1],
            [-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0],
            [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0],
            [0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1],
            [0, 7], [0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1]
        ];
        for (const move of moves) {
            let row = selectedPos.row + move[0];
            let col = selectedPos.col + move[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) continue;
            
            let validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                { row, col },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved,
            );
    
            let copyBoardState = JSON.parse(JSON.stringify(boardState));
            
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;
    
            if (validMove && !isKingInCheck(
                turn,
                copyBoardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                legalMoveCells.push({ row, col, validMove });
            }
        }
    }
    if (selectedPiece === '♙') {
        const direction = 2 * flipped - 1;
        const moves = [
            [direction, 0], [direction, 1], [direction, -1], [2 * direction, 0], 
        ];
        for (const move of moves) {
            let row = selectedPos.row + move[0];
            let col = selectedPos.col + move[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) continue;
            
            let validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                { row, col },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved,
            );
    
            let copyBoardState = JSON.parse(JSON.stringify(boardState));
            
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;
    
            if (validMove && !isKingInCheck(
                turn,
                copyBoardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                legalMoveCells.push({ row, col, validMove });
            }
        }
    }
    if (selectedPiece === '♟') {
        const direction = 1 - 2 * flipped;
        const moves = [
            [direction, 0], [direction, 1], [direction, -1], [2 * direction, 0], 
        ];
        for (const move of moves) {
            let row = selectedPos.row + move[0];
            let col = selectedPos.col + move[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) continue;
            
            let validMove = isValidMove(
                boardState,
                selectedPiece,
                selectedPos,
                { row, col },
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved,
            );
    
            let copyBoardState = JSON.parse(JSON.stringify(boardState));
            
            copyBoardState[selectedPos.row][selectedPos.col] = ' ';
            copyBoardState[row][col] = selectedPiece;
    
            if (validMove && !isKingInCheck(
                turn,
                copyBoardState,
                whiteKingMoved,
                whiteLeftRookMoved,
                whiteRightRookMoved,
                blackKingMoved,
                blackLeftRookMoved,
                blackRightRookMoved
            )) {
                legalMoveCells.push({ row, col, validMove });
            }
        }
        
    }
    
    return legalMoveCells;
}