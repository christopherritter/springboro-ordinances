var use_viewer = "Please use the document's viewer to navigate hits.";

function getScriptName()
{
	var path = location.pathname;
	path = path.substring(0, path.indexOf('.') + 4);
	return path;
}


function getCookie(cookie_name) 
{
	var cookie = document.cookie;
	var script_cookie_name = getScriptName() + "/" + cookie_name;
	script_cookie_name = script_cookie_name.substring(1);
	var index = cookie.indexOf(script_cookie_name + "=");
	if (-1 == index) 
	{
		return "";
	}

	index = cookie.indexOf("=", index);
	if (-1 == index)
	{
		return "";
	}

	var endstr = cookie.indexOf(";", index);
	if (-1 == endstr) 
	{
		endstr = cookie.length;
	}

	var cookie_value = unescape(cookie.substring(index + 1, endstr));
	if (cookie_value == null || cookie_value == "null" || cookie_value == "" || cookie_value.indexOf("undefined") >= 0 || cookie_value.lastIndexOf("=") == cookie_value.length - 1) 
	{
		cookie_value = "";
	}
	
	return cookie_value;
}


function doClearQuery(redirect_template)
{
	parent.window.location = location.pathname + '?f=hitlist&t=' + redirect_template + '&c=redirect&q=';
}


function getFrameWindow(frame_name)
{
	var frame_window = null;

	if(frame_name == "_self")
	{
		return window;
	}
	if (frame_name != null && frame_name.length > 0)
	{
		frame_window = parent.frames[frame_name]
	}
	else
	{
		frame_window = window;
	}

	return frame_window;
}


function doPrevNextHit(document_frame_name, prev)
{
	var doc_window = getFrameWindow(document_frame_name);

	if (!hit_tracker.isTracking(doc_window))
	{
		alert(use_viewer);
	}
	else
	{
		if (prev)
		{
			if (!hit_tracker.prevMatch(doc_window))
			{
				doPrevHitDoc(document_frame_name);
			}
		}
		else
		{
			if (!hit_tracker.nextMatch(doc_window))
			{
				doNextHitDoc(document_frame_name);
			}
		}
	}
	
	return false;
}



function doPrevHit(document_frame_name)
{
	doPrevNextHit(document_frame_name, true);
}


function doNextHit(document_frame_name)
{
	doPrevNextHit(document_frame_name, false);
}


function doPrevDoc(document_frame_name, template)
{
	var doc_window = getFrameWindow(document_frame_name);
	if (doc_window != null)
	{
		doc_window.location = getScriptName() + '?f=Prevdoc&t=' + template + '&';
	}
}


function doNextDoc(document_frame_name, template)
{
	var doc_window = getFrameWindow(document_frame_name);
	if (doc_window != null)
	{
		doc_window.location = getScriptName() + '?f=Nextdoc&t=' + template + '&';
	}
}


function doPrevHitDoc(document_frame_name)
{
	var doc_window = getFrameWindow(document_frame_name);
	if (doc_window != null)
	{
		doc_window.location = getScriptName() + '?f=hitlist&c=prev&gh=1#LPHit1';
	}
}


function doNextHitDoc(document_frame_name)
{
	var doc_window = getFrameWindow(document_frame_name);
	if (doc_window != null)
	{
		doc_window.location = getScriptName() + '?f=hitlist&c=next&gh=1#LPHit1';
	}
}


function doSynchronizeContents(contents_frame_name, contents_frame_url)
{
	var current_document = escape(getCookie("doc"));

	// whack any leading slash character
	var index = current_document.indexOf("http://www.conwaygreene.com/");
	if (index == 0)
	{
	 	current_document = current_document.substring(1);
	}
	
	var contents_window = getFrameWindow(contents_frame_name);
	if (contents_window != null)
	{
		if (contents_window.document.JTOC == null)
		{
			contents_window.location = contents_frame_url + '&cp=' + current_document + '&c=100&sync=2';
		}
		else
		{
			if(contents_window.document.JTOC != null)
			{
				contents_window.document.JTOC.syncTOC(current_document);
			}
			else if(contents_frame_url != null)
			{
				contents_window.location = contents_frame_url;
			}
		}
	}
}


function doReference(template)
{
	var ref_window = window.open(template, "Reference", "width=500,height=100,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no"); 
	if (_js_ >= 1.1)
	{
		ref_window.focus();
	}
}


function viewSearchForm(search_form_params, toc_template, no_toc_template, options)
{
	// search_form_params looks like this:
	// frame-type:search-form-id

	if (search_form_params != "#NoForm")
	{
		var delim_offset = search_form_params.indexOf(":");
		if (delim_offset != -1)
		{
			var frame_type = search_form_params.substring(0, delim_offset);
			var search_form_id = search_form_params.substring(delim_offset+1);
			var component;

			switch (frame_type)
			{
				case "contents":
					component = "?f=templates&fn=" + toc_template;
					break;

				case "no-contents":
					component = "?f=templates&fn=" + no_toc_template;
					break;

				default:
					component = "?f=searchforms";
					break;
			}
		
			parent.window.location = getScriptName() + component + "&id=" + search_form_id + "&" + options;
		}
	}
}

