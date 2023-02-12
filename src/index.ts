import express from "express";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import WordsRouter from "./routes/words";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", WordsRouter());

const server = http.createServer(app);

server.listen(8000, () => {
    console.log("Server started on port 8000");
});
