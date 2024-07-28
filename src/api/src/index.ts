// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getAllAreas, saveArea } from './models/areas';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.send("API");
});

app.get("/api/areas/list", (req: Request, res: Response) => {
    const areas = getAllAreas();
    res.json(areas);
});

app.post("/api/areas/area", (req: Request, res: Response) => {
    const { area } = req.body;
	console.log(area);
	const savedArea = saveArea(area);

    res.json(savedArea);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});