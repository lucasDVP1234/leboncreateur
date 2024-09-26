// public/js/filters.js

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const ageMinInput = document.getElementById('age-min');
    const ageMaxInput = document.getElementById('age-max');
    

    let selectedCategories = [];
    let selectedVideoTypes = [];
    let selectedCountries = [];

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
            //const filterType = button.getAttribute('data-filter-type');

            if (button.classList.contains('active')) {
                if (!selectedCategories.includes(filterValue)) {
                    selectedCategories.push(filterValue);
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
        // Age inputs are submitted directly via name attributes
    });
});
