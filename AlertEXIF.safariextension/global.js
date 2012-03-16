safari.application.addEventListener("command", function(e) {
  url = e.userInfo;
  BinaryAjax(
    url,
    function(oHTTP) {
      var exifdata = EXIF.EXIFString(oHTTP.binaryResponse);
      safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("show_exif", exifdata);
    }
  )
}, false);

safari.application.addEventListener("validate", function(e) {
    var contextText = e.userInfo;
    if (e.command !== "alert_exif" || contextText===undefined || contextText == "NoImage") {
        e.target.disabled = true;
      return;
    }
    if (contextText.length == 0 || !contextText) {
        e.target.disabled = true;
    }
}, false);