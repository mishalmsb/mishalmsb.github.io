'use strict';

// Init all plugin when document is ready
$(document).on('ready', function () {
	// 0. Init console to avoid error
	var method;
	var noop = function () { };
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});
	var contextWindow = $(window);
	var $root = $('html, body');
	while (length--) {
		method = methods[length];
		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}

	// 1. Background image as data attribut
	var list = $('.bg-img');
	for (var i = 0; i < list.length; i++) {
		var src = list[i].getAttribute('data-image-src');
		list[i].style.backgroundImage = "url('" + src + "')";
		list[i].style.backgroundRepeat = "no-repeat";
		list[i].style.backgroundPosition = "center";
		list[i].style.backgroundSize = "cover";
	}
	// Background color as data attribut
	var list = $('.bg-color');
	for (var i = 0; i < list.length; i++) {
		var src = list[i].getAttribute('data-bgcolor');
		list[i].style.backgroundColor = src;
	}

	// 3. Show/hide menu when icon is clicked
	var menuItems = $('.top-menu-links, .main-menu');
	var menuIcon = $('.menu-icon, #menu-link');
	var menuLinks = $(".top-menu-links a, .main-menu a");
	// Menu icon clicked
	menuIcon.on('click', function () {
		menuIcon.toggleClass('menu-visible')
		menuItems.toggleClass('menu-visible');
		return false;
	});

	// Hide menu after a menu item clicked
	menuLinks.on('click', function () {
		if (menuItems.hasClass('menu-visible')) {
			menuIcon.removeClass('menu-visible');
			menuItems.removeClass('menu-visible');
		}
		return true;
	});

	// 4. Slider / Slideshow
	// 4.a Slideshow background
	var imageList = $('.slide-show .img');
	var imageSlides = [];
	for (var i = 0; i < imageList.length; i++) {
		var src = imageList[i].getAttribute('data-src');
		imageSlides.push({ src: src });
	}
	$('.slide-show').vegas({
		delay: 5000,
		shuffle: true,
		slides: imageSlides,
		animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
	});

	// 4.b Products/Projects/items slider
	var swiper = new Swiper('.swiper-container', {
        pagination: '.items-pagination',
        paginationClickable: '.items-pagination',
        nextButton: '.items-button-next',
        prevButton: '.items-button-prev',
		grabCursor: true,
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
		breakpoints: {
            1024: {
                slidesPerView: 1,
            },
            800: {
                slidesPerView: 1,
                spaceBetween: 32
            },
            640: {
                slidesPerView: 1,
                spaceBetween: 32
            },
            440: {
                slidesPerView: 1,
                spaceBetween: 32
            }
        }
    });

	// 5. Init video background
	var videoBg = $('.video-container video, .video-container object');
	videoBg.maximage('maxcover');

	// 6. Prepare titles, content for animation
	$('.section .content .anim .title h2, .section .content .anim .title h3, .section .content .anim .desc p, \
		.section .content .anim .title-desc h2, .section .content .anim .title-desc h3, .section .content .anim .title-desc h4, .section .content .anim .item-desc h3,.section .content .anim .title-desc p, \
		.cta-btns .btn').wrap("<span class='anim-wrapper'></span>");

	// 7. Init fullPage.js plugin
	var pageSectionDivs = $('.fullpg .section');
	var pageSections = [];
	var pageAnchors = [];
	var mainPage = $('#mainpage');

	var scrollOverflow = true;
	// disable scroll overflow on small device
	if (contextWindow.width() < 601) {
		scrollOverflow = false;
	}
	else {
		scrollOverflow = true;
	}
	// Get sections name
	for (var i = 0; i < pageSectionDivs.length; i++) {
		pageSections.push(pageSectionDivs[i]);
	}
	window.asyncEach(pageSections, function (pageSection, cb) {
		var anchor = pageSection.getAttribute('data-section');
		pageAnchors.push(anchor + "");
		cb();
	}, function (err) {
		// Init plugin
		if (mainPage.height()) {
			// config fullpage.js
			mainPage.fullpage({
				menu: '#qmenu',
				anchors: pageAnchors,
				verticalCentered: false,
				css3: true,
				navigation: false,
				responsiveWidth: 601,
				responsiveHeight: 480,
				scrollOverflow: scrollOverflow,
				scrollOverflowOptions: {
					click: true,
					submit: true,
				},
				afterRender: function () {

				},
				afterResize: function () {
					var pluginContainer = $(this);
					$.fn.fullpage.reBuild();
				},
				onLeave: function (index, nextIndex, direction) {

				},
				afterLoad: function (anchorLink, index) {

				}
			});

		}
	});



	// 9. Page Loader : hide loader when all are loaded
	contextWindow.on('load', function () {
		$('#page-loader').addClass('p-hidden');
		$('.section').addClass('anim');
	});

});

