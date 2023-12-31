import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import run from "./index.js";
const app = express();
import fs from "fs";
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    // credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.post("/question", async (req, res) => {
  const date = new Date();
  let { question, chatHistory } = req.body;
  let answer = await run(question, chatHistory);

  res.send({
    message: answer,
    date: `${date.getHours()}:${date.getMinutes()}`,
  });
});

const port = process.env.PORT || 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
