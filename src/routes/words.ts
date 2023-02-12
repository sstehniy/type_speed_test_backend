import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const WordsRouter = () => {
    const router = Router();
    router.get("/", (req, res) => {
        res.send("Hello World");
    });
    router.get("/quote", async (req, res) => {
        const quotesJson = await fs.readFile("./data/quotes.json", "utf-8");
        const parsedQuotes = JSON.parse(quotesJson);
        const randomIndex = Math.floor(Math.random() * parsedQuotes.length);
        res.status(200).json(parsedQuotes[randomIndex]);
    });
    router.get("/words", async (req, res) => {
        const { lang, minLength, maxLength, count } = req.query as Record<
            string,
            string
        >;
        if (!lang) {
            res.status(400).json({ message: "Language is required" });
            return;
        }
        if (!count) {
            res.status(400).json({ message: "Count is required" });
            return;
        }
        if (Number.isNaN(parseInt(count, 10))) {
            res.status(400).json({ message: "Count must be a number" });
            return;
        }
        if (
            maxLength &&
            minLength &&
            parseInt(maxLength, 10) < parseInt(minLength, 10)
        ) {
            res.status(400).json({
                message: "Max length must be greater than min length"
            });
        }
        const wordsJson = await fs.readFile(
            path.resolve(__dirname, `../../data/${lang}_parsed_shrinked.json`),
            "utf-8"
        );
        let parsedWords = JSON.parse(wordsJson);
        if (minLength && !Number.isNaN(parseInt(minLength.toString(), 10))) {
            parsedWords = parsedWords.filter(
                (word: string) =>
                    word.length >= parseInt(minLength.toString(), 10)
            );
        }
        if (maxLength && !Number.isNaN(parseInt(maxLength.toString(), 10))) {
            parsedWords = parsedWords.filter(
                (word: string) =>
                    word.length <= parseInt(maxLength.toString(), 10)
            );
        }
        // Create an empty array to store the list of random indices
        const randomIndices: number[] = [];

        // Generate random indices until the array is the same size as the number of words to generate
        while (randomIndices.length < parseInt(count, 10)) {
            // Generate a random index
            const randomIndex = Math.floor(Math.random() * parsedWords.length);
            // Check if the array already contains the random index, and if not, add it to the array
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
            }
        }
        const wordsToSend: string[] = [];
        randomIndices.forEach((index) => {
            wordsToSend.push(parsedWords[index]);
        });
        res.status(200).json(wordsToSend);
    });
    return router;
};

export default WordsRouter;
