;(function( $, window, document, undefined ) {

	var pluginName = 'uc',
		defaults = {};

	function UC( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.leftDisabled = false;
		this.rightDisabled = false;
		this.itemWidth = 0;
		this.itemCount = 0;
		this.init();
	}

	UC.prototype.init = function () {
		// taking existing children
		var items = $(this.element).children();
		this.itemCount = items.length;

		// extract first child
		var firstItem = items[0] != 'undefined' ? $(items[0]) : null;

		// decide which width to use
		var singleWidth = 0;

		if (this.options.itemWidth != 'undefined' && isNaN(this.options.itemWidth))
		{
			singleWidth = this.options.itemWidth;
		} else if (firstItem != null) {
			singleWidth = firstItem.outerWidth(true);
		}

		this.itemWidth = singleWidth;

		// decide which height to use
		var singleHeight = 0;

		if (this.options.itemHeight != 'undefined' && isNaN(this.options.itemHeight))
		{
			singleHeight = this.options.itemHeight;
		} else if (firstItem != null) {
			singleHeight = firstItem.outerHeight(true);
		}

		// calc and set total width of items container
		var totalWidth = singleWidth * items.length;
		$(this.element).width(totalWidth);

		// construct the items wrapper
		var wrapper = $('<div></div>').width(this.options.showItems * singleWidth)
									.height(singleHeight).addClass('uc-wrapper');
		$(this.element).addClass('uc-slider').wrap(wrapper);

		var $this = this;

		// handle control buttons
		if (this.options.prevButton != 'undefined')
		{
			this.options.prevButton.on('click.' + pluginName, function() {
				$this.prev();
			});
			if (items.length <= this.options.showItems) {
				this.options.prevButton.addClass('uc-prev-disabled');
				this.leftDisabled = true;
			}
		}

		if (this.options.nextButton != 'undefined')
		{
			this.options.nextButton.addClass('uc-next-disabled').on('click.' + pluginName, function() {
				$this.next();
			});
			this.rightDisabled = true;
		}
	};

	UC.prototype.prev = function () {
		if (this.options.prevButton.hasClass('uc-lock')) return;
		if (this.leftDisabled) return;
		if (this.itemWidth == 0 || isNaN(this.itemWidth)) return;

		var left = $(this.element).position().left;
		var leftCount = Math.abs(left) / this.itemWidth;

		if (this.itemCount > leftCount + this.options.showItems) {
			left-= this.itemWidth;
			this.options.prevButton.addClass('uc-lock');
			this.options.nextButton.addClass('uc-lock');
			$this = this;
			$(this.element).stop(true).animate({
				left: left
			}, 500, function() {
				$this.options.prevButton.removeClass('uc-lock');
				$this.options.nextButton.removeClass('uc-lock');
			});
			leftCount = Math.abs(left) / this.itemWidth;
			if (this.itemCount == leftCount + this.options.showItems) {
				this.options.prevButton.addClass('uc-prev-disabled');
				this.leftDisabled = true;
			}
			if (leftCount > 0) {
				this.options.nextButton.removeClass('uc-next-disabled');
				this.rightDisabled = false;
			}
		}
	};

	UC.prototype.next = function () {
		if (this.options.nextButton.hasClass('uc-lock')) return;
		if (this.rightDisabled) return;
		if (this.itemWidth == 0 || isNaN(this.itemWidth)) return;

		var left = $(this.element).position().left;
		var leftCount = Math.abs(left) / this.itemWidth;

		if (leftCount > 0) {
			left+= this.itemWidth;
			this.options.prevButton.addClass('uc-lock');
			this.options.nextButton.addClass('uc-lock');
			$this = this;
			$(this.element).stop(true).animate({
				left: left
			}, 500, function() {
				$this.options.prevButton.removeClass('uc-lock');
				$this.options.nextButton.removeClass('uc-lock');
			});
			leftCount = Math.abs(left) / this.itemWidth;
			if (this.itemCount > leftCount + this.options.showItems) {
				this.options.prevButton.removeClass('uc-prev-disabled');
				this.leftDisabled = false;
			}
			if (leftCount == 0) {
				this.options.nextButton.addClass('uc-next-disabled');
				this.rightDisabled = true;
			}
		}
	};

	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new UC( this, options ));
			}
		});
	}
})( jQuery, window, document );