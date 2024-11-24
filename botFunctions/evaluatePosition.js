const table = {
    '♖': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0.005, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [0, 0, 0, 0.005, 0.005, 0, 0, 0]
    ],
    '♘': [
        [-0.05, -0.04, -0.03, -0.03, -0.03, -0.03, -0.04, -0.05],
        [-0.04, -0.02, 0, 0, 0, 0, -0.02, -0.04],
        [-0.03, 0, 0.01, 0.015, 0.015, 0.01, 0, -0.03],
        [-0.03, 0.005, 0.015, 0.02, 0.02, 0.015, 0.005, -0.03],
        [-0.03, 0, 0.015, 0.02, 0.02, 0.015, 0, -0.03],
        [-0.03, 0.005, 0.01, 0.015, 0.015, 0.01, 0.005, -0.03],
        [-0.04, -0.02, 0, 0.005, 0.005, 0, -0.02, -0.04],
        [-0.05, -0.04, -0.03, -0.03, -0.03, -0.03, -0.04, -0.05]
    ],
    '♗': [
        [-0.02, -0.01, -0.04, -0.01, -0.01, -0.04, -0.01, -0.02],
        [-0.01, 0.02, 0, 0, 0, 0, 0.02, -0.01],
        [-0.01, 0, 0.005, 0.01, 0.01, 0.005, 0, -0.01],
        [-0.01, 0.005, 0.005, 0.01, 0.01, 0.005, 0.005, -0.01],
        [-0.01, 0, 0.01, 0.01, 0.01, 0.01, 0, -0.01],
        [-0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, -0.01],
        [-0.01, 0.005, 0, 0, 0, 0, 0.005, -0.01],
        [-0.02, -0.01, -0.01, -0.01, -0.01, -0.01, -0.01, -0.02]
    ],
    '♕': [
        [-0.02, -0.01, -0.01, -0.005, -0.005, -0.01, -0.01, -0.02],
        [-0.01, 0, 0, 0, 0, 0, 0, -0.01],
        [-0.01, 0, 0.005, 0.005, 0.005, 0.005, 0, -0.01],
        [-0.005, 0, 0.005, 0.005, 0.005, 0.005, 0, -0.005],
        [0, 0, 0.005, 0.005, 0.005, 0.005, 0, -0.005],
        [-0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0, -0.01],
        [-0.01, 0, 0.005, 0, 0, 0, 0, -0.01],
        [-0.02, -0.01, -0.01, -0.005, -0.005, -0.01, -0.01, -0.02]
    ],
    '♜': [
        [0, 0, 0, 0.005, 0.005, 0, 0, 0],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [-0.005, 0, 0, 0, 0, 0, 0, -0.005],
        [0.005, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.005],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '♞': [
        [-0.05, -0.04, -0.03, -0.03, -0.03, -0.03, -0.04, -0.05],
        [-0.04, -0.02, 0, 0.005, 0.005, 0, -0.02, -0.04],
        [-0.03, 0.005, 0.01, 0.015, 0.015, 0.01, 0.005, -0.03],
        [-0.03, 0, 0.015, 0.02, 0.02, 0.015, 0, -0.03],
        [-0.03, 0.005, 0.015, 0.02, 0.02, 0.015, 0.005, -0.03],
        [-0.03, 0, 0.01, 0.015, 0.015, 0.01, 0, -0.03],
        [-0.04, -0.02, 0, 0, 0, 0, -0.02, -0.04],
        [-0.05, -0.04, -0.03, -0.03, -0.03, -0.03, -0.04, -0.05]
    ],
    '♝': [
        [-0.02, -0.01, -0.01, -0.01, -0.01, -0.01, -0.01, -0.02],
        [-0.01, 0.005, 0, 0, 0, 0, 0.005, -0.01],
        [-0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, -0.01],
        [-0.01, 0, 0.01, 0.01, 0.01, 0.01, 0, -0.01],
        [-0.01, 0.005, 0.005, 0.01, 0.01, 0.005, 0.005, -0.01],
        [-0.01, 0, 0.005, 0.01, 0.01, 0.005, 0, -0.01],
        [-0.01, 0.02, 0, 0, 0, 0, 0.02, -0.01],
        [-0.02, -0.01, -0.04, -0.01, -0.01, -0.04, -0.01, -0.02]
    ],
    '♛': [
        [-0.02, -0.01, -0.01, -0.005, -0.005, -0.01, -0.01, -0.02],
        [-0.01, 0, 0.005, 0, 0, 0, 0, -0.01],
        [-0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0, -0.01],
        [0, 0, 0.005, 0.005, 0.005, 0.005, 0, -0.005],
        [-0.005, 0, 0.005, 0.005, 0.005, 0.005, 0, -0.005],
        [-0.01, 0, 0.005, 0.005, 0.005, 0.005, 0, -0.01],
        [-0.01, 0, 0, 0, 0, 0, 0, -0.01],
        [-0.02, -0.01, -0.01, -0.005, -0.005, -0.01, -0.01, -0.02]
    ],
};

const kingMiddle = {
    '♔': [
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03],
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03],
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03],
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03],
        [-0.02, -0.03, -0.03, -0.04, -0.04, -0.03, -0.03, -0.02],
        [-0.01, -0.02, -0.02, -0.02, -0.02, -0.02, -0.02, -0.01],
        [-0.005, -0.005, -0.02, -0.02, -0.02, -0.02, -0.005, -0.005],
        [0.02, 0.03, 0.02, 0, 0, 0.01, 0.03, 0.02]
    ],
    '♚': [
        [0.02, 0.03, 0.02, 0, 0, 0.01, 0.03, 0.02],
        [-0.005, -0.005, -0.02, -0.02, -0.02, -0.02, -0.005, -0.005],
        [-0.01, -0.02, -0.02, -0.02, -0.02, -0.02, -0.02, -0.01],
        [-0.02, -0.03, -0.03, -0.04, -0.04, -0.03, -0.03, -0.02],
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03],
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03],
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03],
        [-0.03, -0.04, -0.04, -0.05, -0.05, -0.04, -0.04, -0.03]
    ],
};

const kingEnd = {
    '♔': [
        [-0.05, -0.04, -0.03, -0.02, -0.02, -0.03, -0.04, -0.05],
        [-0.03, -0.02, -0.01, 0, 0, -0.01, -0.02, -0.03],
        [-0.03, -0.01, 0.02, 0.03, 0.03, 0.02, -0.01, -0.03],
        [-0.03, -0.01, 0.03, 0.04, 0.04, 0.03, -0.01, -0.03],
        [-0.03, -0.01, 0.03, 0.04, 0.04, 0.03, -0.01, -0.03],
        [-0.03, -0.01, 0.02, 0.03, 0.03, 0.02, -0.01, -0.03],
        [-0.03, -0.03, 0, 0, 0, 0, -0.03, -0.03],
        [-0.05, -0.03, -0.03, -0.03, -0.03, -0.03, -0.03, -0.05]
    ],
    '♚': [
        [-0.05, -0.03, -0.03, -0.03, -0.03, -0.03, -0.03, -0.05],
        [-0.03, -0.03, 0, 0, 0, 0, -0.03, -0.03],
        [-0.03, -0.01, 0.02, 0.03, 0.03, 0.02, -0.01, -0.03],
        [-0.03, -0.01, 0.03, 0.04, 0.04, 0.03, -0.01, -0.03],
        [-0.03, -0.01, 0.03, 0.04, 0.04, 0.03, -0.01, -0.03],
        [-0.03, -0.01, 0.02, 0.03, 0.03, 0.02, -0.01, -0.03],
        [-0.03, -0.02, -0.01, 0, 0, -0.01, -0.02, -0.03],
        [-0.05, -0.04, -0.03, -0.02, -0.02, -0.03, -0.04, -0.05]
    ],
};

const pawnsMiddle = {
    '♙': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0.05, 0.05, 0.07, 0.07, 0.07, 0.05, 0.05, 0.05],
        [0.01, 0.01, 0.02, 0.06, 0.06, 0.02, 0.01, 0.01],
        [0.005, 0.005, 0.01, 0.055, 0.055, 0.01, 0.005, 0.005],
        [0.005, 0, 0, 0.05, 0.05, 0, 0, 0.005],
        [0.005, -0.005, -0.01, 0, 0, -0.01, -0.005, 0.005],
        [0.005, 0.01, 0.01, -0.02, -0.02, 0.01, 0.01, 0.005],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '♟': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0.005, 0.01, 0.01, -0.02, -0.02, 0.01, 0.01, 0.005],
        [0.005, -0.005, -0.01, 0, 0, -0.01, -0.005, 0.005],
        [0.005, 0, 0, 0.05, 0.05, 0, 0, 0.005],
        [0.005, 0.005, 0.01, 0.025, 0.025, 0.01, 0.005, 0.005],
        [0.01, 0.01, 0.02, 0.03, 0.03, 0.02, 0.01, 0.01],
        [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
};

const pawnsEnd = {
    '♙': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2],
        [1.6, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.6],
        [1, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1],
        [0.6, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6],
        [0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3],
        [-0.03, -0.03, 0, 0, 0, 0, -0.03, -0.03],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    '♟': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [-0.03, -0.03, 0, 0, 0, 0, -0.03, -0.03],
        [0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3],
        [0.6, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6],
        [1, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1],
        [1.6, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.6],
        [2, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
};

function evaluatePosition(
    boardState,
    side,
    whiteKingMoved,
    whiteLeftRookMoved,
    whiteRightRookMoved,
    blackKingMoved,
    blackLeftRookMoved,
    blackRightRookMoved
) {
    let evaluation = 0;
    let yourPieceMaterial = 0;
    let oppPieceMaterial = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (boardState[row][col] === ' ') continue;
            evaluation += (2 * isPieceYour(boardState[row][col], side) - 1) * pieceValues[boardState[row][col]];

            if (isPieceYour(boardState[row][col], side) && boardState[row][col] !== '♙' && boardState[row][col] !== '♟') {
                yourPieceMaterial += pieceValues[boardState[row][col]];
            } else {
                oppPieceMaterial += pieceValues[boardState[row][col]];
            }

            if (isPieceYour(boardState[row][col], side)) {
                if (boardState[row][col] !== '♚' && boardState[row][col] !== '♔' && boardState[row][col] !== '♟' && boardState[row][col] !== '♙') {
                    evaluation += table[boardState[row][col]][flipped ? 7 - row : row][col];
                } else if (boardState[row][col] === '♚' || boardState[row][col] === '♔') {
                    if (yourPieceMaterial <= 13 && oppPieceMaterial <= 13) {
                        evaluation += kingEnd[boardState[row][col]][flipped ? 7 - row : row][col];
                    } else {
                        evaluation += kingMiddle[boardState[row][col]][flipped ? 7 - row : row][col];
                    }
                } else if (boardState[row][col] === '♟' || boardState[row][col] === '♙') {
                    if (yourPieceMaterial <= 13 && oppPieceMaterial <= 13) {
                        evaluation += pawnsEnd[boardState[row][col]][flipped ? 7 - row : row][col];
                    } else {
                        evaluation += pawnsMiddle[boardState[row][col]][flipped ? 7 - row : row][col];
                    }
                }
            } else {
                if (boardState[row][col] !== '♚' && boardState[row][col] !== '♔' && boardState[row][col] !== '♟' && boardState[row][col] !== '♙') {
                    evaluation -= table[boardState[row][col]][flipped ? 7 - row : row][col];
                } else if (boardState[row][col] === '♚' || boardState[row][col] === '♔') {
                    if (yourPieceMaterial <= 13 && oppPieceMaterial <= 13) {
                        evaluation -= kingEnd[boardState[row][col]][flipped ? 7 - row : row][col];
                    } else {
                        evaluation -= kingMiddle[boardState[row][col]][flipped ? 7 - row : row][col];
                    }
                } else if (boardState[row][col] === '♟' || boardState[row][col] === '♙') {
                    if (yourPieceMaterial <= 13 && oppPieceMaterial <= 13) {
                        evaluation -= pawnsEnd[boardState[row][col]][flipped ? 7 - row : row][col];
                    } else {
                        evaluation -= pawnsMiddle[boardState[row][col]][flipped ? 7 - row : row][col];
                    }
                }
            }
        }
    }

    if (isKingInCheck(
        side === 'white' ? 'black' : 'white',
        boardState,
        whiteKingMoved,
        whiteLeftRookMoved,
        whiteRightRookMoved,
        blackKingMoved,
        blackLeftRookMoved,
        blackRightRookMoved
    )) {
        evaluation += 0.5;
    }

    return evaluation - 0.1 + Math.random() * 0.2;
}