// search
(function() {
    var text = document.querySelector( '.sb-input' ),
        box  = document.querySelector( '#search-box'),
        help = document.querySelector( '.auto-complete-wrap'),
        load   = document.querySelector( '.sb-load'),
        result = document.querySelector( '.sb-result'),
        result_list = document.querySelector( '.sb-result > ul'),
        cache = {},
        isFocus = false,
        isMouseInArea = false;

    box.addEventListener( 'mouseenter', function() { isMouseInArea = true; }, false );
    box.addEventListener( 'mouseleave', function() { isMouseInArea = false; }, false );

    text.addEventListener( 'focus', function() {
        isFocus = true;
        box.style.width = '400px';
        text.style.width = '364px';
        if( text.value.length >= 3 ) {
            load.innerHTML = 'Р·Р°РіСЂСѓР·РєР°...';
            setTimeout( function() {
                if( isFocus ) {
                    help.style.display = 'block';
                    find( text.value );
                }
            }, 200 );
        }
    }, false );

    text.addEventListener( 'blur', function() {
        if( isMouseInArea == false ) {
            isFocus = false;
            box.style.width = '200px';
            text.style.width = '164px';
            help.style.display = 'none';
        }
    }, false );

    text.addEventListener( 'keyup', function() {
        if( text.value.length >= 3 ) {
            load.innerHTML = 'Р·Р°РіСЂСѓР·РєР°...';
            load.style.display = 'block';
            result.style.display = 'none';
            help.style.display = 'block';
            find( text.value );
        }
        else {
            help.style.display = 'none';
        }
    }, false );

    function find( query ) {
        var be = false;
        if( Object.keys( cache).length > 0 ) {
            for( var str in cache ) {
                if( cache.hasOwnProperty( str ) && query.toLowerCase().indexOf( str.toLowerCase() ) == 0 ) {
                    var output = [];
                    for( var i in cache[ str ] ) {
                        if( cache[ str ].hasOwnProperty( i ) ) {
                            if( cache[ str ][ i ][ 'name'].toLowerCase().indexOf( query.toLowerCase() ) !== -1 ) {
                                output.push( cache[ str ][ i ] );
                            }
                        }
                    }

                    be = true;
                    show( output, query );
                }
            }
        }

        if( be == false ) {
            get( query );
        }
    }

    function get( query ) {
        ajax.post(
            '',
            'ajax=search&q=' + query,
            function( json ) {
                json = JSON.parse( json );
                cache[ query ] = json;
                show( json, query );
            }
        );
    }

    function show( data, query ) {
        if( data && data.length > 0 ) {
            var wrap = document.createDocumentFragment(),
                pattern = '<a href="%s%"><span><img src="%s%"></span> %s%</a>';
            for( var i in data ) {
                if( data.hasOwnProperty( i ) ) {
                    var li = document.createElement( 'li' ),
                        name = '',
                        start = data[ i ][ 'name'].toLowerCase().indexOf( query.toLowerCase() );

                    if( start != -1 ) {
                        if( start === 0 ) {
                            name = '<strong>' + data[ i ][ 'name' ].substr( 0, query.length ) + '</strong>' +
                                data[ i ][ 'name' ].substr( query.length );
                        }
                        else {
                            name = data[ i ][ 'name' ].substr( 0, start ) + '<strong>' +
                                data[ i ][ 'name' ].substr( start, query.length ) + '</strong>' +
                                data[ i ][ 'name' ].substr( query.length + start );
                        }
                    }

                    li.innerHTML = pattern.replace( '%s%', data[ i ][ 'link' ] )
                        .replace( '%s%', data[ i ][ 'icon' ] )
                        .replace( '%s%', name );
                    wrap.appendChild( li );
                }
            }

            result_list.innerHTML = '';
            load.style.display = 'none';
            result_list.appendChild( wrap );
            result.style.display = 'block'
        }
        else {
            result_list.innerHTML = '';
            result.style.display = 'none';
            load.innerHTML = 'СЃРѕРІРїР°РґРµРЅРёР№ РЅРµ РЅР°Р№РґРµРЅРѕ...';
            load.style.display = 'block';
        }
    }
})();