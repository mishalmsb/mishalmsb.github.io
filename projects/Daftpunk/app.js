var sounds = "sounds/after.wav";
var musicList = ["sounds/work_it.wav", "sounds/make_it.wav", "sounds/do_it.wav", "sounds/makes_us.wav","sounds/harder.wav", "sounds/better.wav", "sounds/faster.wav", "sounds/stronger.wav", "sounds/more_than.wav", "sounds/hour.wav", "sounds/our.wav", "sounds/never.wav", "sounds/ever.wav", "sounds/after.wav", "sounds/work_is.wav", "sounds/over.wav"];

// var musicList = new Audio()

// for () {
//     musicList("")
// }
  

// var showMenu = document.getElementsByClassName("bt");

// // ...

// for ( var i = 0; i < showMenu.length; i++ ) {
//     showMenu[i].addEventListener( "click", function() {
//         console.log(showMenu[i].id);
//     });
// }

//event to make the script load at start
window.addEventListener("DOMContentLoaded", function(event) {
  var audio = document.getElementById("audio");
  console.log(document.getElementById("a0").style.color);


  var playMusic = function (btId, musicId) {
      //event when mouse is over the button
      document.getElementById(btId).addEventListener("mouseover", function() {
          audio.src = musicList[musicId];
          audio.play();
          addImage(btId);
      });
      //event when mouse is out the button
      document.getElementById(btId).addEventListener("mouseout", function() {
          // audio.src = musicList[musicId];
          //audio.pause();
          removeImage(btId);
      });
 
  };
  for (var id = 0; id < musicList.length; id++) {
    playMusic("a" + id, id); 
  }

  //function to show img on buttons
  var addImage = function(id) {
      document.getElementById(id).style.background = "url('img/DaftPunk.gif')";
      console.log(document.getElementById(id).style.color);
      document.getElementById(id).style.color = "transparent";
  }
  //function to show back the letters no buttons
  var removeImage = function(id) {
      document.getElementById(id).style.background = "none";
      // console.log(getColor(id));
      document.getElementById(id).style.color = getColor(id);  
  }

  //function to put back the button text colors
  var getColor = function(id) {
      if (id == "a0" || id == "a1" || id == "a2" || id == "a3") {
          color = "orange";  
      }
      else if (id == "a4" || id == "a5" || id == "a6" || id == "a7") {
          color = "green";  
      }
      else if (id == "a8" || id == "a9" || id == "a10" || id == "a11") {
          color = "yellow";  
      }
      else if (id == "a12" || id == "a13" || id == "a14" || id == "a15") {
          color = "red";  
      }
      // console.log(id);
      return color;
  }

});
