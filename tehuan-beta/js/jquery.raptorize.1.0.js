/*
 * jQuery Raptorize Plugin 1.0
 * www.ZURB.com/playground
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function($) {

    $.fn.raptorize = function(options) {

        //Yo' defaults
        var defaults = {  
            enterOn: 'click', //timer, konami-code, click
            delayTime: 5000 //time before raptor attacks on timer mode
            };  
        
        //Extend those options
        var options = $.extend(defaults, options); 
	
        return this.each(function() {
			var _this = $(this);
			var audioSupported = true;
			
			//Raptor Vars - console.log(Math.floor(Math.random()*11));
			var raptorImageMarkup;// = '<img id="elRaptor" style="display: none" src="raptor/mujer.png" />';
			var raptorAudioMarkup;// = '<audio id="elRaptorShriek" preload="auto"><source src="raptor/mujer-sound.mp3"/></audio>';	
			var image = 'mujer.png';
			var sound = 'mujer-sound.mp3';
			var locked = false;
			
			//Append Raptor and Style
			//$('body').append(raptorImageMarkup);
 			//if(audioSupported) { $('body').append(raptorAudioMarkup); }
			/*var raptor = $('#elRaptor').css({
				"position":"fixed",
				"bottom": "-700px",
				"right" : "0",
				"display" : "block"
			})
			*/
			
			// Animating Code
			function init() {
			   
				locked = true;
			    	
					var raptorImageMarkup = '<img id="elRaptor" style="display: none" src="raptor/'+image+'" />';
					var raptorAudioMarkup = '<audio id="elRaptorShriek" preload="auto"><source id="elRaptorSnd" src="raptor/'+sound+'"/></audio>';	
					
					if(audioSupported) { $('body').append(raptorAudioMarkup); }
					$('body').append(raptorImageMarkup);
					var raptor = $('#elRaptor').css({
						"position":"fixed",
						"bottom": "-700px",
						"right" : "0",
						"display" : "block"
					})
								
				// Movement Hilarity	
				raptor.animate({
					"bottom" : "-500"
				}, function() { 
				
					
					//INCLUDE HERE THE LOGIC FOR VARIATING IMAGES AND SOUNDS
					
					var p = Math.random();
					if (p > 0.75){
						image = 'raptor/mujer.png';
						sound = 'raptor/mujer-sound.mp3';
					}else if (p > 0.5){
						image = 'raptor/luminaria.png';
						sound = 'raptor/luminaria-sound.wav';
					}else if (p > 0.25){
						image = 'raptor/policia.png';
						sound = 'raptor/policia-sound.mp3';
					}else if (p > 0.01){
						image = 'raptor/bombero.png';
						sound = 'raptor/bombero-sound.mp3';
					}else{
						image = 'raptor/raptor.png';
						sound = 'raptor/raptor-sound.mp3';
					}
					
					
					
					
					var i = document.getElementById("elRaptor");	i.src = image;
					var s = document.getElementById("elRaptorShriek");s.src = sound;
					if(audioSupported) document.getElementById('elRaptorShriek').play();
					
					
					$(this).animate({
						"bottom" : "50px"
					}, 100, function() {
						var offset = (($(this).position().left)+400);
						$(this).delay(100).animate({
							"right" : offset
						}, 5500, function() {  //Modify this value for speed of screen traversing
							raptor = $('#elRaptor').css({
								"bottom": "-700px",
								"right" : "0"
							})
							locked = false;
							if(audioSupported) { document.getElementById('elRaptorShriek').pause(); document.getElementById('elRaptorShriek').currentTime=0;} 
						})
					});
					
				});
			}
			
			
			//Determine Entrance
			if(options.enterOn == 'timer') {
				setTimeout(init, options.delayTime);
			} else if(options.enterOn == 'click') {
				_this.bind('click', function(e) {
					e.preventDefault();
					if(!locked) {
						init();
					}
				})
			} else if(options.enterOn == 'konami-code'){
			    var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
			    window.addEventListener("keydown", function(e){
			        kkeys.push( e.keyCode );
			        if ( kkeys.toString().indexOf( konami ) >= 0 ) {
			        	init();
			        	kkeys=[];
			        	$(window).unbind('keydown.raptorz');
			        }
			    }, true);
	
			}
			
        });//each call
    }//orbit plugin call
})(jQuery);

