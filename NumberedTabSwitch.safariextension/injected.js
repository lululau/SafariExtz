window.addEventListener('keypress', handleKeyPress, true);


function handleKeyPress(e) {
	if (e.altKey) { /* uses Option key */

		var charCode = String.fromCharCode(e.which);
		var number = -1;
		switch (charCode) {
			case "¡" :
				number = 1; break;
			case "™" :
				number = 2; break;
			case "£" :
				number = 3; break;
			case "¢" :
				number = 4; break;
			case "∞" :
				number = 5; break;
			case "§" :
				number = 6; break;
			case "¶" :
				number = 7; break;
			case "•" :
				number = 8; break;
			case "ª" :
				number = 9; break;
			case "º" :
				number = 10; break;
		}

		if (number != -1) {
			safari.self.tab.dispatchMessage("switch_tab", number);
		}
	}
}