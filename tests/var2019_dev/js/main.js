var stickWidth = 1200;
var win = $(window);

$(document).ready(function (){
	console.log('document ready');
    // startScrollTrigger()
    // if (win.width() > stickWidth) {
    //     initializeStickers()
    // }

    // win.resize(function () {
    //     if (win.width() > stickWidth) {
    //         initializeStickers()
    //     } else {
    //         stopStickers()
    //     }
    // });

	win.on('load', function () {
        $('.doc-loader').fadeOut('fast');

        setTimeout(function() {
            scrollToTopPage()
        }, 50);
        animateIntro()

        setTimeout(function() {
            initScrollReveal()
        }, 100);

    });
});

function initScrollReveal() {
    /* PARAMETERS  */
    var offset   = 80; //int in %

  /* D'ONT TOUCH ANY FURTHER IF YOU DON'T KNOW WHAT YOU ARE DOING */
  var $targets = $('[data-easy-reveal]');

  var windowHeight = $(window).height(),
      offsetHeight = windowHeight * offset / 100,
      docHeight    = $(document).height();

  function reveal(){
    $targets.each(function(){
      var targetTop    = $(this).offset().top;
      var windowScroll = $(window).scrollTop();
      var animation    = $(this).data('easy-reveal');
      //default animation
      if (!animation) { animation = 'fade-in-up'; }

      // lunch animation if scroll is further the target + offset  OR at the end of the page
      if ( targetTop < ( windowScroll + offsetHeight) || (windowScroll + windowHeight) === docHeight) {
        $(this).addClass(animation);
      }
    });
  }

  // lunch animation on scroll and document ready
  $(document).ready(reveal);
  $(window).scroll(reveal);
}
function scrollToTopPage() {
    // window.scrollTo(0, 0);
}

// function stopStickers() {
//     $('.section-title-holder').trigger("sticky_kit:detach");
// }

// function initializeStickers() {
//     $('.section-title-holder').stick_in_parent({ offset_top: 64 })
// }

function animateIntro() {

    $(".intro-text").delay(2000).animate({opacity:1},3000)

    $(".scroll-down").delay(3000).animate({opacity:1},3000)

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

function scrollToSecondSection() {
    var el = document.getElementById("section2");
    // el.scrollIntoView();
    el.scrollIntoView({ behavior: 'smooth' });
}

