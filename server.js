// --- LocalPulse Backend Server v2.0 --- THEMATIC ANALYSIS ENGINE ---
// File: server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- ADVANCED AI ANALYSIS FUNCTION (v2.0) ---
async function getThematicAIAnalysis(reviewsText) {
    console.log("Starting Thematic AI analysis...");

    // Dictionaries for thematic analysis
    const themes = {
        Food: ['food', 'pizza', 'burger', 'soup', 'dish', 'tasty', 'delicious', 'mancare', 'preparat', 'gustos', 'delicios'],
        Service: ['service', 'waiter', 'staff', 'friendly', 'slow', 'waited', 'servire', 'ospatar', 'personal', 'amabil', 'rapid', 'incet'],
        Ambiance: ['ambiance', 'atmosphere', 'music', 'decor', 'vibe', 'atmosfera', 'muzica', 'design'],
        Price: ['price', 'expensive', 'cheap', 'value', 'cost', 'pret', 'scump', 'ieftin', 'valoare'],
        Cleanliness: ['clean', 'dirty', 'spotless', 'hygiene', 'curat', 'murdar', 'igiena']
    };

    const positiveKeywords = ['excellent', 'amazing', 'love', 'perfect', 'fast', 'delicious', 'friendly', 'great', 'best', 'fantastic', 'wonderful', 'recommended', 'impresionat', 'iubit', 'perfecta'];
    const negativeKeywords = ['slow', 'waiting', 'waited', 'bad', 'disappointed', 'cold', 'problem', 'issue', 'poor', 'terrible', 'awful', 'never again', 'dezamagit', 'problema', 'rece'];

    // Initialize the result structure
    let analysisResult = {
        Food: { positive: [], negative: [] },
        Service: { positive: [], negative: [] },
        Ambiance: { positive: [], negative: [] },
        Price: { positive: [], negative: [] },
        Cleanliness: { positive: [], negative: [] },
        Other: { positive: [], negative: [] }
    };

    const sentences = reviewsText.split(/[.!?]/);

    sentences.forEach(sentence => {
        const trimmedSentence = sentence.trim().toLowerCase();
        if (!trimmedSentence) return;

        let categorized = false;

        // Check each theme
        for (const theme in themes) {
            for (const keyword of themes[theme]) {
                if (trimmedSentence.includes(keyword)) {
                    // We found a theme, now check sentiment
                    const isPositive = positiveKeywords.some(pKeyword => trimmedSentence.includes(pKeyword));
                    const isNegative = negativeKeywords.some(nKeyword => trimmedSentence.includes(nKeyword));
                    
                    if (isPositive) {
                        analysisResult[theme].positive.push(sentence.trim());
                    } else if (isNegative) {
                        analysisResult[theme].negative.push(sentence.trim());
                    } else {
                        // If theme keyword is present but no strong sentiment keyword, add to "Other"
                        analysisResult.Other.positive.push(sentence.trim());
                    }
                    categorized = true;
                    break; // Move to next sentence once a theme is found
                }
            }
            if (categorized) break;
        }

        // If no theme was found, categorize as "Other"
        if (!categorized) {
            const isPositive = positiveKeywords.some(pKeyword => trimmedSentence.includes(pKeyword));
            const isNegative = negativeKeywords.some(nKeyword => trimmedSentence.includes(nKeyword));

            if (isPositive) analysisResult.Other.positive.push(sentence.trim());
            else if (isNegative) analysisResult.Other.negative.push(sentence.trim());
        }
    });

    // Generate a simple summary
    let summary = "The analysis highlights feedback on several key areas.";
    // This could be made much more intelligent later.

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800)); 
    console.log("Thematic analysis complete.");

    return { analysis: analysisResult, summary: summary };
}


// --- API Routes ---
app.get('/', (req, res) => {
    res.send('LocalPulse AI Server v2.0 is running!');
});

app.post('/analyze', async (req, res) => {
    try {
        const reviewsText = req.body.text;
        if (!reviewsText) {
            return res.status(400).json({ error: 'No text provided.' });
        }
        const result = await getThematicAIAnalysis(reviewsText);
        res.json(result);
    } catch (error) {
        console.error("Error in AI analysis:", error);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server v2.0 is listening on http://localhost:${PORT}`);
});