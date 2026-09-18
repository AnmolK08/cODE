import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

app.get("/redis", async (req, res) => {
    const data = await redis.ping();

    return res.json({
        message: "connected to redis",
        data: data,
    });
});

const banner_key = "Practice_Redis_Banner";

app.post("/banner_details", async(req,res) => {
    const {data} = req.body;

    await redis.set(banner_key, data);

    return res.json({
        success : true,
        message : "Banner details added successfully",
        data : data
    })
})

app.get("/banner", async(req,res) => {
    const data = await redis.get(banner_key);

    if(!data) return res.json({ success : false, message : "No Banner data found in Redis."});

    return res.json({
        success : true,
        message : "Banner data fetched successfully",
        data : data
    })
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});