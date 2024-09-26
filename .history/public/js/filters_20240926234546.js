document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const ageMinInput = document.getElementById('age-min');
    const ageMaxInput = document.getElementById('age-max');
    const selectedFiltersContainer = document.getElementById('selected-filters-container');

    let selectedCategories = [];
    let selectedVideoTypes = [];
    let selectedCountries = [];
    let selectedAgeMin = '';
    let selectedAgeMax = '';

    // Function to update selected filters display
    function updateSelectedFiltersDisplay() {
        selectedFiltersContainer.innerHTML = '';

        // Display selected categories
        selectedCategories.forEach((category) => {
            const bubble = createFilterBubble(category, 'Category');
            selectedFiltersContainer.appendChild(bubble);
        });

        // Display selected video types
        selectedVideoTypes.forEach((type) => {
            const bubble = createFilterBubble(type, 'Type of Videos');
            selectedFiltersContainer.appendChild(bubble);
        });

        // Display selected countries
        selectedCountries.forEach((country) => {
            const bubble = createFilterBubble(country, 'Country');
            selectedFiltersContainer.appendChild(bubble);
        });

        // Display age range if set
        if (selectedAgeMin || selectedAgeMax) {
            let ageText = 'Age: ';
            if (selectedAgeMin && selectedAgeMax) {
                ageText += `${selectedAgeMin} - ${selectedAgeMax}`;
            } else if (selectedAgeMin) {
                ageText += `From ${selectedAgeMin}`;
            } else if (selectedAgeMax) {
                ageText += `Up to ${selectedAgeMax}`;
            }
            const bubble = createFilterBubble(ageText, 'Age');
            selectedFiltersContainer.appendChild(bubble);
        }
    }

    // Function to create a filter bubble element
    function createFilterBubble(value, type) {
        const bubble = document.createElement('div');
        bubble.className = 'flex items-center px-3 py-1 bg-blue-500 text-white rounded-full text-sm';

        const span = document.createElement('span');
        span.textContent = value;

        const removeButton = document.createElement('button');
        removeButton.className = 'ml-2 focus:outline-none';
        removeButton.innerHTML = '&times;';
        removeButton.addEventListener('click', () => {
            removeFilter(value, type);
        });

        bubble.appendChild(span);
        bubble.appendChild(removeButton);

        return bubble;
    }

    // Function to remove a filter
    function removeFilter(value, type) {
        if (type === 'Category') {
            selectedCategories = selectedCategories.filter(item => item !== value);
            // Deselect the button
            const button = document.querySelector(`.filter-button[data-filter="${value}"][data-filter-type="Category"]`);
            if (button) button.click();
        } else if (type === 'Type of Videos') {
            selectedVideoTypes = selectedVideoTypes.filter(item => item !== value);
            const button = document.querySelector(`.filter-button[data-filter="${value}"][data-filter-type="Type of Videos"]`);
            if (button) button.click();
        } else if (type === 'Country') {
            selectedCountries = selectedCountries.filter(item => item !== value);
            const button = document.querySelector(`.filter-button[data-filter="${value}"][data-filter-type="Country"]`);
            if (button) button.click();
        } else if (type === 'Age') {
            selectedAgeMin = '';
            selectedAgeMax = '';
            ageMinInput.value = '';
            ageMaxInput.value = '';
        }

        updateSelectedFiltersDisplay();
        // Optionally, submit the form automatically to update results
        // document.querySelector('form[action="/creators"]').submit();
    }

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
            const filterType = button.getAttribute('data-filter-type');

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

            updateSelectedFiltersDisplay();
        });
    });

    // Event listeners for age inputs
    ageMinInput.addEventListener('change', () => {
        selectedAgeMin = ageMinInput.value;
        updateSelectedFiltersDisplay();
    });

    ageMaxInput.addEventListener('change', () => {
        selectedAgeMax = ageMaxInput.value;
        updateSelectedFiltersDisplay();
    });

    // Before form submission, populate hidden inputs
    const filterForm = document.querySelector('form[action="/creators"]');
    filterForm.addEventListener('submit', () => {
        document.getElementById('selected-categories').value = selectedCategories.join(',');
        document.getElementById('selected-video-types').value = selectedVideoTypes.join(',');
        document.getElementById('selected-countries-input').value = selectedCountries.join(',');
        document.getElementById('selected-age-min').value = selectedAgeMin;
        document.getElementById('selected-age-max').value = selectedAgeMax;
    });

    // Initialize selected filters if any (from URL parameters)
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
        selectedAgeMin = params.ageMin;
        ageMinInput.value = selectedAgeMin;
    }
    if (params.ageMax) {
        selectedAgeMax = params.ageMax;
        ageMaxInput.value = selectedAgeMax;
    }

    // Update button states based on selected filters
    filterButtons.forEach((button) => {
        const filterValue = button.getAttribute('data-filter');
        const filterType = button.getAttribute('data-filter-type');

        if ((filterType === 'Category' && selectedCategories.includes(filterValue)) ||
            (filterType === 'Type of Videos' && selectedVideoTypes.includes(filterValue)) ||
            (filterType === 'Country' && selectedCountries.includes(filterValue))) {
            button.classList.add('active', 'ring-2', 'ring-offset-2', 'ring-blue-300');
        }
    });

    // Display selected filters on page load
    updateSelectedFiltersDisplay();
});
