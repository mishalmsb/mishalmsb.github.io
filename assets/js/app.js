var str = "<p>Hi! I'm Junior Web Developer,</p>" +
          "<p>currently Working as front end developer at <a href="vastari.com" target="_blank">Vastari</a>.</p>",
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

<div id="typewriter">
    <p class="typeHome">Hi! I'm Junior Web Developer,</p>
    <p class="typeHome">
        currently Working as front end developer at 
        <a href="vastari.com" target="_blank">Vastari</a>.
    </p>
</div>