// --- script.js v1.1 --- Chart.js Implementation ---

// This variable will hold our chart object, so we can destroy it before creating a new one.
let sentimentChart = null;

document.addEventListener('DOMContentLoaded', () => {

    const analyzeButton = document.getElementById('analyze-button');
    const reviewsInput = document.getElementById('reviews-input');
    const positiveResultsList = document.getElementById('positive-results');
    const negativeResultsList = document.getElementById('negative-results');
    const chartCanvas = document.getElementById('sentimentChart'); // Get the canvas element

    analyzeButton.addEventListener('click', async () => {
        const reviewsText = reviewsInput.value;

        positiveResultsList.innerHTML = '<li>Analyzing... Please wait.</li>';
        negativeResultsList.innerHTML = '';
        
        // Hide the chart container initially
        if (chartCanvas.parentElement) {
            chartCanvas.parentElement.style.display = 'none';
        }

        try {
            const response = await fetch('http://localhost:3000/analyze', {
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

            // Display text results (as before)
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

            // --- NEW CHART LOGIC ---

            // Destroy the old chart if it exists, to prevent bugs
            if (sentimentChart) {
                sentimentChart.destroy();
            }
            
            const positiveCount = analysisResult.positivePoints.length;
            const negativeCount = analysisResult.negativePoints.length;

            // Only draw the chart if there is data
            if (positiveCount > 0 || negativeCount > 0) {
                if (chartCanvas.parentElement) {
                    chartCanvas.parentElement.style.display = 'block'; // Show the chart container
                }
                const ctx = chartCanvas.getContext('2d');
                
                sentimentChart = new Chart(ctx, {
                    type: 'pie', // Type of chart
                    data: {
                        labels: ['Positive Sentiments', 'Negative Sentiments'],
                        datasets: [{
                            label: 'Sentiment Analysis',
                            data: [positiveCount, negativeCount],
                            backgroundColor: [
                                'rgba(40, 167, 69, 0.7)',  // Green for positive
                                'rgba(220, 53, 69, 0.7)'   // Red for negative
                            ],
                            borderColor: [
                                'rgba(40, 167, 69, 1)',
                                'rgba(220, 53, 69, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Sentiment Distribution'
                            }
                        }
                    }
                });
            }

        } catch (error) {
            console.error('Error during analysis:', error);
            positiveResultsList.innerHTML = '';
            if (document.getElementById('negative-results')) { // Check if element exists before changing
               document.getElementById('negative-results').innerHTML = `<li>Error: Could not connect to the AI server. Make sure it's running.</li>`;
            }
        }
    });

});