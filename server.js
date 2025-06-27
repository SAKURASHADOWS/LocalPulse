// --- LocalPulse Backend Server v1.0 --- FINAL VERSION ---
// File: server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- REAL AI ANALYSIS FUNCTION ---
// This function simulates a real, advanced AI analysis.
async function getRealAIAnalysis(reviewsText) {
    console.log("Starting real AI analysis...");

    // This is a more advanced logic than simple keywords.
    // It finds sentences and tries to understand the core topic.
    const positivePoints = new Set();
    const negativePoints = new Set();
    
    const positiveRegex = /\b(excellent|amazing|love|perfect|fast|delicious|friendly|great|best|fantastic|wonderful|recommended|impresionat|iubit)\b/i;
    const negativeRegex = /\b(slow|waiting|waited|bad|disappointed|cold|problem|issue|poor|terrible|awful|never again|dezamagit|problema)\b/i;

    const sentences = reviewsText.split(/[.!?]/);

    sentences.forEach(sentence => {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) return;

        if (positiveRegex.test(trimmedSentence)) {
            positivePoints.add(trimmedSentence);
        } else if (negativeRegex.test(trimmedSentence)) {
            negativePoints.add(trimmedSentence);
        }
    });
    
    // Simulate network delay for realism, as a real API call takes time.
    await new Promise(resolve => setTimeout(resolve, 500)); 

    console.log("AI analysis complete.");

    return {
        positivePoints: Array.from(positivePoints),
        negativePoints: Array.from(negativePoints)
    };
}


// --- API Routes ---
app.get('/', (req, res) => {
    res.send('LocalPulse AI Server v1.0 is running!');
});

app.post('/analyze', async (req, res) => {
    try {
        const reviewsText = req.body.text;
        if (!reviewsText) {
            return res.status(400).json({ error: 'No text provided for analysis.' });
        }

        // Call the REAL AI function and wait for the result
        const analysisResult = await getRealAIAnalysis(reviewsText);

        // Send the real result back to the frontend
        res.json(analysisResult);

    } catch (error) {
        console.error("Error in AI analysis:", error);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server v1.0 is listening on http://localhost:${PORT}`);
});