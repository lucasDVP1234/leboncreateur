// public/js/filters.js

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const ageMinInput = document.getElementById('age-min');
    const ageMaxInput = document.getElementById('age-max');
    let selectedCategories = [];
    let selectedVideoTypes = [];
    let selectedCountries = [];
  
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Toggle 'active' state
            button.classList.toggle('active');
    
            // Visual feedback for active state
            if (button.classList.contains('active')) {
                button.classList.add('ring-2', 'ring-offset-2', 'ring-blue-300');
                button.classList.remove('opacity-50');
            } else {
                button.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-300');
                //button.classList.add('opacity-50');
            }
    
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
    
            // Determine filter type based on parent heading
            const filterType = button.closest('div').querySelector('h3').textContent.trim();
    
            if (button.classList.contains('active')) {
                if (filterType.includes('Category')) {
                    if (!selectedCategories.includes(filterValue)) {
                        selectedCategories.push(filterValue);
                    }
                } else if (filterType.includes('Type of Videos')) {
                    if (!selectedVideoTypes.includes(filterValue)) {
                        selectedVideoTypes.push(filterValue);
                    }
                } else if (filterType === 'Country') {
                    if (!selectedCountries.includes(filterValue)) {
                        selectedCountries.push(filterValue);
                    }
                }
                
            } else {
                if (filterType.includes('Category')) {
                    selectedCategories = selectedCategories.filter(item => item !== filterValue);
                } else if (filterType.includes('Type of Videos')) {
                    selectedVideoTypes = selectedVideoTypes.filter(item => item !== filterValue);
                }
            }
            });
 
        

        // public/js/filters.js
  
    // Country Selector Logic
            const countrySearchInput = document.getElementById('country-search');
            const countryListDiv = document.getElementById('country-list');
            const selectedCountriesDiv = document.getElementById('selected-countries');
        
            // Example list of countries (You can replace this with a full list or fetch from an API)
            const countries = [
            'United States', 'Canada', 'United Kingdom', 'Australia', 'France',
            'Germany', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil'
            // Add more countries as needed
            ];
        
            let filteredCountries = countries;
            let selectedCountries = [];
        
            // Function to display countries
            function displayCountryList() {
            countryListDiv.innerHTML = '';
            filteredCountries.forEach(country => {
                const countryOption = document.createElement('div');
                countryOption.className = 'country-option px-2 py-1 hover:bg-gray-100 cursor-pointer';
                countryOption.textContent = country;
                countryOption.setAttribute('data-country', country);
        
                countryOption.addEventListener('click', () => {
                if (!selectedCountries.includes(country)) {
                    selectedCountries.push(country);
                    updateSelectedCountries();
                }
                });
        
                countryListDiv.appendChild(countryOption);
            });
            }
        
            // Function to update selected countries display
            function updateSelectedCountries() {
            selectedCountriesDiv.innerHTML = '';
            selectedCountries.forEach(country => {
                const countryTag = document.createElement('div');
                countryTag.className = 'flex items-center px-2 py-1 bg-blue-500 text-white rounded-full text-sm';
                countryTag.textContent = country;
        
                const removeButton = document.createElement('button');
                removeButton.className = 'ml-2 focus:outline-none';
                removeButton.innerHTML = '&times;';
                removeButton.addEventListener('click', () => {
                selectedCountries = selectedCountries.filter(c => c !== country);
                updateSelectedCountries();
                });
        
                countryTag.appendChild(removeButton);
                selectedCountriesDiv.appendChild(countryTag);
            });
            }
        
            // Search functionality
            countrySearchInput.addEventListener('input', () => {
            const searchTerm = countrySearchInput.value.toLowerCase();
            filteredCountries = countries.filter(country => country.toLowerCase().includes(searchTerm));
            displayCountryList();
            });
        
            // Initial display
            displayCountryList();
  });
  
        // Here you can add logic to filter the creators based on selected filters
       
        const filterForm = document.querySelector('form[action="/creators"]');
        filterForm.addEventListener('submit', () => {
            document.getElementById('selected-categories').value = selectedCategories.join(',');
            document.getElementById('selected-video-types').value = selectedVideoTypes.join(',');
            document.getElementById('selected-countries-input').value = selectedCountries.join(',');
        });
    });

  