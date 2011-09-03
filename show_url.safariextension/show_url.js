var anchors = document.getElementsByTagName("a");

var base_url = location.href;
var idx = base_url.indexOf("/", 7);
base_url = base_url.substr(0, idx);

var div = document.createElement("div");
div.id = "show_url_div";
div.innerHTML = "<span id='show_url_span'></span>";
document.body.insertBefore(div, document.body.firstChild);

var mouse_over = function(event) {
    var url = event.target;
    while (null == url.nodeName.match(/^a$/i)) {
	if (url.nodeName.match(/^body$/i)) {	    
	    return;
	}
	url = url.parentElement;	
    }

    var href = url.getAttribute("href");

    if (href.match(/^\//)) {
	href = base_url + href;
    } else if (! href.match(/^http:\/\//)) {
	href = location.href + "/" + href;
    }

    div.innerHTML = "<span id='show_url_span'>" + href + "</span>";
    div.style.display = "block";
};

var mouse_out = function(event) {
    div.style.display = "none";
};

for (var i = 0 ; i < anchors.length; i++) {
    anchors[i].addEventListener("mouseover", mouse_over, false);
    anchors[i].addEventListener("mouseout", mouse_out, false);
}