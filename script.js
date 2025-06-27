// --- script.js v0.2 --- Client-Server Communication ---

document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze-button');
    const reviewsInput = document.getElementById('reviews-input');
    const positiveResultsList = document.getElementById('positive-results');
    const negativeResultsList = document.getElementById('negative-results');

    analyzeButton.addEventListener('click', async () => {
        const reviewsText = reviewsInput.value;

        positiveResultsList.innerHTML = '<li>Analyzing... Please wait.</li>';
        negativeResultsList.innerHTML = '';

        try {

            const response = await fetch('https://localpulse-i7eg.onrender.com/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: reviewsText })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const analysisResult = await response.json();

            positiveResultsList.innerHTML = '';
            negativeResultsList.innerHTML = '';

            if (analysisResult.positivePoints && analysisResult.positivePoints.length > 0) {
                analysisResult.positivePoints.forEach(point => {
                    const listItem = document.createElement('li');
                    listItem.textContent = point;
                    positiveResultsList.appendChild(listItem);
                });
            } else {
                positiveResultsList.innerHTML = '<li>No specific positive points found.</li>';
            }
            
            if (analysisResult.negativePoints && analysisResult.negativePoints.length > 0) {
                analysisResult.negativePoints.forEach(point => {
                    const listItem = document.createElement('li');
                    listItem.textContent = point;
                    negativeResultsList.appendChild(listItem);
                });
            } else {
                negativeResultsList.innerHTML = '<li>No specific negative points found.</li>';
            }

        } catch (error) {
            console.error('Error during analysis:', error);
            positiveResultsList.innerHTML = '';
            negativeResultsList.innerHTML = `<li>Error: Could not connect to the AI server. Make sure it's running.</li>`;
        }
    });
});
