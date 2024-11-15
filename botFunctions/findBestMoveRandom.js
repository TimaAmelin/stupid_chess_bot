function findBestMoveRandom(allPossibleMoves, boardState) {
    const moves = [];

    for (const m of allPossibleMoves) {
        if (boardState[m.to.row][m.to.col] !== ' ') {
            moves.push(
                { 
                    ...m,
                    weight: pieceValues[boardState[m.to.row][m.to.col]] - pieceValues[boardState[m.from.row][m.from.col]] + 0.5,
                }
            );
        } else {
            moves.push(
                { 
                    ...m,
                    weight: 0,
                }
            );
        }
    }

    const movesByWeight = shuffleArray(moves).sort((moveA, moveB) => moveB.weight - moveA.weight);

    const bestMove = movesByWeight[0];

    return bestMove;
}