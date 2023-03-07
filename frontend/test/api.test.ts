import request from 'supertest';
import app from '../src/app';

describe('GET /api/v1/', () => {
    it('should return 200 OK', () => {
        return request(app).get('/api/v1')
            .expect(200);
    });
});

describe.skip('GET /api/v1/totalplay/login', () => {
    it('should return 200 OK', () => {
        return request(app).get('/api/v1/totalplay/login')
            .expect(200);
    });
});