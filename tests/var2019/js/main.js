var stickWidth = 1200;
var win = $(window);

$(document).ready(function (){
	console.log('document ready');

    if (win.width() > stickWidth) {
        initializeStickers()
    }

    win.resize(function () {
        if (win.width() > stickWidth) {
            initializeStickers()
        } else {
            stopStickers()
        }
    });

	win.on('load', function () {
        $('.doc-loader').fadeOut('fast');
        window.scrollTo(0, 0);
        animateIntro()
    });
});

function stopStickers() {
    $('.section-title-holder').trigger("sticky_kit:detach");
}

function initializeStickers() {
    $('.section-title-holder').stick_in_parent({ offset_top: 64 })
}

function animateIntro() {

    $(".intro-text").delay(2000).animate({opacity:1},3000)

	var tlBlues = new TimelineMax({});
	var tlBluesVertical = new TimelineMax({});
	var tlGreysVertical = new TimelineMax({});
	var tlGreysHorizontalLeft = new TimelineMax({});
	var tlGreysHorizontalRight = new TimelineMax({});

	tlBlues.from(".blues", 3, { opacity:0 }).to(".blues", 1.5, { opacity:1, delay: 4}, 3 )
    tlBluesVertical.from(".blues-vertical", 0.5, {scaleY:0, transformOrigin:"bottom", delay: 1.5});
    tlGreysVertical.from(".greys.vertical", 0.5, {scaleY:0, transformOrigin:"top", delay: 1.5});
    tlGreysHorizontalLeft.from(".greys.horizontal.left", 0.5, {scaleX:0, transformOrigin:"left", delay: 1.5});
    tlGreysHorizontalRight.from(".greys.horizontal.right", 0.5, {scaleX:0, transformOrigin:"right", delay: 1.5});
}