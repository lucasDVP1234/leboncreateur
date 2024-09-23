// public/js/creators.js

function applyFilters() {
    const ageFilter = document.getElementById('age-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const typeFilter = document.getElementById('type-filter').value;

    const creators = document.querySelectorAll('.creator-card');

    creators.forEach(creator => {
        const age = parseInt(creator.getAttribute('data-age'));
        const category = creator.getAttribute('data-category');
        const videoTypes = creator.getAttribute('data-video-types').split(',');

        let isVisible = true;

        // Apply age filter
        if (ageFilter) {
            if (ageFilter === '18-25' && !(age >= 18 && age <= 25)) {
                isVisible = false;
            } else if (ageFilter === '26-35' && !(age >= 26 && age <= 35)) {
                isVisible = false;
            } else if (ageFilter === '36+' && age < 36) {
                isVisible = false;
            }
        }

        // Apply category filter
        if (categoryFilter && categoryFilter !== category) {
            isVisible = false;
        }

        // Apply video type filter
        if (typeFilter && !videoTypes.includes(typeFilter)) {
            isVisible = false;
        }

        // Show or hide creator card
        creator.style.display = isVisible ? 'block' : 'none';
    });
}
