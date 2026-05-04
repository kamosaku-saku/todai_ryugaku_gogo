document.addEventListener("DOMContentLoaded", function () {
	setupMobileNavigation();
	setupEventFilter();
	setupAboutAccordion();
    setupScrollReveal();
	setupLanguageSwitcher();
});


/* =========================================================
   1. Mobile navigation menu
   ========================================================= */

function setupMobileNavigation() {
	const menuButton = document.querySelector(".menu-toggle");
	const navList = document.querySelector(".nav-list");

	if (!menuButton || !navList) {
		return;
	}

	navList.id = "main-navigation-list";
	menuButton.setAttribute("aria-controls", "main-navigation-list");
	menuButton.setAttribute("aria-expanded", "false");

	menuButton.addEventListener("click", function () {
		const menuIsOpen = navList.classList.toggle("is-open");

		menuButton.setAttribute("aria-expanded", menuIsOpen);

		if (menuIsOpen) {
			const currentLanguage = localStorage.getItem("preferredLanguage") || "en";
			menuButton.textContent = currentLanguage === "jp" ? "閉じる" : "Close";
		} else {
			const currentLanguage = localStorage.getItem("preferredLanguage") || "en";
			menuButton.textContent = currentLanguage === "jp" ? "メニュー" : "Menu";
		}
	});
}


/* =========================================================
   2. Event filtering on events.html
   ========================================================= */

function setupEventFilter() {
	const eventsPage = document.querySelector(".page-events");
	const eventHighlights = document.querySelector(".event-highlights");

	if (!eventsPage || !eventHighlights) {
		return;
	}

	if (eventHighlights.querySelector(".event-filter")) {
		return;
	}

	const filterContainer = document.createElement("div");
	filterContainer.classList.add("event-filter");
	filterContainer.setAttribute("aria-label", "Jump to event month");

	const months = [
		{ en: "May", jp: "5月", target: "may" },
		{ en: "July", jp: "7月", target: "july" },
		{ en: "September", jp: "9月", target: "september" },
		{ en: "October", jp: "10月", target: "october" }
	];

	months.forEach(function (month) {
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = month.en;
		button.dataset.en = month.en;
		button.dataset.jp = month.jp;

		button.addEventListener("click", function () {
			const targetSection = document.getElementById(month.target);

			if (targetSection) {
				targetSection.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}
		});

		filterContainer.appendChild(button);
	});

	const heading = eventHighlights.querySelector("h2");

	if (heading) {
		heading.insertAdjacentElement("afterend", filterContainer);
	}
}

/* =========================================================
   3. Accordion on about.html
   ========================================================= */

function setupAboutAccordion() {
	const aboutPage = document.querySelector(".page-about");

	if (!aboutPage) {
		return;
	}

	const sections = aboutPage.querySelectorAll("main > .content-section");

	sections.forEach(function (section, index) {
		const heading = section.querySelector("h2");

		if (!heading || heading.querySelector(".accordion-button")) {
			return;
		}

		const panelId = "about-panel-" + index;

		const button = document.createElement("button");
		button.type = "button";
		button.classList.add("accordion-button");
		button.setAttribute("aria-expanded", "true");
		button.setAttribute("aria-controls", panelId);

		button.textContent = heading.textContent;

		if (heading.dataset.en && heading.dataset.jp) {
			button.dataset.en = heading.dataset.en;
			button.dataset.jp = heading.dataset.jp;
			heading.removeAttribute("data-en");
			heading.removeAttribute("data-jp");
		}

		const panel = document.createElement("div");
		panel.classList.add("accordion-panel");
		panel.id = panelId;

		while (heading.nextSibling) {
			panel.appendChild(heading.nextSibling);
		}

		heading.textContent = "";
		heading.appendChild(button);
		section.appendChild(panel);

		button.addEventListener("click", function () {
			const isOpen = button.getAttribute("aria-expanded") === "true";

			button.setAttribute("aria-expanded", String(!isOpen));
			panel.hidden = isOpen;
		});
	});
}



/* =========================================================
   4. Scroll reveal animation
   ========================================================= */

function setupScrollReveal() {
	const revealElements = document.querySelectorAll(
		".content-section, .service-card, .event-card, .sns-card"
	);

	if (revealElements.length === 0) {
		return;
	}

	revealElements.forEach(function (element) {
		element.classList.add("reveal");
	});

	const observer = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
				}
			});
		},
		{
			threshold: 0.15
		}
	);

	revealElements.forEach(function (element) {
		observer.observe(element);
	});
}


/* =========================================================
   5. Language switcher
   ========================================================= */

function setupLanguageSwitcher() {
	const languageButtons = document.querySelectorAll(".language-button");
	const translatableElements = document.querySelectorAll("[data-en][data-jp]");
	const translatableImages = document.querySelectorAll("[data-en-src][data-jp-src]");

	if (languageButtons.length === 0) {
		return;
	}

	languageButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			const selectedLanguage = button.dataset.lang;

			translatableElements.forEach(function (element) {
				if (selectedLanguage === "jp") {
					element.innerHTML = element.dataset.jp;
				} else {
					element.innerHTML = element.dataset.en;
				}
			});

			translatableImages.forEach(function (img) {
				if (selectedLanguage === "jp") {
					img.src = img.dataset.jpSrc;
				} else {
					img.src = img.dataset.enSrc;
				}
			});

			languageButtons.forEach(btn => btn.classList.remove("active-language"));
			button.classList.add("active-language");

			document.documentElement.lang = selectedLanguage === "jp" ? "ja" : "en";
			localStorage.setItem("preferredLanguage", selectedLanguage);
		});
	});

	const savedLanguage = localStorage.getItem("preferredLanguage");

	if (savedLanguage) {
		const savedButton = document.querySelector(
			`.language-button[data-lang="${savedLanguage}"]`
		);

		if (savedButton) {
			savedButton.click();
		}
	}
}