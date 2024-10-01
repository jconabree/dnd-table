// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getAllAreas, saveArea, deleteArea, getAllSegments } from './models/areas';
import { getConfig, saveConfig } from './models/configurations';
import { publishCharacterStates, stopInitiative } from "./models/initiative";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const API_BASE = '/api';

app.use(express.json());

enum API_ENDPOINTS {
	AREA_LIST = 'areas',
	AREA_SAVE = 'areas/area',
	AREA_DELETE = 'areas/area/delete',
	SEGMENTS_LIST = 'areas/segments',
	CONFIG_GET = 'config',
	CONFIG_SAVE = 'config',
	INITIATIVE_STATES = 'initiative/states',
	INITIATIVE_STOP = 'initiative/stop',
}

app.get(`${API_BASE}`, (req: Request, res: Response) => {
  res.send(`
		Available endpoints:
		<ul>
			${Object.values(API_ENDPOINTS).map((endpoint) => {
				return `<li>${endpoint}</li>`;
			})}
		</ul>
	`);
});

app.get(`${API_BASE}/${API_ENDPOINTS.AREA_LIST}`, (req: Request, res: Response) => {
    const areas = getAllAreas();
    res.json(areas);
});

app.post(`${API_BASE}/${API_ENDPOINTS.AREA_SAVE}`, (req: Request, res: Response) => {
    const { area } = req.body;
	console.log(area);
	const savedArea = saveArea(area);

    res.json(savedArea);
});

app.post(`${API_BASE}/${API_ENDPOINTS.AREA_DELETE}`, (req: Request, res: Response) => {
    const { areaId } = req.body;
	deleteArea(areaId);

    res.json({ success: true });
});

app.get(`${API_BASE}/${API_ENDPOINTS.SEGMENTS_LIST}`, async (req: Request, res: Response) => {
	const segments = await getAllSegments();

    res.json(segments);
});

app.post(`${API_BASE}/${API_ENDPOINTS.INITIATIVE_STATES}`, (req: Request, res: Response) => {
	const { characters } = req.body;
	publishCharacterStates(characters);

    res.json({ success: true });
});

app.post(`${API_BASE}/${API_ENDPOINTS.INITIATIVE_STOP}`, (req: Request, res: Response) => {
	stopInitiative();

    res.json({ success: true });
});

app.get(`${API_BASE}/${API_ENDPOINTS.CONFIG_GET}`, (req: Request, res: Response) => {
	const config = getConfig();

    res.json({ ...config || {} });
});

app.post(`${API_BASE}/${API_ENDPOINTS.CONFIG_SAVE}`, (req: Request, res: Response) => {
	const config = req.body;
	const success = saveConfig(config);

    res.json({ success });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});