(function () {
	function restoreOpenedStateFromUrl() {
		let selectedHash = location.hash.substring(1)
		if (selectedHash) {
		let hashEl = document.getElementById(selectedHash)
		if (hashEl) {
			let button = document.querySelector(`.control[data-id="${selectedHash}"]`);	
			
			document.querySelector(".active-btn").classList.remove("active-btn");
			button.classList.add("active-btn");
				document.querySelector(".active").classList.remove("active");
     	document.getElementById(selectedHash).classList.add("active");

		}
	}
	}

	function restoreThemeFromStorage() {
		let theme = localStorage.getItem('theme')
		if (!theme) { 
			localStorage.setItem('theme', 'dark'); } 
		else if (theme === 'light') {
			document.body.classList.add("light-mode");
		}
		
	}

	function restoreThemeFromURLParams() {
		let theme = localStorage.getItem('theme')
		if (!theme) localStorage.setItem('theme', 'dark')
	}
	
	function updateTheme(el=document.body) {
		var mode = el.classList.contains('light-mode');
		if (mode) {
			localStorage.setItem('theme', 'light')
		} else {
			localStorage.setItem('theme', 'dark')
		}
	}

	// Setup
	restoreThemeFromStorage();
	restoreThemeFromURLParams();
	restoreOpenedStateFromUrl();
	
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");

			location.hash = button.dataset.id;
        })
    });

	document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
		updateTheme();	
    })
})();
