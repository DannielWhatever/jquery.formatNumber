

/**
 * @description return a number
 * @return number
 */
String.prototype.toNumber = function(){
	return +new Number(this);
};

/**
 * @description return a number, taking a string with comma like decimal separator
 * @return number
 */
String.prototype.toDouble = function(){
	return +new Number( this.replace(',', '.') );
};

Number.prototype.toDouble = function(){
	return +new Number( this.toString().replace(',', '.') );
};



/**
 * @description emulate toFixed function, for string vars
 * @param x		number		Number of decimals after point
 * @return string
 */
String.prototype.toFixed = function(x){
	return new Number(this).toFixed(x);
};



/**
 * jQuery adds
 */
$.fn.extend({
	
	/**
	 * @description
	 * 
	 * @param boFixed: pass an truthy argument to dont fixed
	 * @param boCouldBeDecimal: pass an truthy argument to apply , this ever apply toFixed  
	 */
	darFormato: function(boFixed,boCouldBeDecimal){
		$(this).each(function(){
			var value = new Number($(this).html());
			if(!isNaN(value)){
				if(boCouldBeDecimal==undefined)
					$(this).html( boFixed? value : value.toFixed(2) );
				else
					$(this).html( (value % 1 == 0 || value == 0)? value: value.toFixed(2) );
			}
		}).formatNumber();
	},
	
	darFormatoInputs: function(){
		var o = _formatNumber.getSettings();
		$(this).each(function(){
			$(this).val( $(this).val().replace('.', o.decimal_separator) );
		});
	},

	
	
});