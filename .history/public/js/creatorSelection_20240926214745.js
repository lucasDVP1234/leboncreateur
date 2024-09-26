// public/js/creatorSelection.js

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('DOMContentLoaded', () => {
    const creatorCards = document.querySelectorAll('.creator-card');
    const finalizeButton = document.getElementById('finalize-campaign-button');
    const form = document.querySelector('form[action="/campaigns/select"]');

    let selectedCreators = new Set();

    creatorCards.forEach((card) => {
        card.addEventListener('click', () => {
            const creatorId = card.getAttribute('data-creator-id');

            if (selectedCreators.has(creatorId)) {
                // Deselect creator
                selectedCreators.delete(creatorId);
                card.classList.remove('ring-2', 'ring-blue-500');
                // Remove hidden input
                const input = form.querySelector(`input[type="hidden"][value="${creatorId}"]`);
                if (input) {
                    input.remove();
                }
            } else {
                // Select creator
                selectedCreators.add(creatorId);
                card.classList.add('ring-2', 'ring-blue-500');
                // Add hidden input
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'creatorIds';
                input.value = creatorId;
                form.appendChild(input);
            }

            // Show or hide the finalize button
            if (selectedCreators.size > 0) {
                finalizeButton.classList.remove('hidden');
            } else {
                finalizeButton.classList.add('hidden');
            }
        });
    });
});
  
    // Handle click on the finalize button
    finalizeButton.addEventListener('click', () => {
      // Convert the set to an array
      const selectedIds = Array.from(selectedCreators);
      
      // Redirect to a new page with selected IDs as query parameters (example)
      window.location.href = `/finalize?creators=${selectedIds.join(',')}`;
    });
  });
  