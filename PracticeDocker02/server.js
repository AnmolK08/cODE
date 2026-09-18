
import express from "express";
import dotenv from "dotenv";
import { createClient } from "redis";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const app = express();

app.use(express.json());

// Prisma 7 + PostgreSQL
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

// Redis
const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error", (error) => {
    console.error("Redis error:", error);
});

// Health check
app.get("/health", async (req, res) => {
    res.json({
        message: "Server is healthy",
    });
});

// Get tasks
app.get("/tasks", async (req, res) => {
    try {
        const cachedTasks = await redis.get("tasks");

        if (cachedTasks) {
            console.log("Sending cached data...");

            return res.json({
                message: "this is from redis cache",
                tasks: JSON.parse(cachedTasks),
            });
        }

        console.log("Fetching from database...");

        const tasks = await prisma.task.findMany();

        await redis.set("tasks", JSON.stringify(tasks), {
            EX: 60,
        });

        res.json({
            message: "this is from database",
            tasks,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            message: "Failed to fetch tasks",
        });
    }
});

// Create task
app.post("/tasks", async (req, res) => {
    try {
        const { title } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
            },
        });

        // Invalidate cached task list
        await redis.del("tasks");

        res.status(201).json({
            message: "task created successfully",
            task,
        });
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            message: "Failed to create task",
        });
    }
});

// Start server
async function startServer() {
    try {
        await redis.connect();

        await prisma.$connect();

        app.listen(process.env.PORT, () => {
            console.log(
                `Server is running on port ${process.env.PORT}`
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);

        process.exit(1);
    }
}

startServer();
