// --- script.js v2.1 --- Robust Local Testing Version ---

let sentimentChart = null;

document.addEventListener('DOMContentLoaded', () => {

    const analyzeButton = document.getElementById('analyze-button');
    const reviewsInput = document.getElementById('reviews-input');
    const thematicResultsContainer = document.getElementById('thematic-results-container');
    const chartCanvas = document.getElementById('sentimentChart');

    analyzeButton.addEventListener('click', async () => {
        const reviewsText = reviewsInput.value;

        thematicResultsContainer.innerHTML = '<p class="loading-text">Analyzing... Please wait.</p>';
        if (chartCanvas && chartCanvas.parentElement) {
            chartCanvas.parentElement.style.display = 'none';
        }
        if (sentimentChart) {
            sentimentChart.destroy();
        }

        try {
            // This is the URL for our LOCAL server.
            const serverUrl = 'http://localhost:3000/analyze';

            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: reviewsText })
            });

            if (!response.ok) {
                // Throws an error if the server response is not "OK" (e.g. 404, 500)
                throw new Error(`Server responded with status: ${response.statusText}`);
            }

            const result = await response.json();
            thematicResultsContainer.innerHTML = ''; 

            const analysisData = result.analysis;
            let totalPositive = 0;
            let totalNegative = 0;

            // ... (rest of the card and chart rendering logic remains the same)
            for (const theme in analysisData) {
                const positivePoints = analysisData[theme].positive;
                const negativePoints = analysisData[theme].negative;

                if (positivePoints.length > 0 || negativePoints.length > 0) {
                    const card = document.createElement('div');
                    card.className = 'theme-card';
                    const title = document.createElement('h3');
                    title.textContent = theme;
                    card.appendChild(title);
                    const list = document.createElement('ul');

                    positivePoints.forEach(point => {
                        const listItem = document.createElement('li');
                        listItem.className = 'positive-item';
                        listItem.textContent = point;
                        list.appendChild(listItem);
                        totalPositive++;
                    });

                    negativePoints.forEach(point => {
                        const listItem = document.createElement('li');
                        listItem.className = 'negative-item';
                        listItem.textContent = point;
                        list.appendChild(listItem);
                        totalNegative++;
                    });
                    
                    card.appendChild(list);
                    card.style.display = 'flex';
                    thematicResultsContainer.appendChild(card);
                }
            }
            
            if (totalPositive > 0 || totalNegative > 0) {
                if (chartCanvas && chartCanvas.parentElement) {
                    chartCanvas.parentElement.style.display = 'block';
                }
                const ctx = chartCanvas.getContext('2d');
                sentimentChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Positive Sentiments', 'Negative Sentiments'],
                        datasets: [{
                            label: 'Sentiment Analysis',
                            data: [totalPositive, totalNegative],
                            backgroundColor: ['rgba(40, 167, 69, 0.7)', 'rgba(220, 53, 69, 0.7)'],
                            borderColor: ['rgba(40, 167, 69, 1)', 'rgba(220, 53, 69, 1)'],
                            borderWidth: 1
                        }]
                    },
                    options: { /* ... options ... */ }
                });
            }

        } catch (error) {
            console.error('A detailed error occurred:', error);
            thematicResultsContainer.innerHTML = `<p class="error-text">An error occurred. Check the console (F12) for details and ensure the local server is running.</p>`;
        }
    });
});