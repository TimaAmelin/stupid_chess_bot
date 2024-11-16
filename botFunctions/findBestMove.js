function findBestMove(allPossibleMoves, boardState) {
    let maxEvaluation = -100000000;
    let maxEvaluationMove = allPossibleMoves[0];

    for (const move of shuffleArray(allPossibleMoves)) {
        const copyBoardState = boardState.map(row => [...row]);

        if (move.type === 'castling left') {
            copyBoardState[move.from.row][0] = ' ';
            copyBoardState[move.from.row][3 - flipped] = copyBoardState[move.from.row][move.from.col] === '♔' ? '♖' : '♜';
            copyBoardState[move.from.row][2 - flipped] = copyBoardState[move.from.row][move.from.col];
        } else if (move.type === 'castling right') {
            copyBoardState[move.from.row][7] = ' ';
            copyBoardState[move.from.row][5 - flipped] = copyBoardState[move.from.row][move.from.col] === '♔' ? '♖' : '♜';
            copyBoardState[move.from.row][6 - flipped] = copyBoardState[move.from.row][move.from.col];
        } else {
            if (copyBoardState[move.from.row][move.from.col] === '♙' && move.to.row === flipped * 7) {
                copyBoardState[move.to.row][move.to.col] = '♕';
            } else if (copyBoardState[move.from.row][move.from.col] === '♟' && move.to.row === 7 - flipped * 7) {
                copyBoardState[move.to.row][move.to.col] = '♛';
            } else {
                copyBoardState[move.to.row][move.to.col] = copyBoardState[move.from.row][move.from.col];
            }
        }
        if (move.type === 'en passant') {
            copyBoardState[move.from.row][move.to.col] = ' ';
        }
        copyBoardState[move.from.row][move.from.col] = ' ';

        const allPossibleMovesAfterMove = findAllPossibleMoves(
            copyBoardState,
            turn === 'white' ? 'black' : 'white',
            whiteKingMoved,
            whiteLeftRookMoved,
            whiteRightRookMoved,
            blackKingMoved,
            blackLeftRookMoved,
            blackRightRookMoved
        );

        let minEvaluation = 100000000;

        for (const oppMove of allPossibleMovesAfterMove) {
            const copyBoardState2 = copyBoardState.map(row => [...row]);
                        
            if (oppMove.type === 'castling left') {
                copyBoardState2[oppMove.from.row][0] = ' ';
                copyBoardState2[oppMove.from.row][3 - flipped] = copyBoardState2[oppMove.from.row][oppMove.from.col] === '♔' ? '♖' : '♜';
                copyBoardState2[oppMove.from.row][2 - flipped] = copyBoardState2[oppMove.from.row][oppMove.from.col];
            } else if (oppMove.type === 'castling right') {
                copyBoardState2[oppMove.from.row][7] = ' ';
                copyBoardState2[oppMove.from.row][5 - flipped] = copyBoardState2[oppMove.from.row][oppMove.from.col] === '♔' ? '♖' : '♜';
                copyBoardState2[oppMove.from.row][6 - flipped] = copyBoardState2[oppMove.from.row][oppMove.from.col];
            } else {
                if (copyBoardState2[oppMove.from.row][oppMove.from.col] === '♙' && oppMove.to.row === flipped * 7) {
                    copyBoardState2[oppMove.to.row][oppMove.to.col] = '♕';
                } else if (copyBoardState2[oppMove.from.row][oppMove.from.col] === '♟' && oppMove.to.row === 7 - flipped * 7) {
                    copyBoardState2[oppMove.to.row][oppMove.to.col] = '♛';
                } else {
                    copyBoardState2[oppMove.to.row][oppMove.to.col] = copyBoardState2[oppMove.from.row][oppMove.from.col];
                }
            }
            if (oppMove.type === 'en passant') {
                copyBoardState2[oppMove.from.row][oppMove.to.col] = ' ';
            }
            copyBoardState2[oppMove.from.row][oppMove.from.col] = ' ';

            let evaluation = evaluatePosition(copyBoardState2, turn === 'white' ? 'black' : 'white');

            if (allPossibleMovesAfterMove.length < 10) {
                evaluation -= 0.1;
                evaluation += allPossibleMovesAfterMove.length * 0.01;
            }
            evaluation -= isKingInCheck(turn === 'white' ? 'black' : 'white', copyBoardState);
            evaluation += isKingInCheck(turn, copyBoardState2);

            if (-1 * evaluation < minEvaluation) {
                minEvaluation = -1 * evaluation;
            }
        }
        
        if (minEvaluation > maxEvaluation) {
            maxEvaluation = minEvaluation;
            maxEvaluationMove = move;
        }
    }
    
    const bestMove = maxEvaluationMove;

    return bestMove;
}