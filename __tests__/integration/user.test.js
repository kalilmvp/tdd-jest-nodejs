import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Kalil Peixoto',
        email: 'kalilmvp@gmail.com',
        password_hash: '123123aA',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Kalil Peixoto',
        email: 'kalilmvp@gmail.com',
        password_hash: '123123aA',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Kalil Peixoto',
        email: 'kalilmvp@gmail.com',
        password_hash: '123123aA',
      });

    expect(response.status).toBe(400);
  });
});
