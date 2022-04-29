(function () {
	var selectedHash = location.hash.substring(1)
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
    })
})();
