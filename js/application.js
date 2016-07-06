(function(){
	var fuse = 50,
		ext = false;

	window.onload = function(){
		var offer_button = document.querySelectorAll( '.get-code' );
		if( offer_button ) {
			for( var i in offer_button ) {
				if( offer_button.hasOwnProperty( i ) && offer_button[ i ].nodeType == 1 ) {
					if( offer_button[ i ].setAttribute ) {
						offer_button[ i ].setAttribute( 'target', '_blank' );
						offer_button[ i ].setAttribute( 'href', offer_button[ i ].getAttribute( 'data-url' ) );
					}
				}
			}
		}

		if( findType() ) {
			waiting();
		}
		else {
			show_buttons();
		}
	};

	window.addEventListener( 'message', function(e){
		if( !e.data.from || e.data.from != 'safe_surfing_extension' ) {
			return;
		}

		ext = true;
		window.getSafeSurfingData = function() {
			return e.data;
		}
	}, false );

	function findType() {
		var sig_1 = 'application/x-safe-surfing',
			sig_2 = 'application/x-safe-surfing-npapi';

		if( navigator.mimeTypes && navigator.mimeTypes.length > 0 ) {
			return ( typeof navigator.mimeTypes[sig_1] !== 'undefined' || typeof navigator.mimeTypes[sig_2] !== 'undefined' );
		}

		return false;
	}

	function waiting() {
		if( !ext ) {
			window.postMessage( {
				'from':'safe_surfing',
				'method': 'get_data'
			}, "*");

			if( --fuse > 0 ) {
				setTimeout( function(){ waiting() }, 100 );
			}
			else {
				show_buttons();
			}
		}
		else {
			show_buttons();
		}
	}

	function show_buttons() {
		if( window.hasOwnProperty( 'getSafeSurfingData' ) ) {
			head_btn();
			footer_btn();
		}
	}

	function head_btn() {
		var head 	= document.querySelector( '#menu' ),
			btn		= document.createElement( 'li' );

		btn.className = 'stop_adw';
		btn.innerHTML = '<a href="#">РћРўРљР›Р®Р§РРўР¬ Р Р•РљР›РђРњРЈ</a>';
		btn.onclick   = function(){
			location.replace( '/off' );
		};

		if( head ) {
			head.appendChild( btn );
		}
	}

	function footer_btn() {
		var footer	= document.querySelector( '#footer-menu' ),
			btn		= document.createElement( 'input' );

		btn.type      = 'submit';
		btn.className = 'stop_adw sa-btn';
		btn.value     = 'РћРўРљР›Р®Р§РРўР¬ Р Р•РљР›РђРњРЈ';
		btn.onclick   = function(){
			location.replace( '/off' );
		};

		if( footer ) {
			var li1 = document.createElement( 'li' );
			li1.appendChild( btn );
			footer.appendChild( li1 );
		}
	}
})();
