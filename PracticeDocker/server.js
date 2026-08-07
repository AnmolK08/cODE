import express from "express";


const app = express();

app.get("/", (req, res) => {
    res.send("Hello Docker");
});

app.get("/user", (req, res) => {
    res.send(`Hello User are you ...?`);
});


app.listen(3000, () => {
    console.log("Server Running");
});