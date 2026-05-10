import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../server.js';
import { getDb, saveDb } from '../lib/db.js';
describe('profile routes', () => {
    beforeEach(async () => {
        const db = await getDb();
        db.run('DELETE FROM profile;');
        db.run('DELETE FROM profileBirthControl;');
        db.run('DELETE FROM profileMedications;');
        saveDb();
    });
    it('stores and returns profile data', async () => {
        const putResponse = await request(app).put('/api/profile').send({
            name: 'Ava',
            age: 24,
            heightCm: 168,
            weightKg: 60,
            smoker: false,
            conditionsNotes: 'None',
            birthControlMethodId: 1
        });
        expect(putResponse.status).toBe(200);
        const getResponse = await request(app).get('/api/profile');
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.profile.name).toBe('Ava');
        expect(getResponse.body.profile.birthControlMethodId).toBe(1);
    });
});
