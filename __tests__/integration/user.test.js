import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user is created', async () => {
    const user = await User.create({
      name: 'Kalil Peixoto',
      email: 'kalilmvp@gmail.com',
      password: '123123aA',
    });

    const compare_hash = await bcrypt.compare('123123aA', user.password_hash);

    expect(compare_hash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Kalil Peixoto',
        email: 'kalilmvp@gmail.com',
        password: '123123aA',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Kalil Peixoto',
        email: 'kalilmvp@gmail.com',
        password: '123123aA',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Kalil Peixoto',
        email: 'kalilmvp@gmail.com',
        password: '123123aA',
      });

    expect(response.status).toBe(400);
  });
});
