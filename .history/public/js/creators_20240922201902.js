// public/js/creators.js

document.addEventListener('DOMContentLoaded', function() {
    const ageFilter = document.getElementById('age-filter');
    const categoryFilter = document.getElementById('category-filter');
    const typeFilter = document.getElementById('type-filter');
    const creatorCards = document.querySelectorAll('.creator-card');

    function filterCreators() {
        const ageValue = ageFilter.value;
        const categoryValue = categoryFilter.value.toLowerCase();
        const typeValue = typeFilter.value.toLowerCase();

        creatorCards.forEach(function(card) {
            let displayCard = true;

            // Age Filter
            const creatorAge = parseInt(card.getAttribute('data-age'));
            if (ageValue) {
                if (ageValue === '18-25' && (creatorAge < 18 || creatorAge > 25)) {
                    displayCard = false;
                } else if (ageValue === '26-35' && (creatorAge < 26 || creatorAge > 35)) {
                    displayCard = false;
                } else if (ageValue === '36+' && creatorAge < 36) {
                    displayCard = false;
                }
            }

            // Category Filter
            const creatorCategory = card.getAttribute('data-category').toLowerCase();
            if (categoryValue && categoryValue !== creatorCategory) {
                displayCard = false;
            }

            // Type Filter
            const creatorTypes = card.getAttribute('data-video-types').toLowerCase().split(',').map(s => s.trim());
            if (typeValue && !creatorTypes.includes(typeValue)) {
                displayCard = false;
            }

            // Show or hide the card
            card.style.display = displayCard ? 'block' : 'none';
        });
    }

    // Add event listeners to filters
    ageFilter.addEventListener('change', filterCreators);
    categoryFilter.addEventListener('change', filterCreators);
    typeFilter.addEventListener('change', filterCreators);
});
