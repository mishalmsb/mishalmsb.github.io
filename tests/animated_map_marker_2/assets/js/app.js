//

$("#mark").click( function(){
  console.log('button clicked');
  var topPos = $('#top').val() + '%';
  var leftPos = $('#left').val() + '%';
  $("#marker").css({top: topPos, left: leftPos});
});
