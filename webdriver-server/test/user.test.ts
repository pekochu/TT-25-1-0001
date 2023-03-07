import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';

describe('GET /signup', () => {
    it('should return 200 OK', (done) => {
        request(app).get('/signup')
            .expect(200)
            .end(() => done());
    });
});
