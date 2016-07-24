var Template = {
	// configuration object for google map presentation on the contact page
	googleMapConfig:{
		// change map marker location here
		markerLocation:{
			lat:-34.397,
			lng:150.644
		},
		// uncomment line below if you want use image or svg file as a marker
		//markerIcon:{ url:'assets/svg/map-marker.svg' },
		zoom:8 // change map zoom value
	},

	// set to true to disable ajax pages loading
	disableAjaxNavigation:false,

	/**
	 * Main init function
	 * 
	 * @return {void}
	 */
	init: function(){
		if (!this._inited) {
			var self = this,
				customScrollActive = this.layout.init({
					customScrollEnabled: !this.tools.isTouch(),
					scrollContainer: '.layout'
				});
			if (customScrollActive) {
				this._applyLayoutTitlePatch();
				$('.layout-anti-scroll').removeClass('layout-anti-scroll--active');
			}
			this.menu.init({
				disableAjaxNavigation:this.disableAjaxNavigation,
				on:{
					itemActivate:function(){
						self.layout.scrollTo('top');
					}
				}
			});

			this._applyFooterSidebarPatch();
		}

		this.initSharrres({
			//'urlCurl' : admin_url('sharrre-ajax-proxy.php'),
			'itemsSelector' : '#shareBoxContainer .share-box__item[data-btntype]'
		});

		this.shortcodes.init();

		this.initResume();
		this.initPortfolio();
		this.initBlog();
		this.initGoogleMap();
		this.initContactFormValidation();

		if (!this._inited) {
			this._inited = true;
		}
	},

	/**
	 * Page reume init function
	 * 
	 * @require bootstrap-collapse.js, bootstrap-transition.js
	 * @return {void}
	 */
	initResume: function(){
		var panels = $('.accordion-item');
		if (panels.length < 1 || panels.data('scrollerInited')) {
			return;
		}
		panels.data('scrollerInited',true);

		var self = this,
			sectionTitleEl = panels.parents('section').find('.layout-title');

		panels.on({
			'show.bs.collapse':function () {
				if ('fixed' == sectionTitleEl.css('position')) {
					var el = $(this);
					setTimeout(function(){
						var h = sectionTitleEl.height();
						self.layout
							.scrollTo(
								// el.position().top - (h > 0 ? Math.round(h*0.3) : 0),
								el.position().top - h,
								{
									scrollInertia:200
								}
							);
					},500);
				}
			}
		});
	},

	/**
	 * Init shrrre component
	 *
	 * @require jquery.sharrre.js
	 * @param  {objec} config
	 * @return {void}
	 */
	initSharrres: function(config){
		if (typeof $.fn.sharrre != 'function') {
			// throw 'Sharrre extension is not loaded.';
			return;
		}

		if (!config || typeof config != 'object' || !config.itemsSelector) {
			// throw 'Parameters error.';
			return;
		}

		//TODO complete sharres integration via ajax proxy
		var curlUrl = config.urlCurl ? config.urlCurl : '',
			elements = $(config.itemsSelector);

		if (elements.length < 1) {
			return;
		}

		elements.each(function(){
			var el = $(this),
				curId = el.data('btntype'),
				curConf = {
					urlCurl: curlUrl,
					enableHover: false,
					enableTracking: true,
					url: document.location.href,
					share: {},
					click: function(api, options){
						api.simulateClick();
						api.openPopup(curId);
					}
				};

			curConf.share[curId] = true;
			el.sharrre(curConf);
		});

		// to prevent jumping to the top of page on click event
		setTimeout(function(){
			$('a.share,a.count', config.itemsSelector).attr('href','javascript:void(0)');
		}, 1500);
	},

	/**
	 * Init blog page
	 * 
	 * @return {void}
	 */
	initBlog: function(){
		this._initAjaxPagesLoading($('section.blog'));
	},

	/**
	 * Init portfolio page
	 * 
	 * @return {void}
	 */
	initPortfolio: function(){
		$('.page-portfolio__item').each(function(){
			$(this).hoverdir({
				hoverDelay:50
			});
		});

		this._initAjaxPagesLoading($('section.page-portfolio'));
	},

	/**
	 * Init google map component
	 * 
	 * @require http://maps.google.com/maps/api/js?sensor=false
	 * @return {void}
	 */
	initGoogleMap: function(){
		var mapElement = document.getElementById('savvyMapCanvas');
		if (!mapElement) return;

		var mapCfg = this.googleMapConfig || {},
			markerPositionCfg = jQuery.extend({lat:-34.397,lng:150.644}, mapCfg.markerLocation || {}),
			markerPosition = new google.maps.LatLng(markerPositionCfg.lat, markerPositionCfg.lng),
			map = new google.maps.Map(mapElement, {
				zoom: mapCfg.zoom ? mapCfg.zoom : 8,
				center: markerPosition,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false
			}),
			markerColor = $(mapElement).css('color'),
			iconCfg = mapCfg.markerIcon ? mapCfg.markerIcon : {
				path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, // google.maps.SymbolPath.CIRCLE,
				fillColor: markerColor ? markerColor : '#ee0000',
				fillOpacity: 1,
				strokeWeight: 0,
				scale: 12
			},
			marker = new google.maps.Marker({
				map: map,
				icon:iconCfg,
				clickable: false,
				position: markerPosition
			});
	},

	/**
	 * Initialize form validation functionality on the contact page
	 * 
	 * @return {void}
	 */
	initContactFormValidation: function(){
		var form = $('#contactForm');

		if (form.length < 1 || form.data('_inited')) {
			return;
		}
		form.data('_inited', true);

		// function renders error messages related on each field
		var renderFormErrors = function(errors) {
			form.find('input,textarea,select').each(function(){
				var item = $(this),
					name = item.attr('name'),
					wrapper = item.parent(),
					errorCnt = wrapper.find('.form__item__failed-wrap');

				if (errorCnt.length) {
					var itemErrors = errors && errors[name] ? errors[name] : '';
					errorCnt.text(itemErrors);
					if (itemErrors) {
						wrapper.addClass(classItemInvalid);
					} else {
						wrapper.removeClass(classItemInvalid);
					}
				}
			});
		};

		var classItemInvalid = 'form__item--invalid',
			formStatusClassSuccess = 'form__status--success',
			formStatusClassError = 'form__status--error',
			formStatusEl = form.find('.form__status'),
			emailValidationRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		form.on('submit', function(e) {
			e.preventDefault();

			var formData = form.serializeArray(),
				formErrors = {};

			// form data validation
			$.each(formData, function(i, field) {
				var name = field['name'],
					value = field['value'];

				if(!value.trim()) {
					formErrors[name] = 'Please fill the required field.';
				} else if('email' == name && emailValidationRegex && !emailValidationRegex.test(value)) {
					formErrors[name] = 'Email address seems invalid.';
				}
			});

			// resettings form status
			formStatusEl.removeClass(formStatusClassSuccess + ' ' + formStatusClassError);
			renderFormErrors(formErrors);

			if(jQuery.isEmptyObject(formErrors)){ // validation success
				$.ajax({
					type: form.attr('method') || 'get',
					url: form.attr('action') || window.location.href,
					data: $.param(formData),
					dataType:'json',
					complete: function(xhr, status) {
						var response = xhr.responseJSON ? xhr.responseJSON : {};

						renderFormErrors(response.errors || {});
						if (status == 'success' && response.success) {
							formStatusEl
								.addClass(formStatusClassSuccess)
								.text(response.message || 'Your message was sent successfully. Thanks.');
							form.trigger('reset');
						} else {
							var errorStatusMessage = response.errors && response.errors.status 
									? response.errors.status 
									: 'Failed to send your message. Please try later or contact the administrator by another method.';
							formStatusEl
								.addClass(formStatusClassError)
								.text(errorStatusMessage);
						}
					}
				});
			}
			return false;
		});
	},

	/**
	 * Applies ajax navigation for all links inside passed element
	 * 
	 * @param  {domNode|jQuery}  el
	 * @param  {String} selector elements for that click handler should be applied
	 * @return {void}
	 */
	_initAjaxPagesLoading: function(el, selector){
		if (!el || this.menu.isFileProtocol() || this.disableAjaxNavigation) return;

		if (!selector) {
			selector = 'a';
		}
		var menu = this.menu;
		$(selector, el).click(function(event){
			// page should be opened in new tab - preventing custom event procesing
			if (event.which > 1 || event.ctrlKey) {
				return;
			}
			event.preventDefault();
			menu.setHashValue($(this).attr('href'));
		});
	},

	_applyFooterSidebarPatch:function(){
		if (this.tools.isTouch() && /iPad/i.test(navigator.userAgent)) {
			// fix for iPad scroll event - window resize event happens as well
			// so footer in sidebar "jumps" - we will hide this jump from the user
			var _footerSidebarHidden = false;
			$(window).on('resize', function(){
				if (_footerSidebarHidden) {
					return;
				}
				_footerSidebarHidden = true;
				$('.sidebar .footer')
					.hide()
					.delay(1000)
					.fadeIn('slow', function(){
						_footerSidebarHidden = false;
					});
			})
		}
	},

	_applyLayoutTitlePatch:function(){
		// fix for IE and FF browsers 
		if (this.tools.isIe() || /firefox/i.test(navigator.userAgent)) {
			// section title has a fixed position but has not any "top" or "buttom" value
			var ieFixStyleNode,
				ieFixHandler = function(){
					if (!ieFixStyleNode) ieFixStyleNode = $('<style />').appendTo('head');
					var lh = $('.layout-header'),
						lhPos = lh.position(),
						lhBottom = lhPos ? (lhPos.top + lh.height()) : 0;
					if (lhBottom) {
						ieFixStyleNode.text('.layout-title{top:'+lhBottom+'px;}');
					}
				};
				$(window).on('resize', ieFixHandler);
				ieFixHandler();
		}
	}
};

/**
 * Namespace for functions related on the main menu
 * @type {Object}
 */
Template.menu = {
	menuSelector:'.main-nav',
	menuItemsSelector: '.main-nav__item',
	menuLinksSelector: '.main-nav__item a',
	sliderSelector: '#headerMenuSlidingElement',
	currenMenuItemClass:'main-nav__item--active',
	pageClassContainerSelector: '.layout-body',

	disableAjaxNavigation:false,

	/**
	 * Contains values for location.hash that should not be loaded via ajax.
	 * @see  _isIgnoredFragment
	 * @type {String}
	 */
	_ignoredFramnent:null,

	/**
	 * Main init function
	 * 
	 * @param  {Object} config [description]
	 * @return {void}
	 */
	init:function(config){
		if (this._inited) return;
		this._inited = true;

		if (config) {
			if (config.on) {
				$(this).on(config.on);
				delete(config.on);
			}
			if (!$.isEmptyObject(config)) {
				$.extend(this, config);
			}
		}

		this._initMainMenu();
		this._initMobileMenu();

		if (!this.disableAjaxNavigation) {
			var self = this;
			$(window).on('hashchange', function(event){
				self.loadPage(event.fragment);
			});
		}
	},

	/**
	 * Returns jQuery collection with main menu element
	 * 
	 * @return {jQuery}
	 */
	getHeaderMenu:function(forElement){
		return $(this.menuSelector, forElement ? forElement : document);
	},

	/**
	 * Returns jQuery collection with main menu items
	 * 
	 * @return {jQuery}
	 */
	getMenuItems:function(justLinks, forElement){
		return this.getHeaderMenu(forElement)
			.find(justLinks ? this.menuLinksSelector : this.menuItemsSelector);
	},

	/**
	 * Returns jQuery collection with main menu slider element
	 * 
	 * @return {jQuery}
	 */
	getSlider:function(){
		return $(this.sliderSelector);
	},

	/**
	 * Loads new page via ajax.
	 * 
	 * @param  {srting} url
	 * @return {void}
	 */
	loadPage:function(url){
		if (this.disableAjaxNavigation || this.isFileProtocol()) {
			document.location = url;
			return;
		}

		if (this._isIgnoredFragment(url)) {
			return;
		}

		$.ajax(url, {
			success:function(responseText){
				var isIe9 = this.isIe(9),
					resDom = document.createElement(isIe9 ? 'xhtml' : 'html');
				resDom.innerHTML = responseText;

				// title replacement
				var newTitle = $('head title', resDom);
				if (newTitle.length) {
					$('head title').text(newTitle.text());
				}

				// finding active menu item in the receive document
				var newDomActiveItem = this.getMenuItems(false, resDom)
						.filter('.' + this.currenMenuItemClass)
						.find('a'),
					effect = 'flap'; // 'fade';

				if (newDomActiveItem.length) {
					// searching for item with the same href attribute in our main menu
					// and marking it as active item
					var newActiveItem = this.getMenuItems(true)
						.filter('[href="'+newDomActiveItem.attr('href')+'"]');
					if (newActiveItem.length > 0) {
						var curItem = this.getMenuItems().filter('.' + this.currenMenuItemClass).find('a');
						if (curItem.length && curItem.attr('href') != newActiveItem.attr('href') && $('.layout-sidebar').css('position') == 'fixed') {
							effect = curItem.position().left < newActiveItem.position().left ? 'slideLeft' : 'slideRight';
						}
						newActiveItem.trigger('activate');
					}
				}

				// page content replacement
				var newSection = $(resDom).find('section'),
					section = $('section');

				$(this).trigger('pageLoaded');
				this._replaceSection(section, newSection, effect);
			},
			context:this
		});
	},

	/**
	 * Checks if current page loaded via 'file://' protocol.
	 * 
	 * @return {Boolean}
	 */
	isFileProtocol:function(){
		return document.location.protocol == 'file:';
	},

	/**
	 * Alias
	 * 
	 * @see Template.menu.isIe
	 * @return {Boolean}
	 */
	isIe:function(){
		return Template.tools.isIe.apply(Template.tools, arguments);
	},

	setHashValue:function(url){
		if (this.disableAjaxNavigation) {
			document.location = url;
		}

		var clearFragment = url;
		if (/^#/.test(url)) {
			clearFragment = url.replace(/^#/,'');
			this._setIgnoredFragment(clearFragment);
		}

		if (clearFragment) {
			if (/#.+/.test(clearFragment)){//link to anchor on another page
				document.location = clearFragment;
			}

			document.location.hash = '#' + clearFragment;
		} else {
			document.location.hash = '';
		}
	},

	/**
	 * Checks if url should be loaded via ajax.
	 * 
	 * @see  loadPage
	 * @param  {String}  fragment document.lovation.hash value
	 * @return {Boolean}
	 */
	_isIgnoredFragment:function(fragment){
		if (null !== this._ignoredFramnent && this._ignoredFramnent === fragment) {
			this._ignoredFramnent = null;
			return true;
		}
		return false;
	},

	/**
	 * Sets value for document.lovation.hash that should be ignored by loadPage method.
	 *
	 * @see  setHashValue
	 * @param {String} fragment document.lovation.hash value
	 */
	_setIgnoredFragment:function(fragment){
		this._ignoredFramnent = fragment;
	},

	/**
	 * Replaces current page content with new one (loaded via ajax) with specefied animation effect.
	 * 
	 * @param  {jQuery} section    current page content element
	 * @param  {jQuery} newSection new page content element
	 * @param  {String} effect     animation effect, allowed values are: 'slideLeft','slideRight','flap' and 'fade' (default)
	 * @return {void}
	 */
	_replaceSection:function(section, newSection, effect){
		var duration = 1200;

		var newSavyClasses = this.pageClassContainerSelector
			? newSection.parents(this.pageClassContainerSelector).attr('class')
			: '';

		switch(effect){
		case 'slideLeft':
		case 'slideRight':
			var cont = section.parent(),
				layoutMainContainer = section.parents('.layout-container-main');
			layoutMainContainer.css({
				'height':Math.max(cont.height(), $('.sidebar').height())
			});

			var varOption = 'slideLeft' == effect ? 'right' : 'left',
				stream = $('<div><div class="slot1"></div><div class="slot2"></div></div>')
					.css({
						position:'absolute',
						top:0,
						width: cont.width()*2,
						height:cont.height()
					})
					.css(varOption, 0);

			var slots = stream.find('.slot1, .slot2')
				.css({width:'50%',float:'left'}),
				sp = {
					forNew: slots.eq('slideLeft' == effect ? 0 : 1),
					forOld: slots.eq('slideLeft' == effect ? 1 : 0)
				};

			var animatesettings = {
				'duration': duration
			};
			animatesettings[varOption] = -1 * cont.width();

			newSection.appendTo(sp.forNew);
			section.appendTo(sp.forOld);

			var layoutTitleAnimationClass = 'layout-title--page-switching';

			if (layoutTitleAnimationClass) {
				stream.find('.layout-title')
					.addClass(layoutTitleAnimationClass);
			}

			stream.appendTo(cont);
			this._applyContainerBg(newSavyClasses);

			stream.animate(animatesettings, function(){
					newSection.appendTo(cont);
					stream.remove();
					if (layoutTitleAnimationClass) {
						newSection.find('.' + layoutTitleAnimationClass)
							.removeClass(layoutTitleAnimationClass);
					}
					layoutMainContainer.css({
						'height': 'auto'
					});
					Template.init();
				});
			break;

		case 'flap':
			var cont = section.parents('.layout-container-main'),
				maxHeigh = cont.parent().height(),
				self = this;

			cont.animate({
				height:10,
				duration:duration
			},function(){
				section.replaceWith(newSection);
				self._applyContainerBg(newSavyClasses);
				cont.animate({
					height:maxHeigh,
					duration:400
				},function(){
					cont.css({height:'auto'});
					Template.init();
				})
			});
			break;

		case 'fade':
			var self = this;
			section.fadeOut(duration,function(){
				newSection.hide();
				section.replaceWith(newSection);
				self._applyContainerBg(newSavyClasses);
				newSection.fadeIn(function(){
					Template.init();
				});
			});
			break;

		case 'none':
		default:
			section.replaceWith(newSection);
			this._applyContainerBg(newSavyClasses);
			break;
		}
	},

	/**
	 * Main menu init function
	 * 
	 * @return {void}
	 */
	_initMainMenu:function(){
		var slider = this.getSlider(),
			menuItems = this.getMenuItems(),
			self = this;

		// main menu slider handler
		menuItems.on('activate', function(e, eventData){
			var item = $(this),
				position = item.position();
				animDuration = eventData && eventData.noAnimation ? 0 : 300,
				newSliderWidth = item.outerWidth()+2;

			$(self).trigger('itemActivate');

			if (animDuration < 1) {
				slider.css({
					width:newSliderWidth,
					left:position['left'],
					display:'block'
				});
				self._setActiveItem(item)
			} else {
				slider
					.width(newSliderWidth)
					.animate({
						left : position['left']
					}, {
						duration:animDuration,
						easing:'swing',
						complete:function(){
							if (!slider.is(':visible')) slider.show();
							self._setActiveItem(item);
						}
					});
			}
		});

		if (!this.isFileProtocol()) {
			this.getMenuItems(true).on('click', function(event){
				// page should be opened in new tab - preventing custom event procesing
				if (event.which > 1 || event.ctrlKey) {
					return;
				}
				event.preventDefault();
				self.setHashValue($(this).attr('href'));
			});
		}

		$(window).on('resize', function(){
			self._fixSliderPosition();
		});

		this._restoreActiveCurrentPageState();
	},

	/**
	 * Mobile menu init function
	 * 
	 * @return {void}
	 */
	_initMobileMenu:function(){
		var self = this,
			mobileMenu = $('.mobile-menu'),
			toggle = $('.mobile-menu__toggle'),
			classOpen = 'mobile-menu--open',
			mobileMenuListClass = 'main-nav--mobile',
			mobileMenuUl = this.getHeaderMenu().clone(true)
				.attr('class', mobileMenuListClass) //.addClass(mobileMenuListClass)
				.appendTo(mobileMenu);

		mobileMenuUl.find('a').click(function(){
			toggle.trigger('click');
		});

		toggle.on('click', function(event){
			event.preventDefault();
			var isCloseAction = mobileMenu.hasClass(classOpen);

			if (!isCloseAction) {
				$(self).trigger('mobileMenuOpen');
				mobileMenu.addClass(classOpen);
				mobileMenuUl.slideToggle(400);
			} else {
				mobileMenu.removeClass(classOpen);
				mobileMenuUl.slideToggle(400);
			}
		});

		$(this).on('mobileMenuOpen', function(){
			// adding class for curent item
			var pattern = new RegExp('(?:#)?([a-zA-Z]*)(?:.)?(?:(?:html)|(?:php))?$', 'i'),
				slug = pattern.exec(window.location.href),
				items = $('.' + mobileMenuListClass + ' li'),
				currentItem = null;

			if(slug[1]){
				items.removeClass(self.currenMenuItemClass);
				currentItem = items.find('a[href *='+ slug[1] +']').parent();

				if(currentItem.length > 0){
					currentItem.addClass(self.currenMenuItemClass);
				}else{
					items.first().addClass(self.currenMenuItemClass);
				}
			}
		});
	},

	/**
	 * Marks passed item as active menu item
	 * 
	 * @param {jQuery} item
	 * @return {void}
	 */
	_setActiveItem:function(item){
		this._activeItem = item;

		var activeClass = this.currenMenuItemClass;
		if (!item.is('.' + activeClass)) {
			this.getMenuItems()
				.filter('.' + activeClass).removeClass(activeClass);
			item.addClass(activeClass);
		}
	},

	/**
	 * Updates menu slider element position to locate it over active menu item
	 * 
	 * @return {void}
	 */
	_fixSliderPosition:function(){
		if (!this._activeItem || !this._activeItem.is(':visible')) {
			return;
		}

		var position = this._activeItem.position();
		this.getSlider().css({
			display: 'block',
			width: this._activeItem.outerWidth()+2,
			left : position['left']
		});
	},

	/**
	 * Reads hashtag and loads corresponding page via ajax.
	 * Used at the init event.
	 * 
	 * @return {void}
	 */
	_restoreActiveCurrentPageState:function(){
		// moving slider over the active menu item
		var menuItems = this.getMenuItems(),
			mainMenuActivateItem;
		if (document.location.hash) {
			// checking that current url == current hash
			var checkUrl = document.location.hash.substr(1);
			if (document.location.pathname.substr(0-checkUrl.length) != checkUrl) {
				mainMenuActivateItem = menuItems.find('a[href$="'+checkUrl+'"]'); //.trigger('click');
				this.loadPage(checkUrl);
			}
		}

		if (!mainMenuActivateItem || mainMenuActivateItem.length < 1) {
			mainMenuActivateItem = menuItems.filter('.' + this.currenMenuItemClass);
			if (mainMenuActivateItem.length < 1) {
				mainMenuActivateItem = menuItems.first();
			}

			mainMenuActivateItem.trigger('activate', {
				noAnimation:true
			});
		}
	},

	/**
	 * Applies css classes for main container element after page loading via ajax.
	 *
	 * @see  _replaceSection
	 * @param  {String} newClasses
	 * @return {void}
	 */
	_applyContainerBg:function(newClasses){
		if (this.pageClassContainerSelector) {
			$(this.pageClassContainerSelector).attr('class', newClasses);
		}
	}
};

Template.layout = {
	customScrollEnabled:false,
	scrollContainer: '',

	init:function(config){
		if (this._inited) return false;
		this._inited = true;

		if (config) {
			$.extend(this, config);
		}

		if (!this._initCustomScroll()){
			return false;
		}

		return true;
	},

	/**
	 * Scrolls content to specefied target
	 * 
	 * @param  {String} target
	 * @param  {Objec} options
	 * @return {void}
	 */
	scrollTo:function(target, options){
		var c = this.getScrollContainer();
		if (c && c.length > 0) {
			c.mCustomScrollbar('scrollTo', target, options ? options : {});
		} else { // custom scroll is disabled
			if ('top' == target) {
				$(window).scrollTop(0);
			}
			// complete for other cases as well
		}
	},

	getScrollContainer:function(){
		return this.customScrollEnabled ? $(this.scrollContainer) : null;
	},

	// @require jquery.mCustomScrollbar.js
	// @require jquery.mCustomScrollbar.css
	_initCustomScroll:function(){
		var sc = this.getScrollContainer();

		if (!sc || sc.length < 1) {
			return false;
		}

		sc.mCustomScrollbar({
			theme:'dark-3',
			scrollInertia:500,
			autoHideScrollbar:true,
			scrollButtons:{enable:true}
		});

		return true;
	}
};

/**
 * Namespace for different UI element init functions
 * @type {Object}
 */
Template.shortcodes = {
	/**
	 * General init function
	 * 
	 * @param  {domNode|jQuery} forElement element for that all init should be applied
	 * @return {void}
	 */
	init: function(forElement){
		if (!forElement) forElement = document;

		this.initAccordion(forElement);

		this.initProgressBar(forElement, 2000);

		this.initRating(forElement);

		this.initDonutChart(forElement);
	},

	/**
	 * Triggers 'hardReset' event that used to reinit all elements
	 * 
	 * @return {void}
	 */
	hardReset: function(){
		$(this).trigger('hardReset');
	},


	/**
	 * Init accordion controlls
	 * 
	 * @param  {domNode|jQuery} forElement
	 * @return {void}
	 */
	initAccordion:function(forElement){
		var panels = $('.accordion-item', forElement ? forElement : document);
		if (panels.length < 1 || panels.data('inited')) {
			return;
		}
		panels.data('inited',true);

		$(this).on('hardReset', function(){
			panels.data('inited', null);
		});

		var self = this;
		panels.one('shown.bs.collapse', function(){
			self.init(this);
		});
	},

	/**
	 * Init progress bar controlls
	 * 
	 * @param  {domNode|jQuery} forElement
	 * @param  {integer}        animationDuration
	 * @return {void}
	 */
	initProgressBar:function(forElement, animDuration){
		var progressBar = this._getElements('.progress-bar', forElement);
		if (progressBar.length < 1) {
			return;
		}

		if('undefined' == typeof(animDuration)){
			animDuration = 1000;
		}

		var self = this,
			progress = '.progress-bar__progress',
			bar = '.progress-bar__bar',
			progressBarValue = '.progress-bar__value',
			sign = '%';

		progressBar.each(function(){
			var container = $(this).find(progress),
				value = $(this).find(bar).attr('data-level'),
				result = value + sign;

			if(animDuration){
				$(this).find(progressBarValue).animate({width : value + '%'}, animDuration);
			}else{
				$(this).find(progressBarValue).css({'width' : value + '%'});
			}

			self._animateCounterValue(value, result, container, animDuration, sign);
		});
	},

	/**
	 * Progress bar animation function
	 */
	_animateCounterValue:function(value, result, target, duration, sign) {
		if(duration){
			var count = 0,
				speed = parseInt(duration/value, 10),
				interval = setInterval(function(){
					if(count - 1 < value){
						target.html(count + sign);
					} else {
						target.html(result);
						clearInterval(interval);
					}
					count++;
				}, speed);
		} else {
			target.html(result);
		}
	},

	/**
	 * Init rating controlls
	 * 
	 * @require jquery.raty.js
	 * @param  {domNode|jQuery} forElement
	 * @return {void}
	 */
	initRating:function(forElement){
		var elements = this._getElements('.rating__score', forElement);
		if (elements.length < 1 || elements.data('inited')) {
			return;
		}
		elements.data('inited', true);

		elements.raty({
			starType:'i',
			number:8,
			noRatedMsg:' ',
			readOnly: true,
			score:function(){return $(this).attr('data-score');}
		});
	},

	/**
	 * Init donut chart controlls
	 * 
	 * @require jquery.easypiechart.js
	 * @param  {domNode|jQuery} forElement
	 * @return {void}
	 */
	initDonutChart:function(forElement){
		var elements = this._getElements('.donut-chart', forElement);
		if (elements.length < 1 || elements.data('inited')) {
			return;
		}
		elements.data('inited', true);

		$(this).on('hardReset', function(){
			if (elements.data('easyPieChart')) {
				elements
					.data('inited', null)
					.data('easyPieChart', null)
					.find('canvas').remove();
			}
		});

		var elementColor = elements.css('color'),
			elementSecondColor = elements.find('.donut-chart__pallete-second-color').css('color'),
			elementTextValue = '.donut-chart__value';

		elements.easyPieChart({
			barColor : elementColor,
			trackColor : elementSecondColor,
			scaleColor : 'transparent',
			size : 150,
			lineWidth : 10,
			animate: 2000,
			onStep : function(from, to, percent){
				$(this.el).find(elementTextValue).text(Math.round(percent) + '%');
			}
		});
	},

	/**
	 * Special wrapper over selector function.
	 * Allows take ignore elements located in collapsed accordion panels.
	 * 
	 * @param  {String}         selector               jquery selector
	 * @param  {domNode|jQuery} forElement             container element, if not passed - document node will be used
	 * @param  {Boolean}        includeingClosedPanels set to true if want ignore elements location
	 * @return {jQiery}
	 */
	_getElements:function(selector, forElement, includeingClosedPanels){
		var result = $(selector, forElement ? forElement : document);
		if (result.length > 0 && !includeingClosedPanels) {
			// we need ignore all elements that lays in the collapsed accordion panels
			return result.filter(function(){
				var accordionPanel = $(this).parents('.collapse');
				return accordionPanel.length > 0 && !accordionPanel.hasClass('in') ? false : true;
			})
		}
		return result;
	}
};

/**
 * Namespace with different help functions
 */
Template.tools = {
	/**
	 * Check if currnt browser is IE
	 * @param  {integer}  minVersion
	 * @return {Boolean}
	 */
	isIe:function(minVersion){
		var isIe = false,
			curVersion = 0,
			neeedCheckVersion = minVersion < 5;
		if (navigator.userAgent) {
			var ua = navigator.userAgent;
				ieInfo = /(msie) ([\w.]+)/.exec(ua.toLowerCase())
			if (ieInfo) {
				if (!neeedCheckVersion) return true;
				isIe = true;
				curVersion = parseInt(ieInfo.pop(),10);
			} else {
				var trident = ua.indexOf('Trident/');
				if (trident > 0) {
					if (!neeedCheckVersion) return true;
					isIe = true;
					// IE 11 => return version number
					var rv = ua.indexOf('rv:');
					curVersion = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
				} else {
					var edge = ua.indexOf('Edge/');
					if (edge > 0) {
						if (!neeedCheckVersion) return true;
						isIe = true;
						// IE 12 => return version number
						curVersion = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
					}
				}
			}

			if (isIe && neeedCheckVersion) {
				return minVersion >= curVersion;
			}
		}
		return isIe;
	},

	/**
	 * Check if is touch device used
	 * @return {Boolean}
	 */
	isTouch:function(){
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
	}
};

$(document).on('ready', function(){
	Template.init();
});