import express from "express";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

app.post("/comment", async (req, res) => {
    const codeInput = req.body.codeInput;
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a code commenting bot. Please add short comments to each of the provided code. Return the code and the added comments" },
            { role: "user", content: "Take the following peace of text, if it is a code prompt then add comments to it, if it is a normal text, then tell me it is a normal text:" + codeInput }],
        })

        const commentedCode = response.data.choices[0].message.content;
        console.log(commentedCode)
        res.json({ commentedCode });
    } catch (error) {
        console.error("*ERROR* OpenAI API error:", error);
        res.status(500).json({ error: "An error occurred while generating comments." });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

