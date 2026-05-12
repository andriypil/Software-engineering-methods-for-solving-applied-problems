import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const FILE = "./data.json";

// Зберегти
app.post("/save", (req, res) => {
    const data = req.body;

    let allData = [];
    if (fs.existsSync(FILE)) {
        allData = JSON.parse(fs.readFileSync(FILE));
    }

    allData.push(data);
    fs.writeFileSync(FILE, JSON.stringify(allData, null, 2));

    res.json({ message: "Збережено" });
});

// Отримати всі дані
app.get("/data", (req, res) => {
    if (!fs.existsSync(FILE)) return res.json([]);
    const data = JSON.parse(fs.readFileSync(FILE));
    res.json(data);
});

app.listen(5000, () => console.log("Server running on 5000"));