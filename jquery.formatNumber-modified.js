/**
 *	jQueryFormatNumber.-Modified by DannielWhatever 
 *	Why another forks ? 
 * 		- set decimal separator and thousands separator
 *		- save on sessionStorage 
 *		- apply jQuery valdiators (optional)
 *
 *********************************
 * BASED ON ORIGINAL PLUGIN: 
 *
 * jQuery formatNumber v0.1.1
 * https://github.com/RaphaelDDL/jquery.formatNumber
 * 
 * Copyright (c) 2012 Raphael "DDL" Oliveira
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License (CC BY-NC-SA 3.0) 
 * http://creativecommons.org/licenses/by-nc-sa/3.0/
 */

 
var _formatNumber = {};

(function($){
	
	
	_formatNumber.setSettings = function(val){
		if(val == 'default'){			
			sessionStorage['settings.formatNumber'] = JSON.stringify({decimal_separator:'.',thousands_separator:','});
		}else{
			sessionStorage['settings.formatNumber'] = JSON.stringify(val);
		}		
	};
	
	_formatNumber.getSettings = function(){
		return sessionStorage['settings.formatNumber']!=undefined ? JSON.parse(sessionStorage['settings.formatNumber']) : {decimal_separator:'.',thousands_separator:','};
	};
	
	_formatNumber.sysDecimal = '.';
	
	_formatNumber.customError;
	
	$.fn.extend({
	    formatNumber: function(){
	        
	        var o = _formatNumber.getSettings();
	        //console.log(o);
	        
	        return this.each(function() {
				/* ----Script Start---- */

	            var value,	//string value
	            			x, 		//arr number 
	            			x1, 	//integer part
	            			x2;		//decimal part
				
	            value = ''+$.trim($(this).html());
				x = value.split(_formatNumber.sysDecimal);
				//console.log(x);
				
				//integer part
				x1 = x[0];
				//console.log(x1);
				
				//decimal part
				x2 = x.length > 1 ? o.decimal_separator + x[1] : '';
				
				//console.log(x2);
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) 
					x1 = x1.replace(rgx, '$1' + o.thousands_separator + '$2');

				$(this).html(x1 + x2);
	
				/* ----Script End---- */
	        });//return each
	    }
	});//fn.extend
	
	
	//if jquery validator is defined , add a method to validate float numbers according to format number settings
	if($.validator){
		$.validator.addMethod('floatNumber', function(val, el) {
			var response = true;
			_formatNumber.customError = 'Value should be numeric';
			var defaultSeparator = _formatNumber.sysDecimal; //default separator is point
			var decimal = _formatNumber.getSettings().decimal_separator; //get decimal separator from settings 
			//console.log(decimal);
			if(decimal!=defaultSeparator){ 
				if(val.indexOf(defaultSeparator)==-1){ //if not use default separator
					if(val.indexOf(decimal)>-1) //delete separators and apply $.isNumeric
						response = $.isNumeric(val.replace(decimal,''));
					else 
						response = $.isNumeric(val);
				}
				else{ //else if -> exist '.' and the decimal separator by settings is ','
					_formatNumber.customError = 'Invalid format number';
					response = false; //something is wrong!
				}
			}
			else{
				response = $.isNumeric(val);
			}
			
			if(!response){
				$.validator.messages.floatNumber = _formatNumber.customError;
			}
			
		    return response; 
		}, _formatNumber.customError);
		
		//Range min< val <= max
		$.validator.addMethod('floatWithRange', function(val, el, params) {
			params = params.split(',');
			var defaultSeparator = _formatNumber.sysDecimal; //default separator is point
			var decimal = _formatNumber.getSettings().decimal_separator; //get decimal separator from settings 
			
			var response = true;
			
			var valid1=true;
			var valid2=true;
			var valid3=true;
			
			var invalidFormat=false;
//			console.log("decimal : " + decimal);
			var baseError = 'Value should be numeric ';
			var customError =  ' and be greater than '+params[0].replace(defaultSeparator,decimal)+' and be less or equal than '+params[1].replace(defaultSeparator,decimal)+'.';	
			
			
			//console.log(params);
			//console.log(params[1]);

//			console.log(decimal);
//			console.log(defaultSeparator);
			
			if(decimal!=defaultSeparator){ 
				
				if(val.indexOf(defaultSeparator)==-1){ //if not use default separator
					var tempVal = 0;
					if(val.indexOf(decimal)>-1){ //delete separators and apply $.isNumeric
						tempVal= Number(val.replace(decimal,defaultSeparator));
					}
					else{ 
						tempVal = Number(val);
					}
					valid1 = $.isNumeric(tempVal);
					valid2 = tempVal>Number(params[0]);
					valid3 = tempVal<=Number(params[1]);
				}
				else{ //else if -> exist '.' and the decimal separator by settings is ','
					invalidFormat = true;
					valid1 = false; //something is wrong!
				}
			}
			else{
				//$.isNumeric by default
				valid1 = $.isNumeric(val);
				valid2 = Number(val)>Number(params[0]);
				valid3 = Number(val)<=Number(params[1]);
//				console.log(val);
//				console.log(parseInt(params[1]));
//				console.log(valid3);
			}
		
			//Apply messages and ignore to X.
			if(params[0].toUpperCase()=='X'){
				valid2 = true;
				customError =  ' and be less than '+params[1].replace(defaultSeparator,decimal)+'.';
			}
			if(params[1].toUpperCase()=='X'){
				valid3 = true;
				customError =  ' and be greater than '+params[0].replace(defaultSeparator,decimal)+'.';
				//Both
				if(params[0].toUpperCase()=='X'){
					customError =  '.';
				}
			}
			
//			console.log(valid1);
//			console.log(valid2);
//			console.log(valid3);
			
			//get Response
			var response = valid1 && valid2 && valid3;
			if(!response){
				if(invalidFormat)
					_formatNumber.customError = 'Invalid format number';
				else
					_formatNumber.customError = baseError+customError;
				$.validator.messages.floatWithRange = _formatNumber.customError;
			}
			
			return response; 
		}, _formatNumber.customError);
		
		//Range min<= val <= max
		$.validator.addMethod('floatWithRangeEq', function(val, el, params) {
			params = params.split(',');
			var defaultSeparator = _formatNumber.sysDecimal; //default separator is point
			var decimal = _formatNumber.getSettings().decimal_separator; //get decimal separator from settings 
			
			var response = true;
			
			var valid1=true;
			var valid2=true;
			var valid3=true;
			
			var invalidFormat=false;
//			console.log("decimal : " + decimal);
			var baseError = 'Value should be numeric ';
			var customError =  ' and be greater or equal than '+params[0].replace(defaultSeparator,decimal)+' and be less or equal than '+params[1].replace(defaultSeparator,decimal)+'.';	
			
			
			//console.log(params);
			//console.log(params[1]);

//			console.log(decimal);
//			console.log(defaultSeparator);
			
			if(decimal!=defaultSeparator){ 
				
				if(val.indexOf(defaultSeparator)==-1){ //if not use default separator
					var tempVal = 0;
					if(val.indexOf(decimal)>-1){ //delete separators and apply $.isNumeric
						tempVal= Number(val.replace(decimal,defaultSeparator));
					}
					else{ 
						tempVal = Number(val);
					}
					valid1 = $.isNumeric(tempVal);
					valid2 = tempVal>=Number(params[0]);
					valid3 = tempVal<=Number(params[1]);
				}
				else{ //else if -> exist '.' and the decimal separator by settings is ','
					invalidFormat = true;
					valid1 = false; //something is wrong!
				}
			}
			else{
				//$.isNumeric by default
				valid1 = $.isNumeric(val);
				valid2 = Number(val)>=Number(params[0]);
				valid3 = Number(val)<=Number(params[1]);
//				console.log(val);
//				console.log(parseInt(params[1]));
//				console.log(valid3);
			}
		
			//Apply messages and ignore to X.
			if(params[0].toUpperCase()=='X'){
				valid2 = true;
				customError =  ' and be less or equal than '+params[1].replace(defaultSeparator,decimal)+'.';
			}
			if(params[1].toUpperCase()=='X'){
				valid3 = true;
				customError =  ' and be greater or equal than '+params[0].replace(defaultSeparator,decimal)+'.';
				//Both
				if(params[0].toUpperCase()=='X'){
					customError =  '.';
				}
			}
			
//			console.log(valid1);
//			console.log(valid2);
//			console.log(valid3);
			
			//get Response
			var response = valid1 && valid2 && valid3;
			if(!response){
				if(invalidFormat)
					_formatNumber.customError = 'Invalid format number';
				else
					_formatNumber.customError = baseError+customError;
				$.validator.messages.floatWithRangeEq = _formatNumber.customError;
			}
			
			return response; 
		}, _formatNumber.customError);
	}
	
}(jQuery));
