// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

( function () {
	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
	for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x ) {
		window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
		window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
	}

	if ( !window.requestAnimationFrame ) {
		window.requestAnimationFrame = function ( callback, element ) {
			var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if ( !window.cancelAnimationFrame ) {
		window.cancelAnimationFrame = function ( id ) { clearTimeout( id ); };
	}
}() );


// Pressing keys fills the world with random again.
$(window).keypress(function() {
	for( var y=0; y<app.h; y++ )
	{
		for( var x=0; x<app.w; x++ )
		{
			app.a[x][y] = Math.random()>0.5;
			app.b[x][y] = Math.random()>0.5;
		}
	}
});

// init
$(document).ready(function() {
	app = {};
	app.w = 400
	app.h = 400
	app.a = [];
	app.b = [];
	for( var y=0; y<app.h; y++ )
	{
		app.a.push([]);
		app.b.push([]);
		for( var x=0; x<app.w; x++ )
		{
			app.a[y].push( Math.random()>0.5 );
			app.b[y].push( Math.random()>0.5 );
		}
	}
	app.canvas = $("#game")[0]
	app.canvas.width = app.w
	app.canvas.height = app.h
	app.ctx = app.canvas.getContext("2d");
	app.ctx.fillStyle = "black";

	app.output = $("#output")[0];
	app.startTime = (new Date).getTime();
	app.frames = 0;
	requestAnimationFrame(frame);
});

function frame() {
	requestAnimationFrame(frame);
	app.ctx.clearRect(0,0,app.w,app.h);

	// Always reading from a and writing to b.
	var t = app.a;
	app.a = app.b;
	app.b = t;

	for( var y=0; y<app.h; y++ )
	{
		for( var x=0; x<app.w; x++ )
		{
			var n = 0
			x > 0 &&       y > 0       && app.a[x-1][y-1] && n++;
			x > 0                      && app.a[x-1][y  ] && n++;
			x > 0 &&       y < app.h-1 && app.a[x-1][y+1] && n++;
			               y > 0       && app.a[x  ][y-1] && n++;
			               y < app.h-1 && app.a[x  ][y+1] && n++;
			x < app.w-1 && y > 0       && app.a[x+1][y-1] && n++;
			x < app.w-1                && app.a[x+1][y  ] && n++;
			x < app.w-1 && y < app.h-1 && app.a[x+1][y+1] && n++;
			var l = app.a[x][y];
			if( l )
			{ // live
				if( n < 2 )
					app.b[x][y] = false;
				else if( n < 4 )
					app.b[x][y] = true;
				else
					app.b[x][y] = false;
			}
			else
			{ // dead
				if( n == 3 )
					app.b[x][y] = true;
				else
					app.b[x][y] = l;
			}
		}
	}

	for( var y=0; y<app.h; y++ )
		for( var x=0; x<app.w; x++ )
			if( app.b[x][y] )
				app.ctx.fillRect(x,y,1,1);

	app.frames++;
	var elapsedTime = (new Date).getTime() - app.startTime;
	app.output.innerText = (1000*app.frames/elapsedTime*app.w*app.h)|0;
}
