// Hit Tracker - object for moving between hit anchors in a document
//
// Features:
// 		* No FolioHitCount form is needed.
//		* First hit doesn't have to be LPHit1.
//		* Detects some binary documents.
//		* Works around IE 5.5 bug changing location.hash in XML.


// constants
var hit_prefix = "LPHit";


// constructor
function HitTracker(document_window)
{
	// catch errors
	onerror = HitTracker_handleError;
	
	// public
	this.prevMatch = HitTracker_prevMatch;		// Move to previous match. Returns false if at first.
	this.nextMatch = HitTracker_nextMatch;		// Move to next match. Returns false if at last.
	this.isTracking = HitTracker_isTracking;	// Able to track hits on this document?
	
	// private
	this.construct = HitTracker_construct;
	this.checkState = HitTracker_checkState;
	this.moveToAnchor = HitTracker_moveToAnchor;

	this.document_window = null;
	this.document_object = null;
	this.first_match = null;
	this.current_match = null;
	this.total_matches = null;
	this.total_anchors = null;
}


// public methods

function HitTracker_prevMatch(document_window)
{
	var ok = false;
	
	this.checkState(document_window);
	
	if (this.document_object != null)
	{
		if (this.current_match -1 >= this.first_match)
		{
			this.moveToAnchor(hit_prefix + (--this.current_match));
			ok = true;
		}
	}
	
	return ok;
}


function HitTracker_nextMatch(document_window)
{
	var ok = false;

	this.checkState(document_window);
	
	if (this.document_object != null)
	{
		if (this.current_match +1 <= this.total_matches)
		{
			this.moveToAnchor(hit_prefix + (++this.current_match));
			ok = true;
		}
	}
	
	return ok;
}


function HitTracker_isTracking(document_window)
{
	// Is this a document that the browser renders natively, or is a 
	// plug-in/activex involved? If this is a non-native document, we
	// can't do anything about navigating hits.
	this.checkState(document_window);
	return this.document_object != null;
}



// private methods

function HitTracker_construct(document_window)
{
	this.document_window = document_window;
	this.document_object = document_window.document;
	this.first_match = HitTracker_getFirstMatch(document_window.document);
	this.current_match = this.first_match;
	this.total_matches = HitTracker_getTotalMatches(document_window.document) - (this.first_match - 1);
	this.total_anchors = document_window.document.anchors.length;
	
// alert("Construct: first=" + this.first_match + " current=" + this.current_match + " total=" + this.total_matches);	
}


function HitTracker_checkState(document_window)
{
	if (HitTracker_isTrackableDocument(document_window))
	{
		if (document_window != this.document_window || document_window.document != this.document_object)
		{
			this.construct(document_window);
		}
		else if (this.total_anchors != document_window.document.anchors.length)
		{
			// in case they moved to a different match before the document finished loading
			this.total_matches = HitTracker_getTotalMatches(document_window.document) - (this.first_match - 1);
			this.total_anchors = document_window.document.anchors.length;
		}
	}
	else
	{
		this.document_object = null;
	}
}


function HitTracker_moveToAnchor(anchor)
{
	this.document_window.location.hash = anchor;
	if (this.document_window.location.hash != anchor)
	{
		// work around IE 5.5 bug
		if (-1 != navigator.appVersion.indexOf("MSIE 5.5"))
		{
			for (var a = 0; a < this.document_window.document.anchors.length; a++)
			{
				if (this.document_window.document.anchors[a].name == anchor)
				{
					this.document_window.document.anchors[a].scrollIntoView();
					break;
				}
			}
		}
	}
}



// static methods

function HitTracker_getFirstMatch(document_object)
{
	var first_match = 1;
	
	for (var a = 0; a < document_object.anchors.length; a++)
	{
		if (document_object.anchors[a].name.substring(0, hit_prefix.length) == hit_prefix)
		{
			first_match = parseInt(document_object.anchors[a].name.substring(hit_prefix.length));
			break;
		}
	}
	
	return first_match;
}


function HitTracker_getTotalMatches(document_object)
{
	var total_matches = 0;
	
	for (var a = 0; a < document_object.anchors.length; a++)
	{
		if (document_object.anchors[a].name.substring(0, hit_prefix.length) == hit_prefix)
		{
			total_matches++;
		}
	}
	
	return total_matches;
}


function HitTracker_isTrackableDocument(document_window)
{
	// Windows containing MS Office documents do not have a window.document property. Any
	// attempt to reference it or detect its presence will result in a JavaScript runtime
	// error. So we'll do our best to detect it.

	var doc_ok = true;

	// try to determine if this is an office document by checking the file extension
	var path = document_window.location.pathname;
	var ext_index = path.lastIndexOf(".");
	if (ext_index != -1)
	{
		var ext = path.substring(ext_index);
		if (ext == ".doc" || ext == ".pdf" || ext == ".xls" || ext == ".ppt")
		{
			doc_ok = false;
		}
	}
	
	return doc_ok;
}


function HitTracker_handleError(message, url, line) 
{ 
	alert("Error: " + message + "\nLocation: " + url + "\nLine: " + line); 
	return true; 
} 


  