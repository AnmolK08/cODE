import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const redis = new Redis("redis://localhost:6379");

app.get("/redis", async (req, res) => {
    const data = await redis.ping();

    return res.json({
        message: "connected to redis",
        data: data,
    });
});

app.get("/mongo", async (req, res) => {
    const url = "mongodb://localhost:27017/mongo_redis01";

    if(url){
        mongoose.connect(url).then(() => {
            return res.json({
                message: "connected to mongo",
            });
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
            return res.status(500).json({
                message: "Failed to connect to MongoDB",
            });
        });
    }
    
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});