// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getAllAreas, saveArea } from './models/areas';
import { getConfig, saveConfig } from './models/configurations';
import { getAllEffects, saveEffect, changeActive } from './models/effects';
import { publishCharacterStates } from "./models/initiative";
import { highlightNodes, clearAll } from "./models/nodes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const API_BASE = '/api';

app.use(express.json());

enum API_ENDPOINTS {
	AREA_LIST = 'areas',
	AREA_SAVE = 'areas/area',
	CLEAR = 'clear',
	CONFIG_GET = 'config',
	CONFIG_SAVE = 'config',
	EFFECT_LIST = 'effects',
	EFFECT_SAVE = 'effects/effect',
	EFFECT_TOGGLE = 'effects/toggle',
	INITIATIVE_STATES = 'initiative/states',
	HIGHLIGHT_NODES = 'nodes/highlight',
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

app.get(`${API_BASE}/${API_ENDPOINTS.EFFECT_LIST}`, (req: Request, res: Response) => {
    const effects = getAllEffects();
    res.json(effects);
});

app.post(`${API_BASE}/${API_ENDPOINTS.EFFECT_SAVE}`, (req: Request, res: Response) => {
    const { effect } = req.body;
	const savedArea = saveEffect(effect);

    res.json(savedArea);
});

app.post(`${API_BASE}/${API_ENDPOINTS.EFFECT_TOGGLE}`, (req: Request, res: Response) => {
    const { effectId, active } = req.body;
	const result = changeActive(effectId, active);

    res.json({ success: result });
});

app.post(`${API_BASE}/${API_ENDPOINTS.CLEAR}`, (req: Request, res: Response) => {
	const result = clearAll();

    res.json({ success: result });
});

app.post(`${API_BASE}/${API_ENDPOINTS.HIGHLIGHT_NODES}`, (req: Request, res: Response) => {
	const { nodes, color } = req.body;
	const result = highlightNodes(nodes, color);

    res.json({ success: result });
});

app.post(`${API_BASE}/${API_ENDPOINTS.INITIATIVE_STATES}`, (req: Request, res: Response) => {
	const { characters } = req.body;
	publishCharacterStates(characters);

    res.json({ success: true });
});

app.get(`${API_BASE}/${API_ENDPOINTS.CONFIG_GET}`, (req: Request, res: Response) => {
	const config = getConfig();

    res.json({ config });
});

app.post(`${API_BASE}/${API_ENDPOINTS.CONFIG_SAVE}`, (req: Request, res: Response) => {
	const config = req.body;
	const success = saveConfig(config);

    res.json({ success });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});