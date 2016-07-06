var ajax = {
    _init: function() {
        var a = false;
        try {
            if( a = new XMLHttpRequest() ){
                ajax._req = function(){ return new XMLHttpRequest() };
                return;
            }
        } catch( e ) {}
        ajax._each( ['Msxml2.XMLHTTP','Microsoft.XMLHTTP'], function(){
            try{
                var t = '' + this;
                if( a = new ActiveXObject( t ) ){
                    (function( n ) {
                        ajax._req = function(){ return new ActiveXObject( n ); };
                    })( t );
                    return false;
                }
            } catch( e ) {}
        } );
    },
    _each: function each(object, callback) {
        if ( ajax._typeof(object) !== 'Object' && typeof object.length !== 'undefined') {
            for (var i = 0, length = object.length; i < length; i++) {
                var value = object[i];
                if (callback.call(value, i, value) === false) break;
            }
        } else {
            for (var name in object) {
                if (!Object.prototype.hasOwnProperty.call(object, name)) continue;
                if (callback.call(object[name], name, object[name]) === false)
                    break;
            }
        }

        return object;
    },
    _getreq: function() {
        if( !ajax._req ){
            ajax._init();
        }
        return ajax._req();
    },
    _prepare: function( arr ) {
        var query = [];
        for( var k in arr ){
            if( arr.hasOwnProperty( k ) ) {
                if (arr[ k ] == null || ajax._typeof( arr[ k ] ) === 'Function') {
                    continue;
                }

                if( ajax._typeof( arr[ k ] ) === 'Array' ){
                    for( var i = 0, c = 0, l = arr[ k ].length; i < l; ++i ){
                        if( arr[ k ][ i ] == null || ajax._typeof( arr[ k ][ i ] ) === 'Function' ){
                            continue;
                        }
                        query.push( encodeURIComponent( k ) + '[' + c + ']=' + encodeURIComponent( arr[ ajax._prepare( arr[ k ][ i ] ) ] ) );
                        ++c;
                    }
                }
                else {
                    query.push( encodeURIComponent( k ) + '=' + encodeURIComponent( arr[ k ] ) );
                }
            }
        }

        query.sort();
        return query.join( '&' );
    },
    _typeof: function( obj ){
        return Object.prototype.toString.call(obj).slice(8,-1);
    },
    post: function( url, query, success, fail ){
        var r = ajax._getreq(),
            q = ( ajax._typeof( query ) !== 'String' ) ? ajax._prepare( query ) : query;
        try{
            r.open( 'POST', url, true );
        } catch( e ) { return false; }
        r.onreadystatechange = function(){
            if( r.readyState == 4 ){
                if( r.status >= 200 && r.status < 300 ){
                    if( success ) success( r.responseText, r );
                }
                else {
                    if( fail ) fail( r.responseText, r );
                }
            }
        };
        r.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        r.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
        r.send( q );
        return true;
    }
};

var _cookie = {
    _init: function(){
        var temp = document.cookie.split(';');
        _cookie._data = {};
        if( temp ) {
            for( var i in temp ) {
                if( temp.hasOwnProperty( i ) ) {
                    var tmp = temp[i].split('=');
                    _cookie._data[ tmp[0].trim() ] = decodeURIComponent( tmp[1] ) || '';
                }
            }
        }
    },
    _req: function(){
        if( !_cookie._data ) {
            _cookie._init();
        }

        return _cookie._data;
    },
    get: function( name ){
        var obj = _cookie._req();
        if( obj.hasOwnProperty( name ) ) {
            return obj[ name ];
        }

        return null;
    },
    set: function( name, value, expire_minute, path ){
        _cookie._req();
        var out = name + '=' + ( ( value ) ? encodeURIComponent( value ) : '' ) ;
        if( expire_minute ) {
            var dt = new Date();
            dt.setTime( dt.getTime() + ( expire_minute * 60 * 1000 ) );
            out += '; ' + 'expires=' + dt.toUTCString();
        }

        out += '; path=' + ( ( path ) ? path : '/' );
        _cookie._data[ name ] = value;
        document.cookie = out;
    },
    remove: function( name ) {
        var obj = _cookie._req();
        if( obj.hasOwnProperty( name ) ) {
            _cookie.set( name, '', -100 );
            delete obj[ name ];
        }
    }
};