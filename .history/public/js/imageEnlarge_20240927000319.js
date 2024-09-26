document.addEventListener('DOMContentLoaded', () => {
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    const imageOverlay = document.getElementById('image-overlay');
    const enlargedImage = document.getElementById('enlarged-image');

    portfolioImages.forEach((img) => {
        img.addEventListener('mouseenter', () => {
            const imageUrl = img.getAttribute('data-image-url');
            enlargedImage.src = imageUrl;
            imageOverlay.classList.remove('hidden');
        });

        img.addEventListener('mouseleave', () => {
            // Hide the overlay when the mouse leaves the image or overlay
            imageOverlay.classList.add('hidden');
        });
    });

    // Also hide the overlay if the mouse leaves the overlay area
    imageOverlay.addEventListener('mouseleave', () => {
        imageOverlay.classList.add('hidden');
    });

    // Optional: Hide the overlay when clicked
    imageOverlay.addEventListener('click', () => {
        imageOverlay.classList.add('hidden');
    });
});
