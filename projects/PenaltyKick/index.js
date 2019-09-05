$(init)
function init() { 

  var numbGames = 10;

  var goalSound = function (goal) {
      var gAudio = document.getElementById("audioGoal");

      if (goal=="in") {
          gAudio.src = "sounds/goal2.mp3";

      } else if (goal=="out"){
          gAudio.src = "sounds/missed.mp3";
      } 
      gAudio.play();
      var bgAudio = document.getElementById("audioCrowd");
      bgAudio.src = "sounds/crowd2.mp3";
      bgAudio.loop = true;
      bgAudio.play();
  }
  

  // $("#goalDiv").hide();
  // $("#missedDiv").hide();
  // $("#plScored").hide();
  

  $("button").click(function() {
    if (this.id=="btLeftBottom"){startKickOff(-25,210,1)}
    else if (this.id=="btLeftCentre"){startKickOff(-55,213,2)}
    else if (this.id=="btLeftTop"){startKickOff(-90,213,3)}
    else if (this.id=="btCentreCentre"){startKickOff(-40,345,4)}
    else if (this.id=="btCentreTop"){startKickOff(-90,345,5)}
    else if (this.id=="btRigthBottom"){startKickOff(-30,475,6)}
    else if (this.id=="btRigthCentre"){startKickOff(-55,475,7)}
    else if (this.id=="btRigthTop"){startKickOff(-90,475,8)}
    else if (this.id=="btRestart"){restartGame()}
  });

  var restartGame = function() {
      $('#plScored').text("");
      $('#p1ResultDiv').text(0);
      $('#p2ResultDiv').text(0);
      $('#counterDiv').text(0);
      $('#plMove').text("Player 1 Turn");
      $("#btRest").hide();
      $("#btWrap").show();
  }

  var startKickOff = function(ballPosX, ballPosY, plMove) {
     
      animePlayer();
      var comMove = computerMove(plMove);
      checkMoves(plMove,comMove);
      keeperInstruct(comMove);
      MoveBall(ballPosX, ballPosY);
      keeperFall();

      setTimeout(function() {
          MoveBall(150, 345); 
          keeperMove(0,310,125);
          nextPlayer();
      },3000);

      setTimeout(function() {      
        $("#goalDiv").hide();
        $("#missedDiv").hide();
      },4000);

      checkGameStatus();
      $("#goalDiv").hide();
      
  };

  var checkGameStatus = function() {
    var counter = parseInt($('#counterDiv').text()) + 1;
    var p1 = parseInt($('#p1ResultDiv').text());
    var p2 = parseInt($('#p2ResultDiv').text());
    if (counter==numbGames && p1==p2) {
      numbGames=numbGames+2;
    }
    if (counter < numbGames) { 
      $('#counterDiv').text(counter);
    } else {
      $('#counterDiv').text("GAME OVER");
        $("#btWrap").hide();
        $("#btRest").show();
        $('#plMove').text("");
         if (p1 > p2) {
             $("#plMove").text("Player 1 Wins");
         } else {
           $("#plMove").text("Player 2 Wins");
         }   
    }

  }
  var computerMove = function(plMove) {
    if (plMove>=1 && plMove<=3) {
        return (Math.floor(Math.random()*(3-1+1))+1);
    } 
    else if (plMove>=4 && plMove<=5) {
        return (Math.floor(Math.random()*(5-4+1))+4);
    }
    else if (plMove>=6 && plMove<=8) {
        return (Math.floor(Math.random()*(8-6+1))+6);
    }    
  }

  var ballInside = function(inOut) {

      if(inOut=="in") {
            setTimeout(function() {
                $(".ball").css({"margin-top": "-40px","margin-right": "0px","margin-bottom": "0px","margin-left": "350px"});
                goalSound("in");
            }, 900);
            setTimeout(function() {
               $("#goalDiv").show();
               goalSound();
            }, 2500);
      } else if (inOut=="out") { 
          goalSound("out");
          setTimeout(function() {
              $(".ball").css({"margin-top": "30px","margin-right": "0px","margin-bottom": "0px","margin-left": "240px"});
          }, 900);
          setTimeout(function() {
               $("#missedDiv").show();
          }, 2500);
      }
  }

  var MoveBall = function(top, left) {
    $(".ball").css({"margin-top": top,"margin-right": "0px","margin-bottom": "0px","margin-left": left});
  }

  var keeperInstruct = function(move) {

      switch(move) { 
          case 1: //keeperMoveLeftBottom
            keeperMove("-90","205","140");
              break;
          case 2: //keeperMoveLeftCentre
            keeperMove("-90","205","120");
            break;          
          case 3: //keeperMoveLeftTop
            keeperMove("-90","205","90");
            break;
         case 4: // keeperMoveCenter
            keeperMove("0","310","135");
            break;          
          case 5: // keeperMoveCenterTop
            keeperMove("0","310","105");
            break;
          case 6: // keeperMoveRigthBottom
            keeperMove("90","410","140");
            break;          
          case 7: //keeperMoveRigthCentre
            keeperMove("90","410","120");
            break;          
          case 8: //keeperMoveRigthTop
            keeperMove("90","410","90");
            break; 
          default:
            console.log(move);
      }
  }
  
  var keeperMove = function(rotate,margLeft,margTop) {
      $("#keeper").css({
        "transform": "rotate("+rotate+"deg)", 
        "margin-left": +margLeft+"px",
        "margin-top": +margTop+"px"
      });
  }

  var keeperFall = function() {
      setTimeout(function() {
          $("#keeper").css({
            "transition": "1s ease-in-out",
            "margin-top": "140px",
          });
      }, 800);
      
      setTimeout(function() {
          $("#keeper").css({
            "transition": "1s ease-in-out",
            "transform": "rotate(0deg)"
          });
      }, 1000);
  }

  var checkMoves = function(playerMove, computerMove) {
      if (playerMove==computerMove) {
          
          ballInside("out");
          writeHtml("missed", "missed");
      } else {
          ballInside("in");

          if ($("#plMove").text() == "Player 1 Turn") {
              writeHtml("p1", "Goal");
          } else if ($("#plMove").text() == "Player 2 Turn"){
              writeHtml("p2", "Goal");
          }
      }
  }

  var writeHtml = function(winner, goal) {

      $('#plScored').text(goal);

      var p1 = parseInt($('#p1ResultDiv').text()) + 1;
      var p2 = parseInt($('#p2ResultDiv').text()) + 1;
      
      if (winner=="p1") { 
        $('#p1ResultDiv').text(p1);
      }
      else if (winner=="p2") { 
        $('#p2ResultDiv').text(p2);
      };
  }
  
  var animePlayer = function() {
      $('#plImg1').fadeOut("80");
      $('#plImg2').fadeIn("90");
      $('#plImg2').fadeOut("350");
      $('#plImg3').fadeIn("300");
      $('#plImg3').fadeOut("500");
      $('#plImg1').fadeIn("90");
  }

 var nextPlayer = function() {
     if ($("#plMove").text() == "Player 1 Turn") {
         $("#plMove").text("Player 2 Turn");
         chgPlImg();
     } else if ($("#plMove").text() == "Player 2 Turn"){
         $("#plMove").text("Player 1 Turn");
         chgPlImg();
     } 
 }

 var chgPlImg = function() {
      if ($("#plMove").text() == "Player 1 Turn") {
          $("#plImg1").attr("src","images/player1.png");
          $("#plImg2").attr("src","images/player2.png");
          $("#plImg3").attr("src","images/player3.png");
      } else {
          $("#plImg1").attr("src","images/player4.png");
          $("#plImg2").attr("src","images/player5.png");
          $("#plImg3").attr("src","images/player6.png");
      }
 }
  // $("#field").click(function(e) {
  //     var offset = $(this).offset();
  //     console.log("X" + (e.pageX - offset.left));
  //     console.log("Y" + (e.pageY - offset.top));
  //   })

  goalSound();
  restartGame();
}

    