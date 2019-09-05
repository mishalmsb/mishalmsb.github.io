$(init)
function init() { 

  
  
  
  // audio.play();
  

  var goalSound = function (goal) {
      //event when mouse is over the button
      var gAudio = document.getElementById("audioGoal");

      if (goal=="in") {
          gAudio.src = "sounds/goal2.mp3";

      } else if (goal=="out"){
          gAudio.src = "sounds/missed.mp3";
      } 
      // else {
      //     gAudio.src = "sounds/crowd2.mp3";
      // }
      gAudio.play();

      var bgAudio = document.getElementById("audioCrowd");
      bgAudio.src = "sounds/crowd2.mp3";
      bgAudio.loop = true;
      bgAudio.play();
      
  }
  goalSound();

  $("#btRest").hide();
  $("#goalDiv").hide();
  $("#missedDiv").hide();
  $("#plScored").hide();
  // $("#btWrap").hide();
  
  


  $("button").click(function() {
    
      // console.log(this.id; 
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
      
      // run([0,3,6,0]);

      // $("#player").animateSprite('restart');
      

      var counter = parseInt($('#counterDiv').text()) + 1;

      // animePlayer();
      var comMove = computerMove(plMove);
      checkMoves(plMove,comMove);
      // console.log(plMove,comMove);
      keeperInstruct(comMove);
      MoveBall(ballPosX, ballPosY);
      keeperFall();
      setTimeout(function() {
          MoveBall(150, 345); 
          keeperMove(0,310,125);
          // console.log("timeout");
          if ($("#plMove").text() == "Player 1 Turn") {
              $("#plMove").text("Player 2 Turn")
          } else {
              $("#plMove").text("Player 1 Turn")
          }
          
      },3000);
      setTimeout(function() {
       
        $("#goalDiv").hide();
        $("#missedDiv").hide();
      },4000);

      if (counter < 10) { 
        console.log(counter);
        $('#counterDiv').text(counter);
      } else {
        $('#counterDiv').text("GAME OVER");
          $("#btWrap").hide();
          $("#btRest").show();
          $('#plMove').text("");
      };
      $("#goalDiv").hide();

      

  };

  var computerMove = function(plMove) {
    if (plMove>=1 && plMove<=4) {
        return (Math.floor(Math.random()*(4-1+1))+1);
    } 
    else if (plMove>=5 && plMove<=8) {
        return (Math.floor(Math.random()*(8-5+1))+5);
    }

     
    // return Math.floor((Math.random() * 10) + 1);
  }

  var ballInside = function(inOut) {

      

      // console.log("margin" + $(".ball").css("margin-left"))
      // var marLeft = parseInt("margin" + $(".ball").css("margin-left")) - 345
          
      if(inOut=="in") {
          
            
            setTimeout(function() {
                console.log("margin" + $(".ball").css("margin-left"));
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
    // console.log(margTop);
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
            // "transform": "rotate(0deg)"
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
          console.log("defense");
          ballInside("out");
          writeHtml("missed", "missed");
      } else {
          console.log($("#plMove").text());
          ballInside("in");

          if ($("#plMove").text() == "Player 1 Turn") {
              writeHtml("p1", "Goal");
              // console.log("writeHtmlif")
          } else if ($("#plMove").text() == "Player 2 Turn"){
              writeHtml("p2", "Goal");
              // console.log("writeHtmlelse");
          }
          
      }
  }

  var writeHtml = function(winner, goal) {
      
      console.log(winner);

      $('#plScored').text(goal);

      var p1 = parseInt($('#p1ResultDiv').text()) + 1;
      var p2 = parseInt($('#p2ResultDiv').text()) + 1;
      
      
      if (winner=="p1") { 
        $('#p1ResultDiv').text(p1);
        // console.log("writeHtmlif")
      }
      else if (winner=="p2") { 
        $('#p2ResultDiv').text(p2);
        // console.log("writeHtmlelse")
      };

      // if (p1>1 || p2>1) {
      //      $('#plScored').text("Game Over");
      // } 

      // console.log(p1, p2);
  }

  // var run = function(walkRight) {
  //     $(function() {
  //         $("#player").animateSprite({
  //             fps: 15,
  //             animations: {
  //                 walk: walkRight
  //                 // walkLeft: [15, 14, 13, 12, 11, 10, 9, 8],
  //                 // walkCrazy: [0, 14, 2, 12, 3, 10, 4, 8]
  //             },
  //             loop: false,
  //         });
  //     });      
  // }
  


  // $("#field").click(function(e) {
  //     var offset = $(this).offset();
  //     console.log("X" + (e.pageX - offset.left));
  //     console.log("Y" + (e.pageY - offset.top));
  //   })
  
  // var animePlayer = function() {
  //     $('#plImg1').fadeOut("80");
  //     $('#plImg2').fadeIn("90");
  //     $('#plImg2').fadeOut("350");
  //     $('#plImg3').fadeIn("300");
  //     $('#plImg3').fadeOut("500");
  //     $('#plImg1').fadeIn("90");
  // }

}

    