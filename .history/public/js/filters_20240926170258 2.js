document.addEventListener('DOMContentLoaded', () => {
    const creatorCheckboxes = document.querySelectorAll('.creator-select');
    const finalizeButton = document.getElementById('finalize-campaign-button');
  
    let selectedCreators = new Set();
  
    creatorCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const creatorCard = checkbox.closest('.creator-card');
        const creatorId = creatorCard.getAttribute('data-creator-id');
  
        if (checkbox.checked) {
          selectedCreators.add(creatorId);
          // Highlight selected card
          creatorCard.classList.add('border-2', 'border-blue-500');
        } else {
          selectedCreators.delete(creatorId);
          creatorCard.classList.remove('border-2', 'border-blue-500');
        }
  
        // Show or hide the finalize button
        if (selectedCreators.size > 0) {
          finalizeButton.classList.remove('hidden');
        } else {
          finalizeButton.classList.add('hidden');
        }
      });
    });
  
    // Handle click on the finalize button
    finalizeButton.addEventListener('click', () => {
      // Convert the set to an array
      const selectedIds = Array.from(selectedCreators);
      
      // Redirect to a new page with selected IDs as query parameters (example)
      window.location.href = /finalize?creators=${selectedIds.join(',')};
    });
});
  