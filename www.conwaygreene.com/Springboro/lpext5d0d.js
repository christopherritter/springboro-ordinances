var NN4 = (document.layers) ? true : false;
var w = window.outerWidth;
var h = window.outerHeight;

function restore() 
{ 
	//alert("restore");
	if(window.outerWidth != w || window.outerHeight != h)
	{
		window.location = window.location;
	}
} 

if(NN4)
{
	window.captureEvents(Event.RESIZE);
	window.onResize = restore;
}
