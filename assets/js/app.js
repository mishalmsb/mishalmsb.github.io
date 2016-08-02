var str = "<p>Hi! I am recent graduate from General Assembly Web Development Immersive course.</p>" +
          "<p>I am currently looking for a role as a Junior Web Developer.</p>",
    i = 0,
    isTag,
    text;

(function type() {
  console.log("hellohello");
    text = str.slice(0, ++i);
    if (text === str) return;;
    
    document.getElementById('typewriter').innerHTML = text;

    var char = text.slice(-1);
    if( char === '<' ) isTag = true;
    if( char === '>' ) isTag = false;

    if (isTag) return type();
    setTimeout(type, 40);
}());

function codeAddress() {
  console.log("hello");
};