document.addEventListener('DOMContentLoaded', () => {
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    const imageOverlay = document.getElementById('image-overlay');
    const enlargedImage = document.getElementById('enlarged-image');

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    portfolioImages.forEach((img) => {
        if (isTouchDevice) {
            // Use click events on touch devices
            img.addEventListener('click', () => {
                const imageUrl = img.getAttribute('data-image-url');
                enlargedImage.src = imageUrl;
                imageOverlay.classList.remove('hidden');
            });
        } else {
            // Use hover events on non-touch devices
            img.addEventListener('mouseenter', () => {
                const imageUrl = img.getAttribute('data-image-url');
                enlargedImage.src = imageUrl;
                imageOverlay.classList.remove('hidden');
            });

            img.addEventListener('mouseleave', () => {
                imageOverlay.classList.add('hidden');
            });
        }
    });

    // Hide the overlay when clicked or touch ends
    imageOverlay.addEventListener('click', () => {
        imageOverlay.classList.add('hidden');
    });
});
