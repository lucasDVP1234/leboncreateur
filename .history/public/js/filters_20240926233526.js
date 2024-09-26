// public/js/filters.js

document.addEventListener('DOMContentLoaded', () => {
    
    const filterButtons = document.querySelectorAll('.filter-button');
    const ageMinInput = document.getElementById('age-min');
    const ageMaxInput = document.getElementById('age-max');

    let selectedCategories = [];
    let selectedVideoTypes = [];
    let selectedCountries = [];

    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const queries = queryString.split('&');
        queries.forEach((query) => {
            const [key, value] = query.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        return params;
    }
    
    // Initialize selected filters from URL parameters
    const params = getQueryParams();
    
    if (params.categories) {
        selectedCategories = params.categories.split(',').filter(Boolean);
    }
    if (params.videoTypes) {
        selectedVideoTypes = params.videoTypes.split(',').filter(Boolean);
    }
    if (params.countries) {
        selectedCountries = params.countries.split(',').filter(Boolean);
    }
    if (params.ageMin) {
        ageMinInput.value = params.ageMin;
    }
    if (params.ageMax) {
        ageMaxInput.value = params.ageMax;
    }
    
    // Update filter buttons' visual state based on selected filters
    filterButtons.forEach((button) => {
        const filterValue = button.getAttribute('data-filter');
        const filterType = button.getAttribute('data-filter-type');
    
        if ((filterType === 'Category' && selectedCategories.includes(filterValue)) ||
            (filterType === 'Type of Videos' && selectedVideoTypes.includes(filterValue)) ||
            (filterType === 'Country' && selectedCountries.includes(filterValue))) {
            button.classList.add('active', 'ring-2', 'ring-offset-2', 'ring-blue-300');
        }
    });

    // Event listener for filter buttons
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Toggle 'active' state
            button.classList.toggle('active');

            // Visual feedback for active state
            if (button.classList.contains('active')) {
                button.classList.add('ring-2', 'ring-offset-2', 'ring-blue-300');
            } else {
                button.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-300');
            }

            // Get filter value and type
            const filterValue = button.getAttribute('data-filter');
            const filterType = button.getAttribute('data-filter-type'); // Use filterType

            // Update the appropriate selected filters array based on filter type
            if (button.classList.contains('active')) {
                if (filterType === 'Category') {
                    if (!selectedCategories.includes(filterValue)) {
                        selectedCategories.push(filterValue);
                    }
                } else if (filterType === 'Type of Videos') {
                    if (!selectedVideoTypes.includes(filterValue)) {
                        selectedVideoTypes.push(filterValue);
                    }
                } else if (filterType === 'Country') {
                    if (!selectedCountries.includes(filterValue)) {
                        selectedCountries.push(filterValue);
                    }
                }
            } else {
                if (filterType === 'Category') {
                    selectedCategories = selectedCategories.filter(item => item !== filterValue);
                } else if (filterType === 'Type of Videos') {
                    selectedVideoTypes = selectedVideoTypes.filter(item => item !== filterValue);
                } else if (filterType === 'Country') {
                    selectedCountries = selectedCountries.filter(item => item !== filterValue);
                }
            }
        });
    });

    // Before form submission, populate hidden inputs
    const filterForm = document.querySelector('form[action="/creators"]');
    filterForm.addEventListener('submit', () => {
        document.getElementById('selected-categories').value = selectedCategories.join(',');
        document.getElementById('selected-video-types').value = selectedVideoTypes.join(',');
        document.getElementById('selected-countries-input').value = selectedCountries.join(',');
        document.getElementById('selected-age-min').value = ageMinInput.value;
        document.getElementById('selected-age-max').value = ageMaxInput.value;
        // Age inputs are submitted directly via name attributes
    });
});
