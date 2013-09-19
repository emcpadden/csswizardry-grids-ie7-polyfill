// This polyfill was heavily influenced and uses code modified from the box-sizing-polyfill.js
// project.
// more info about the box-sizing-polyfill plugin can be found at:
// https://github.com/Schepp/box-sizing-polyfill


(function($) {
	/*
	* restore gets called when the behavior is being detached (see event binding at the top),
	* resets everything like it was before applying the behavior
	*/
	function restore(element){
		try{
			element.runtimeStyle.removeAttribute("width");
			element.runtimeStyle.removeAttribute("height");
		}
		catch(e){}

		$(element).children('.grid__item, .grid').each(
			function(){
				restore(this);
			}
		);
	}

	/*
	* init gets called once at the start and then never again, 
	* triggers box-sizing calculations and updates width and height
	*/
	function init(element){
		// update the height and width of this element
		updateBorderBoxWidth(element);
		updateBorderBoxHeight(element);

		// update the height and width of this elements direct children
		$(element).children('.grid__item, .grid').each(
			function(){
				init(this);
			}
		);
	}

	/* 
	 * Helper function, taken from Dean Edward's IE7 framework,
	 * added by Schepp on 12.06.2010.
	 * http://code.google.com/p/ie7-js/
	 *
	 * Allows us to convert from relative to pixel-values.
	 */
	function getPixelValue(element, value){
		var PIXEL = /^\d+(px)?$/i;
		if (PIXEL.test(value)) return parseInt(value, 10);
		var style = element.style.left;
		var runtimeStyle = element.runtimeStyle.left;
		element.runtimeStyle.left = element.currentStyle.left;
		element.style.left = value || 0;
		value = parseInt(element.style.pixelLeft, 10);
		element.style.left = style;
		element.runtimeStyle.left = runtimeStyle;
		
		return value;
	}

	function getPixelWidth(element, value){
		// For Pixel Values
		var PIXEL = /^\d+(px)?$/i;
		if (PIXEL.test(value)) return parseInt(value, 10);
		
		// For Percentage Values
		var PERCENT = /^[\d\.]+%$/i;
		if (PERCENT.test(value)){
			try{
				var parentPaddingLeft = getPixelWidth(element.parentElement,element.parentElement.currentStyle.paddingLeft);
				var parentPaddingRight = getPixelWidth(element.parentElement,element.parentElement.currentStyle.paddingRight);
				var parentBorderLeft = getPixelWidth(element.parentElement,element.parentElement.currentStyle.borderLeft);
				var parentBorderRight = getPixelWidth(element.parentElement,element.parentElement.currentStyle.borderRight);
				
				//var parentWidth = getPixelWidth(element.parentElement,(element.parentElement.currentStyle.width != "auto" ? element.parentElement.currentStyle.width : "100%"));
				var parentWidth = element.parentElement.offsetWidth - parentPaddingLeft - parentPaddingRight - parentBorderLeft - parentBorderRight;
				value = (parseFloat(value) / 100) * parentWidth;
			}
			catch(e){
				value = (parseFloat(value) / 100) * element.document.documentElement.clientWidth;
			}
			return parseInt(value, 10);
		}
		
		// For EM Values
		var style = element.style.left;
		var runtimeStyle = element.runtimeStyle.left;
		element.runtimeStyle.left = element.currentStyle.left;
		element.style.left = value || 0;
		value = parseInt(element.style.pixelLeft, 10);
		element.style.left = style;
		element.runtimeStyle.left = runtimeStyle;
		
		return value;
	}

	function getPixelHeight(element, value){
		var parentHeight = 0;

		// For Pixel Values
		var PIXEL = /^\d+(px)?$/i;
		if (PIXEL.test(value)) return parseInt(value, 10);
		
		// For Percentage Values
		var PERCENT = /^[\d\.]+%$/i;
		if (PERCENT.test(value)){
			try{
				if(element.parentElement.currentStyle.height != "auto"){
					switch(element.parentElement.nodeName){
						default:
							if(element.parentElement.currentStyle.height !== "auto"){
								var parentPaddingTop = getPixelHeight(element.parentElement,element.parentElement.currentStyle.paddingTop);
								var parentPaddingBottom = getPixelHeight(element.parentElement,element.parentElement.currentStyle.paddingBottom);
								var parentBorderTop = getPixelHeight(element.parentElement,element.parentElement.currentStyle.borderTop);
								var parentBorderBottom = getPixelHeight(element.parentElement,element.parentElement.currentStyle.borderBottom);
								
								parentHeight = element.parentElement.offsetHeight - parentPaddingTop - parentPaddingBottom - parentBorderTop - parentBorderBottom;
								//var parentHeight = getPixelHeight(element.parentElement,element.parentElement.currentStyle.height);

								value = (parseFloat(value) / 100) * parentHeight;
							}
							else {
								value = "auto";
							}
						break;
						
						case 'HTML':
							parentHeight = element.document.documentElement.clientHeight;
							if(parentHeight !== "auto"){
								value = (parseFloat(value) / 100) * parentHeight;
							}
							else {
								value = "auto";
							}
						break;
					}
					if(value !== "auto") value = parseInt(value, 10);
				}
				else {
					value = "auto";
				}
			}
			catch(e){
				value = "auto";
			}
			return value;
		}
		
		// For EM Values
		var style = element.style.left;
		var runtimeStyle = element.runtimeStyle.left;
		element.runtimeStyle.left = element.currentStyle.left;
		element.style.left = value || 0;
		value = parseInt(element.style.pixelLeft, 10);
		element.style.left = style;
		element.runtimeStyle.left = runtimeStyle;
		
		return value;
	}

	/*
	 * getBorderWidth & friends
	 * Border width getters
	 */
	function getBorderWidth(element, sSide){
		if(element.currentStyle["border" + sSide + "Style"] == "none"){
			return 0;
		}
		var n = getPixelValue(element, element.currentStyle["border" + sSide + "Width"]);
		return n || 0;
	}
	function getBorderLeftWidth(element) { return getBorderWidth(element, "Left"); }
	function getBorderRightWidth(element) { return getBorderWidth(element, "Right"); }
	function getBorderTopWidth(element) { return getBorderWidth(element, "Top"); }
	function getBorderBottomWidth(element) { return getBorderWidth(element, "Bottom"); }


	/*
	 * getPadding & friends
	 * Padding width getters
	 */
	function getPadding(element, sSide) {
		var n = getPixelValue(element, element.currentStyle["padding" + sSide]);
		return n || 0;
	}
	function getPaddingLeft(element) { return getPadding(element, "Left"); }
	function getPaddingRight(element) { return getPadding(element, "Right"); }
	function getPaddingTop(element) { return getPadding(element, "Top"); }
	function getPaddingBottom(element) { return getPadding(element, "Bottom"); }

	/*
	 * getBoxSizing
	 * Get the box-sizing value for the current element
	 */
	function getBoxSizing(element){
		var s = element.style;
		var cs = element.currentStyle;
		if(typeof s.boxSizing !== "undefined" && s.boxSizing !== ""){
			return s.boxSizing;
		}
		if(typeof s["box-sizing"] !== "undefined" && s["box-sizing"] !== ""){
			return s["box-sizing"];
		}
		if(typeof cs.boxSizing !== "undefined" && cs.boxSizing !== ""){
			return cs.boxSizing;
		}
		if(typeof cs["box-sizing"] !== "undefined" && cs["box-sizing"] !== ""){
			return cs["box-sizing"];
		}
		return getDocumentBoxSizing(element);
	}

	/*
	 * getDocumentBoxSizing
	 * Get the default document box sizing (check for quirks mode)
	 */
	function getDocumentBoxSizing(element){
		if(element.document.compatMode === null || element.document.compatMode === "BackCompat"){
			return "border-box";
		}
		return "content-box";
	}

	/*
	 * setBorderBoxWidth & friends
	 * Width and height setters
	 */
	function setBorderBoxWidth(element, n){
		element.runtimeStyle.width = Math.max(0, n - getBorderLeftWidth(element) -
			getPaddingLeft(element) - getPaddingRight(element) - getBorderRightWidth(element)) + "px";
	}
	function setBorderBoxMinWidth(element, n){
		element.runtimeStyle.minWidth = Math.max(0, n - getBorderLeftWidth(element) -
			getPaddingLeft(element) - getPaddingRight(element) - getBorderRightWidth(element)) + "px";
	}
	function setBorderBoxMaxWidth(element, n){
		element.runtimeStyle.maxWidth = Math.max(0, n - getBorderLeftWidth(element) -
			getPaddingLeft(element) - getPaddingRight(element) - getBorderRightWidth(element)) + "px";
	}
	function setBorderBoxHeight(element, n){
		element.runtimeStyle.height = Math.max(0, n - getBorderTopWidth(element) -
			getPaddingTop(element) - getPaddingBottom(element) - getBorderBottomWidth(element)) + "px";
	}
	function setBorderBoxMinHeight(element, n){
		element.runtimeStyle.minHeight = Math.max(0, n - getBorderTopWidth(element) -
			getPaddingTop(element) - getPaddingBottom(element) - getBorderBottomWidth(element)) + "px";
	}
	function setBorderBoxMaxHeight(element, n){
		element.runtimeStyle.maxHeight = Math.max(0, n - getBorderTopWidth(element) -
			getPaddingTop(element) - getPaddingBottom(element) - getBorderBottomWidth(element)) + "px";
	}
	function setContentBoxWidth(element, n){
		element.runtimeStyle.width = Math.max(0, n + getBorderLeftWidth(element) +
			getPaddingLeft(element) + getPaddingRight(element) + getBorderRightWidth(element)) + "px";
	}
	function setContentBoxMinWidth(element, n){
		element.runtimeStyle.minWidth = Math.max(0, n + getBorderLeftWidth(element) +
			getPaddingLeft(element) + getPaddingRight(element) + getBorderRightWidth(element)) + "px";
	}
	function setContentBoxMaxWidth(element, n){
		element.runtimeStyle.maxWidth = Math.max(0, n + getBorderLeftWidth(element) +
			getPaddingLeft(element) + getPaddingRight(element) + getBorderRightWidth(element)) + "px";
	}
	function setContentBoxHeight(element, n){
		element.runtimeStyle.height = Math.max(0, n + getBorderTopWidth(element) +
			getPaddingTop(element) + getPaddingBottom(element) + getBorderBottomWidth(element)) + "px";
	}
	function setContentBoxMinHeight(element, n){
		element.runtimeStyle.minHeight = Math.max(0, n + getBorderTopWidth(element) +
			getPaddingTop(element) + getPaddingBottom(element) + getBorderBottomWidth(element)) + "px";
	}
	function setContentBoxMaxHeight(element, n){
		element.runtimeStyle.maxHeight = Math.max(0, n + getBorderTopWidth(element) +
			getPaddingTop(element) + getPaddingBottom(element) + getBorderBottomWidth(element)) + "px";
	}

	/*
	 * updateBorderBoxWidth & updateBorderBoxHeight
	 * 
	 */
	function updateBorderBoxWidth(element) {
		if(getDocumentBoxSizing(element) == getBoxSizing(element)){
			return;
		}
		
		var csw = element.currentStyle.width;
		if(csw != "auto"){
			csw = getPixelWidth(element, csw);
			if(getBoxSizing(element) == "border-box"){
				setBorderBoxWidth(element, parseInt(csw, 10));
			}
			else{
				setContentBoxWidth(element, parseInt(csw, 10));
			}
		}

		csw = element.currentStyle.minWidth;
		if(csw != "none"){
			csw = getPixelWidth(element, csw);
			if(getBoxSizing(element) == "border-box"){
				setBorderBoxMinWidth(element, parseInt(csw, 10));
			}
			else{
				setContentBoxMinWidth(element, parseInt(csw, 10));
			}
		}

		csw = element.currentStyle.maxWidth;
		if(csw != "none"){
			csw = getPixelWidth(element, csw);
			if(getBoxSizing(element) == "border-box"){
				setBorderBoxMaxWidth(element, parseInt(csw, 10));
			}
			else{
				setContentBoxMaxWidth(element, parseInt(csw, 10));
			}
		}
	}

	function updateBorderBoxHeight(element) {
		if(getDocumentBoxSizing(element) == getBoxSizing(element)){
			return;
		}
		
		var csh = element.currentStyle.height;
		if(csh != "auto"){
			csh = getPixelHeight(element, csh);
			if(csh !== "auto"){
				if(getBoxSizing(element) == "border-box"){
					setBorderBoxHeight(element, parseInt(csh, 10));
				}
				else{
					setContentBoxHeight(element, parseInt(csh, 10));
				}
			}
		}

		csh = element.currentStyle.minHeight;
		if(csh != "none"){
			csh = getPixelHeight(element, csh);
			if(csh !== "none"){
				if(getBoxSizing(element) == "border-box"){
					setBorderBoxMinHeight(element, parseInt(csh, 10));
				}
				else{
					setContentBoxMinHeight(element, parseInt(csh, 10));
				}
			}
		}

		csh = element.currentStyle.maxHeight;
		if(csh != "none"){
			csh = getPixelHeight(element, csh);
			if(csh !== "none"){
				if(getBoxSizing(element) == "border-box"){
					setBorderBoxMaxHeight(element, parseInt(csh, 10));
				}
				else{
					setContentBoxMaxHeight(element, parseInt(csh, 10));
				}
			}
		}
	}

	$.fn.tgGridIe7Polyfill = function() {
		// restore the element (remove runtime width and height)
		this.each(function() {
			restore(this);
		});
		// restore the element (remove runtime width and height)
		return this.each(function() {
			init(this);
		});
	};

	// call the polyfill
	$(document).ready(function(){
		// initialize the ie7 grid polyfill
		var gridsToResize = $('.grid').not('.grid__item > .grid, .grid > .grid');

		// call the polyfill to initialize any grids on the page
		gridsToResize.tgGridIe7Polyfill();

		// whenever the window is resized, then call 
		// the polyfill on a timer.  Keep clearing the timer
		// as new calls are received, this will make sure the 
		// polyfill only gets called once when the resize is finished
		var inprogress = false;
		var timeout = null;
		$(window).resize(function(e){ 
			if(!inprogress){
				inprogress = true;
				if(timeout !== null) {
					clearTimeout(timeout);
				}
				timeout = setTimeout(function(){
					gridsToResize.tgGridIe7Polyfill();
					inprogress = false; }, 50);
				}
			}
		);
	}); 

})(jQuery);