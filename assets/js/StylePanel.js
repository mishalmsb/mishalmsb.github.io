// @use jquery.cookie.js
var StylePanel = {
	opt: {
		themeStyle: '#savvyStyle',
		stylePanel: '.style-panel',
		stylePanelButton: '.style-panel__button',
		cookieColor: 'cookieColor'
	},

	loadCssFile:'style-panel.css',

	init: function(config){
		if (this._inited) return;
		this._inited = true;

		if (config) {
			if (config.on) {
				$(this).on(config.on);
				delete(config.on);
			}
			$.extend(this, config);
		}

		var self = this,
			stylePanel = this.getPanel(),
			isShowStylePanel = false;

		if (stylePanel.length < 1) return;

		var needShow = true;
		if (this.loadCssFile) {
			var panelCssUrl = this.getCssFileUrl(this.loadCssFile);
			if ($('link[href^="'+panelCssUrl+'"]').length < 1) {
				needShow = false;
				$('<link>')
					.attr('rel', 'stylesheet')
					.attr('href', panelCssUrl)
					.insertAfter(this.getMainStyleLinkEl())
					.on('load', function(){
						stylePanel.fadeIn('slow');
					});
			}
		}

		stylePanel.find(this.opt.stylePanelButton)
			.on('click', function(){
				stylePanel.animate({
					left : isShowStylePanel ? '-' + stylePanel.outerWidth() + 'px' : 0
				}, 500);
				isShowStylePanel = !isShowStylePanel;
			});

		if (needShow) {
			stylePanel.fadeIn('slow');
		}

		this.getColorButtons().on('click', function(e){
			e.preventDefault();
			self.setColor($(this).data('value'));
		});

		this.getResetBtn().on('click', function(){
			self.setColor('');
		});

		if('undefined' != this.getCookie()){
			this.setColor(this.getCookie());
		} else {
			// need highlight current one
		}
	},

	getPanel:function(){
		return $(this.opt.stylePanel);
	},

	getColorButtons:function(){
		return this.getPanel().find('a[data-value]');
	},

	getCssFileUrl:function(file){
		if (!this._baseCssUrl) {
			var el = this.getMainStyleLinkEl();
			this._baseCssUrl = el.attr('href').replace(/[^/]+$/,'');
		}
		return this._baseCssUrl + file;
	},

	getMainStyleLinkEl:function(){
		return $(this.opt.themeStyle);
	},

	setColor: function(value){
		var linkElement = this.getMainStyleLinkEl();
		if (!this._defaultUrl) {
			this._defaultUrl = linkElement.attr('href');
		}

		var antiCachePostrix = true ? '?tc=c' + (new Date()).getTime() : '';
		var newStyleUrl = value ? this.getCssFileUrl('main-skin-' + value + '.css' + antiCachePostrix) : this._defaultUrl;
		if(newStyleUrl == linkElement.attr('href')){
			return;
		}

		var self = this,
			newLinkElement = linkElement.clone()
			.on('load', function(){
				linkElement.remove();
				$(self).trigger('updated');
			})
			.attr('href', newStyleUrl)
			.insertAfter(linkElement);

		this.setCookie(value);

		// highlight active element
		var btns = this.getColorButtons();
		btns.filter('.active').removeClass('active');
		btns.filter('[data-value="'+value+'"]')
			.addClass('active');

		if (!this._secondCheck) {
			var self = this;
			setTimeout(function(){
				self.checkResetBtnState();
			},200);
			this._secondCheck = true;
		} else {
			this.checkResetBtnState();
		}
	},

	checkResetBtnState:function(){
		var btn = this.getResetBtn();
		if (this.getColorButtons().filter('.active').length) {
			btn.show();
		} else {
			btn.hide();
		}
	},

	getResetBtn:function(){
		return this.getPanel().find('.btn-reset');
	},

	setCookie: function(value){
		$.cookie(this.opt.cookieColor, value);
	},

	getCookie: function(){
		return $.cookie(this.opt.cookieColor);
	}
};

jQuery(function(){
	StylePanel.init({
		on: {
			updated: function(){
				if (window.Template) {
					if (Template.shortcodes) Template.shortcodes.hardReset();
					Template.init();
				}
			}
		}
	});
});
