function findBestMoveRecursive(allPossibleMoves, boardState, side, depth = 2) {
    let maxEvaluation = -1000000000;
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

        if (depth === 0) {
            if (isKingInCheck(turn === 'white' ? 'black' : 'white', copyBoardState)) {
                const allPossibleMovesAfterMove = findAllPossibleMoves(copyBoardState, turn === 'white' ? 'black' : 'white');
                const evaluation = allPossibleMovesAfterMove.length !== 0 ? evaluatePosition(copyBoardState, side) : 10000000;
                if (evaluation > maxEvaluation) {
                    maxEvaluation = evaluation;
                    maxEvaluationMove = move;
                }
                continue;
            }
            const evaluation = evaluatePosition(copyBoardState, side);
            if (evaluation > maxEvaluation) {
                maxEvaluation = evaluation;
                maxEvaluationMove = move;
            }
            continue;
        }

        const allPossibleMovesAfterMove = findAllPossibleMoves(copyBoardState, turn === 'white' ? 'black' : 'white');

        const {evaluation} = findBestMoveRecursive(allPossibleMovesAfterMove, copyBoardState, side === 'white' ? 'black' : 'white', depth - 1);

        if (-1 * evaluation > maxEvaluation) {
            maxEvaluation = -1 * evaluation;
            maxEvaluationMove = move;
        }
    }
    
    const bestMove = maxEvaluationMove;

    return {bestMove, evaluation: maxEvaluation};
}