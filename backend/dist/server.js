import cors from 'cors';
import express from 'express';
import { catalogRouter } from './routes/catalog.js';
import { interactionRouter } from './routes/interactions.js';
import { profileRouter } from './routes/profile.js';
import { getDb } from './lib/db.js';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/profile', profileRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/interactions', interactionRouter);
const port = Number(process.env.PORT ?? 4000);
if (process.env.NODE_ENV !== 'test') {
    getDb().then(() => {
        app.listen(port, () => {
            console.log(`DownUnder API running on http://localhost:${port}`);
        });
    });
}
export default app;
