// --- File: script.js ---

// Part 1: The AI Engine (The logic we already created)
// ========================================================

/**
 * Analyzes a block of text containing customer reviews and extracts sentences
 * with positive or negative sentiment based on keyword matching.
 * @param {string} reviewsText - A string containing multiple customer reviews.
 * @returns {{positivePoints: string[], negativePoints: string[]}} An object containing arrays of positive and negative sentences.
 */
function analyzeCustomerReviews(reviewsText) {
    const positiveKeywords = ['excellent', 'amazing', 'love', 'perfect', 'fast', 'delicious', 'friendly', 'great', 'best', 'fantastic', 'wonderful', 'recommended'];
    const negativeKeywords = ['slow', 'waiting', 'waited', 'bad', 'disappointed', 'cold', 'problem', 'issue', 'poor', 'terrible', 'awful', 'never again'];

    const foundPositivePoints = new Set();
    const foundNegativePoints = new Set();

    if (!reviewsText || typeof reviewsText !== 'string') {
        return { positivePoints: [], negativePoints: [] };
    }

    const sentences = reviewsText.toLowerCase().split(/[.!?]/);

    sentences.forEach(sentence => {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) return; 

        // Important: Reset flag for each sentence
        let foundInSentence = false;

        for (const keyword of positiveKeywords) {
            if (trimmedSentence.includes(keyword)) {
                foundPositivePoints.add(trimmedSentence);
                foundInSentence = true;
                break; 
            }
        }
        
        // Only check for negative if not already found as positive
        if (!foundInSentence) {
            for (const keyword of negativeKeywords) {
                if (trimmedSentence.includes(keyword)) {
                    foundNegativePoints.add(trimmedSentence);
                    break; 
                }
            }
        }
    });

    return {
        positivePoints: Array.from(foundPositivePoints),
        negativePoints: Array.from(foundNegativePoints)
    };
}


// Part 2: The Connection Logic (The "Brain" that connects HTML to the AI Engine)
// =================================================================================

// This code runs after the entire HTML page has loaded
document.addEventListener('DOMContentLoaded', () => {

    // Find the important HTML elements by their ID
    const analyzeButton = document.getElementById('analyze-button');
    const reviewsInput = document.getElementById('reviews-input');
    const positiveResultsList = document.getElementById('positive-results');
    const negativeResultsList = document.getElementById('negative-results');

    // Add an "event listener" to the button. This tells the browser:
    // "When this button is clicked, run the following function."
    analyzeButton.addEventListener('click', () => {
        // 1. Get the text from the input box
        const reviewsText = reviewsInput.value;

        // 2. Call our AI engine function with the text
        const analysisResult = analyzeCustomerReviews(reviewsText);

        // 3. Clear any previous results from the lists
        positiveResultsList.innerHTML = '';
        negativeResultsList.innerHTML = '';

        // 4. Display the positive results
        if (analysisResult.positivePoints.length > 0) {
            analysisResult.positivePoints.forEach(point => {
                const listItem = document.createElement('li');
                listItem.textContent = point;
                positiveResultsList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = "No specific positive points found.";
            positiveResultsList.appendChild(listItem);
        }
        
        // 5. Display the negative results
        if (analysisResult.negativePoints.length > 0) {
            analysisResult.negativePoints.forEach(point => {
                const listItem = document.createElement('li');
                listItem.textContent = point;
                negativeResultsList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = "No specific negative points found.";
            negativeResultsList.appendChild(listItem);
        }
    });
});