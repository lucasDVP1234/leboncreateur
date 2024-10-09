document.addEventListener("DOMContentLoaded", () => {
    console.log("textchange.js loaded and DOMContentLoaded fired.");
    const dynamicText = document.getElementById("dynamic-text");
    console.log("dynamicText element:", dynamicText);
    const phrases = ["votre e-commerce", "votre startup", "votre application","générer vos leads", "votre entreprise"];
    let currentPhraseIndex = 0;
    const intervalTime = 3000; // 3 seconds

    function changePhrase() {
        
        // Add exit classes
        dynamicText.classList.add("fade-down-exit");
        

        // Force reflow to ensure the browser recognizes the class addition
        void dynamicText.offsetWidth;

        // Add exit-active class to trigger the transition
        dynamicText.classList.add("fade-down-exit-active");
        

        // Listen for the end of the exit transition
        dynamicText.addEventListener("transitionend", handleTransitionEnd);
    }

    function handleTransitionEnd(event) {
        
        // Remove exit classes
        dynamicText.classList.remove("fade-down-exit", "fade-down-exit-active");
        dynamicText.removeEventListener("transitionend", handleTransitionEnd);
        

        // Update the text content
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        dynamicText.textContent = phrases[currentPhraseIndex];
        

        // Add enter classes
        dynamicText.classList.add("fade-down-enter");
        

        // Force reflow to allow the transition to trigger
        void dynamicText.offsetWidth;

        // Add enter-active class to trigger the transition
        dynamicText.classList.add("fade-down-enter-active");
        

        // Listen for the end of the enter transition to clean up classes
        dynamicText.addEventListener("transitionend", handleEnterTransitionEnd);
    }

    function handleEnterTransitionEnd(event) {
        
        // Remove enter classes
        dynamicText.classList.remove("fade-down-enter", "fade-down-enter-active");
        dynamicText.removeEventListener("transitionend", handleEnterTransitionEnd);
        
    }

    // Initial interval to change phrases
    setInterval(changePhrase, intervalTime);
});
