// --- LocalPulse Backend Server v3.2 --- Simplified & Free ---
// File: server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS Configuration ---
const corsOptions = {
  origin: [
      'https://sakurashadows.github.io', // Your live site
      'https://localpulse.pro',           // Your custom domain
      'http://127.0.0.1:5500',           // Your local Live Server
      'http://localhost:5500'            // An alternative for the local address
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// The AI Analysis function remains the same
async function getThematicAIAnalysis(reviewsText) {
    console.log("Starting Thematic AI analysis...");
    const themes = {
        Food: ['food', 'pizza', 'burger', 'soup', 'dish', 'tasty', 'delicious', 'mancare', 'preparat', 'gustos', 'delicios'],
        Service: ['service', 'waiter', 'staff', 'friendly', 'slow', 'waited', 'servire', 'ospatar', 'personal', 'amabil', 'rapid', 'incet'],
        Ambiance: ['ambiance', 'atmosphere', 'music', 'decor', 'vibe', 'atmosfera', 'muzica', 'design'],
        Price: ['price', 'expensive', 'cheap', 'value', 'cost', 'pret', 'scump', 'ieftin', 'valoare'],
        Cleanliness: ['clean', 'dirty', 'spotless', 'hygiene', 'curat', 'murdar', 'igiena']
    };
    const positiveKeywords = ['excellent', 'amazing', 'love', 'perfect', 'fast', 'delicious', 'friendly', 'great', 'best', 'fantastic', 'wonderful', 'recommended', 'impresionat', 'iubit', 'perfecta'];
    const negativeKeywords = ['slow', 'waiting', 'waited', 'bad', 'disappointed', 'cold', 'problem', 'issue', 'poor', 'terrible', 'awful', 'never again', 'dezamagit', 'problema', 'rece'];
    let analysisResult = { Food: { positive: [], negative: [] }, Service: { positive: [], negative: [] }, Ambiance: { positive: [], negative: [] }, Price: { positive: [], negative: [] }, Cleanliness: { positive: [], negative: [] }, Other: { positive: [], negative: [] } };
    const sentences = reviewsText.split(/[.!?]/);
    sentences.forEach(sentence => {
        const trimmedSentence = sentence.trim().toLowerCase();
        if (!trimmedSentence) return;
        let categorized = false;
        for (const theme in themes) {
            for (const keyword of themes[theme]) {
                if (trimmedSentence.includes(keyword)) {
                    const isPositive = positiveKeywords.some(pKeyword => trimmedSentence.includes(pKeyword));
                    const isNegative = negativeKeywords.some(nKeyword => trimmedSentence.includes(nKeyword));
                    if (isPositive) analysisResult[theme].positive.push(sentence.trim());
                    else if (isNegative) analysisResult[theme].negative.push(sentence.trim());
                    else analysisResult.Other.positive.push(sentence.trim());
                    categorized = true;
                    break;
                }
            }
            if (categorized) break;
        }
        if (!categorized) {
            const isPositive = positiveKeywords.some(pKeyword => trimmedSentence.includes(pKeyword));
            const isNegative = negativeKeywords.some(nKeyword => trimmedSentence.includes(nKeyword));
            if (isPositive) analysisResult.Other.positive.push(sentence.trim());
            else if (isNegative) analysisResult.Other.negative.push(sentence.trim());
        }
    });
    await new Promise(resolve => setTimeout(resolve, 800)); 
    console.log("Thematic analysis complete.");
    return { analysis: analysisResult, summary: "Analysis complete." };
}

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('LocalPulse Free AI Server is running!');
});

app.post('/analyze', async (req, res) => {
    try {
        const reviewsText = req.body.text;
        if (!reviewsText) { return res.status(400).json({ error: 'No text provided.' }); }
        const result = await getThematicAIAnalysis(reviewsText);
        res.json(result);
    } catch (error) {
        console.error("Error in AI analysis:", error);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Free Server is listening on http://localhost:${PORT}`);
});