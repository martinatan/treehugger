window.addEventListener('load', (event) => {
    // event listeners for opening overlays
    document.getElementById("view-perf-link").addEventListener("click", openPerformance);
    document.getElementById("view-perf-link").addEventListener("keyup", e => {
        if (e.code === 'Space') {
            openPerformance();
        }
    });
    document.getElementById("about-link").addEventListener("click", openAbout);
    document.getElementById("about-link").addEventListener("keyup", e => {
        if (e.code === 'Space') {
            openAbout();
        }
    });

    // event listeners for closing overlays
    document.getElementById("performance-overlay").addEventListener("click", closeOverlay);
    document.getElementById("about-overlay").addEventListener("click", closeOverlay);

    document.getElementById("performance-overlay").addEventListener("keyup", e => {
        if (e.code === 'Space') {
            closeOverlay();
        }
    });
    document.getElementById("about-overlay").addEventListener("keyup", e => {
        if (e.code === 'Space') {
            closeOverlay();
        }
    });

});

//open Performance overlay
function openPerformance() {
    console.log("openPerformance");
    hideMainText();

    var overlay = document.getElementById("performance-overlay");
    overlay.style.display = "block";
}

//open About overlay
function openAbout() {
    console.log("openAbout");
    hideMainText();

    var overlay = document.getElementById("about-overlay");
    overlay.style.display = "block";
}

//event listener to close overlays and show main text
function closeOverlay() {
    console.log("closeOverlay");

    var perfOverlay = document.getElementById("performance-overlay");
    var aboutOverlay = document.getElementById("about-overlay");

    perfOverlay.style.display = "none";
    aboutOverlay.style.display = "none";

    showMainText();
}

//helper function to disappear text on main view
function hideMainText() {
    console.log("hideMainText");

    var mainText = document.getElementById("menu");
    mainText.style.display = "none";

    var mainInstructions = document.getElementById("instructions");
    mainInstructions.style.display = "none";
}

//helper function to reappear text on main view
function showMainText() {
    console.log("showMainText");

    var mainText = document.getElementById("menu");
    mainText.style.display = "block";

    var mainInstructions = document.getElementById("instructions");
    mainInstructions.style.display = "block";
}
