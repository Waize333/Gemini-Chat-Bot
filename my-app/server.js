const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();  // Load environment variables

// Middleware
app.use(cors());
app.use(express.json());

// GoogleGenerativeAI instance
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAi = new GoogleGenerativeAI(process.env.GOOGLE_GENKEY );

// POST endpoint for /gemini
app.post('/gemini', async (req, res) => {
    try {
        const { history, message } = req.body;

        console.log("History:", history);
        console.log("Message:", message);

        // Get generative model
        const model = genAi.getGenerativeModel({ model: "gemini-pro" });

        // Start chat with history
        const chat = model.startChat({
            history:req.body.history
         });

        const msg =req.body.message
        // Send message and get the response
        const result = await chat.sendMessage(msg);
        const response =await result.response
        const text = response.text()  // Assuming result.response.text is a string

        // Send response to client
        res.send(text);
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
