const newGameWhite = document.getElementById('new_game_white');
const newGameBlack = document.getElementById('new_game_black');
const newGameBothUF = document.getElementById('new_game_both_uf');
const newGameBothF = document.getElementById('new_game_both_f');

newGameWhite.addEventListener('click', () => {
    if (movable) {
        boardState = initialBoardUnflipped.map(row => [...row]);;
        flipped = false;
        bot = 'black';
        turn = 'white';
        render([]);
        lastMove = null;
        
        whiteKingMoved = false;
        blackKingMoved = false;
        whiteLeftRookMoved = false;
        whiteRightRookMoved = false;
        blackLeftRookMoved = false;
        blackRightRookMoved = false;
    }
});

newGameBlack.addEventListener('click', () => {
    if (movable) {
        boardState = initialBoardFlipped.map(row => [...row]);;
        flipped = true;
        bot = 'white';
        turn = 'white';
        movable = 'false';
        lastMove = null;
        
        whiteKingMoved = false;
        blackKingMoved = false;
        whiteLeftRookMoved = false;
        whiteRightRookMoved = false;
        blackLeftRookMoved = false;
        blackRightRookMoved = false;
        render([]);
        setTimeout(() => {
            const allPossibleMoves = findAllPossibleMoves(boardState, turn);
        
            const move = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
        
            boardState[move.to.row][move.to.col] = boardState[move.from.row][move.from.col];
            boardState[move.from.row][move.from.col] = ' ';
        
            turn = 'black';
            render([]);
            movable = true;
        }, 500);
    }
});

newGameBothUF.addEventListener('click', () => {
    if (movable) {
        boardState = initialBoardUnflipped.map(row => [...row]);;
        flipped = false;
        bot = 'none';
        turn = 'white';
        render([]);
        lastMove = null;
        
        whiteKingMoved = false;
        blackKingMoved = false;
        whiteLeftRookMoved = false;
        whiteRightRookMoved = false;
        blackLeftRookMoved = false;
        blackRightRookMoved = false;
    }
});

newGameBothF.addEventListener('click', () => {
    if (movable) {
        boardState = initialBoardFlipped.map(row => [...row]);;
        flipped = true;
        bot = 'none';
        turn = 'white';
        render([]);
        lastMove = null;
        
        whiteKingMoved = false;
        blackKingMoved = false;
        whiteLeftRookMoved = false;
        whiteRightRookMoved = false;
        blackLeftRookMoved = false;
        blackRightRookMoved = false;
    }
});