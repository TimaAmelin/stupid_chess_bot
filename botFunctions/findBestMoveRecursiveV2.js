function findBestMoveWithMinimax(
    boardState,
    side,
    whiteKingMoved,
    whiteLeftRookMoved,
    whiteRightRookMoved,
    blackKingMoved,
    blackLeftRookMoved,
    blackRightRookMoved,
    depth = 4,
    isMaximizing = true,
    alpha = -Infinity,
    beta = Infinity
) {
    if (depth === 0) {
        return { evaluation: evaluatePosition(boardState, side, whiteKingMoved, whiteLeftRookMoved, whiteRightRookMoved, blackKingMoved, blackLeftRookMoved, blackRightRookMoved) };
    }

    const allPossibleMoves = shuffleArray(
        findAllPossibleMoves(
            boardState,
            side,
            whiteKingMoved,
            whiteLeftRookMoved,
            whiteRightRookMoved,
            blackKingMoved,
            blackLeftRookMoved,
            blackRightRookMoved
        )
    );

    // Проверка на отсутствие возможных ходов
    if (allPossibleMoves.length === 0) {
        if (isKingInCheck(
            side,
            boardState,
            whiteKingMoved,
            whiteLeftRookMoved,
            whiteRightRookMoved,
            blackKingMoved,
            blackLeftRookMoved,
            blackRightRookMoved
        )) {
            // Мат
            return { evaluation: isMaximizing ? -Infinity : Infinity }; // Мат плох для текущей стороны
        } else {
            // Пат
            return { evaluation: 0 }; // Ничья
        }
    }

    let bestEvaluation = isMaximizing ? -Infinity : Infinity;
    let bestMove = allPossibleMoves[0];

    for (const move of allPossibleMoves) {
        const copyBoardState = JSON.parse(JSON.stringify(boardState));

        if (move.type === 'castling left') {
            copyBoardState[move.from.row][0] = ' ';
            copyBoardState[move.from.row][3] = copyBoardState[move.from.row][move.from.col] === '♔' ? '♖' : '♜';
            copyBoardState[move.from.row][2] = copyBoardState[move.from.row][move.from.col];
        } else if (move.type === 'castling right') {
            copyBoardState[move.from.row][7] = ' ';
            copyBoardState[move.from.row][5] = copyBoardState[move.from.row][move.from.col] === '♔' ? '♖' : '♜';
            copyBoardState[move.from.row][6] = copyBoardState[move.from.row][move.from.col];
        } else {
            if (copyBoardState[move.from.row][move.from.col] === '♙' && move.to.row === 7) {
                copyBoardState[move.to.row][move.to.col] = '♕';
            } else if (copyBoardState[move.from.row][move.from.col] === '♟' && move.to.row === 0) {
                copyBoardState[move.to.row][move.to.col] = '♛';
            } else {
                copyBoardState[move.to.row][move.to.col] = copyBoardState[move.from.row][move.from.col];
            }
        }
        if (move.type === 'en passant') {
            copyBoardState[move.from.row][move.to.col] = ' ';
        }
        copyBoardState[move.from.row][move.from.col] = ' ';

        const opponentSide = side === 'white' ? 'black' : 'white';

        const result = findBestMoveWithMinimax(
            copyBoardState,
            opponentSide,
            whiteKingMoved,
            whiteLeftRookMoved,
            whiteRightRookMoved,
            blackKingMoved,
            blackLeftRookMoved,
            blackRightRookMoved,
            depth - 1,
            !isMaximizing,
            alpha,
            beta
        );

        const evaluation = result.evaluation;

        if (isMaximizing) {
            if (evaluation > bestEvaluation) {
                bestEvaluation = evaluation;
                bestMove = move;
            }
            alpha = Math.max(alpha, evaluation);
        } else {
            if (evaluation < bestEvaluation) {
                bestEvaluation = evaluation;
                bestMove = move;
            }
            beta = Math.min(beta, evaluation);
        }

        if (beta <= alpha) break; // Отсечение
    }

    return { bestMove, evaluation: bestEvaluation };
}
