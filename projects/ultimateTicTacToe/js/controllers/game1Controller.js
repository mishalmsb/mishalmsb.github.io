angular
  .module("UlticUltacUltoe")
  .controller("TicTacToeController", TicTacToeController);

function TicTacToeController(){
  var arrWin = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6], [0,4,8]];
     this.currentPlayer = "X";
     this.gameWinner = "";
     this.winnerMsg = "";
     this.allDisabled = true;
     this.currentBoard = "";
     var buttonStatus = "";

     this.games = [
       ['','','','','','','','',''],
       ['','','','','','','','',''],
       ['','','','','','','','',''],
       ['','','','','','','','',''],
       ['','','','','','','','',''],
       ['','','','','','','','',''],
       ['','','','','','','','',''],
       ['','','','','','','','',''],
       ['','','','','','','','','']
     ]

     this.checkWin = function(board) {
       console.log(board);
         for(var i = 0 ; i < arrWin.length; i++) {
           var combination = arrWin[i];
           if(board[combination[0]] == board[combination[1]] && board[combination[1]] == board[combination[2]])
               return board[combination[0]];
         }
         return false;
     }

     this.btClicked = function(position , board) {

        this.class = "blue";
       if (this.currentBoard === board || this.currentBoard === "") {
         this.games[board][position] = this.currentPlayer;
         this.currentPlayer = this.currentPlayer == 'X' ? 'O' : 'X';
         this.gameWinner = this.checkWin(this.games[board]);
         if (this.gameWinner) {
             this.winnerMsg = "And the winner is " + this.gameWinner;
             console.log(this.winnerMsg);
         };
         this.currentBoard = position;
       }

     };

     this.desableBt = function(position, board) {
         return this.games[board][position] != buttonStatus;
     };


     var updateMove = function (position) {
       if (position.board == "1") {
         for (var i = 0; i < 8; i++) {
               if (arrWin[i].indexOf(position.mark) >= 0) {
                   arrWin[i][arrWin[i].indexOf(position.mark)]=position.value;
               }
           };
       }

     };

     var checkIfWinner = function(winner) {
         for (var i = 0; i < 8; i++) {
           if (arrWin[i][0] == arrWin[i][1] && arrWin[i][0] == arrWin[i][2]) {
               return winner;
           }
         }
     };

     return this;
}
