// --- LocalPulse Backend Server v3.1 --- Added Login Functionality ---
// File: server.js

require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// --- Supabase Connection ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS Configuration ---
const corsOptions = {
  origin: [
      'https://sakurashadows.github.io', // Your live site
      'http://127.0.0.1:5500',           // Your local Live Server
      'http://localhost:5500'            // An alternative for the local address
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());


// --- API Routes ---

app.post('/analyze', async (req, res) => {
    // For now, this is a placeholder. We will add the AI logic back later.
    res.json({ message: "Analysis function is ready." });
});

// --- User Registration Route ---
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        console.error('Supabase sign up error:', error.message);
        return res.status(400).json({ error: error.message });
    }

    console.log('User registered successfully:', data.user.email);
    res.status(200).json({ user: data.user });
});

// --- ================== NEW USER LOGIN ROUTE ================== ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Use Supabase auth to sign in a user
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        // If Supabase returns an error (e.g., invalid credentials)
        console.error('Supabase sign in error:', error.message);
        return res.status(400).json({ error: "Invalid login credentials" }); // Send a generic error
    }
    
    // If successful, send back the user data and session
    console.log('User logged in successfully:', data.user.email);
    res.status(200).json({ user: data.user, session: data.session });
});
// --- ========================================================== ---


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server v3.1 with Auth is listening on http://localhost:${PORT}`);
});