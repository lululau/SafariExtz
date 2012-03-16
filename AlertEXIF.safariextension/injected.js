document.addEventListener("contextmenu", contextMessage, false);

function contextMessage(e) {
	var title = 'NoImage';
	if (e.target.src.match(/jpe?g/i)){
		title = e.target.src;
	}
	safari.self.tab.setContextMenuEventUserInfo(e, title);
}

safari.self.addEventListener("message", function(e) {
	if (window.top != window) {
		return;
	}
	if (e.name === 'show_exif') {
		alert(e.message);
	}
	return false;
}, false);

