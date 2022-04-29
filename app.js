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
			localStorage.setItem('theme', 'dark'); 
		} else if (theme === 'light') {
			document.body.classList.add("light-mode");
		} else {
			document.body.classList.remove("light-mode");
		}	
	}

	function restoreThemeFromURLParams() {
		let search = new URLSearchParams(location.search)
		if (search.has('theme')) {
			let theme = search.get('theme')
			if (theme === 'light') {
				document.body.classList.add("light-mode");
			} else {
				document.body.classList.remove("light-mode");
				search.set('theme', 'dark');
				location.search = search.toString();
			}
		}
	}
	
	function updateTheme(el=document.body) {
		let search = new URLSearchParams(location.search);
		var mode = el.classList.contains('light-mode');
		if (mode) {
			search.set('theme', 'light')
			localStorage.setItem('theme', 'light')
		} else {
			search.set('theme', 'dark')
			localStorage.setItem('theme', 'dark')
		}
		location.search = search.toString();
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
