import { StatusCodes } from 'http-status-codes';
import { testServer } from './jest.setup';

describe('sign.up', () => {
  it('success', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');
  });
  it('without name', async () => {
    const res = await testServer.post('/sign-up').send({
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without email', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('invalid email', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('invalid password', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user.same@mail.com',
      password: '12345678',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('with email already registered', async () => {
    const resCreate = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user.same@mail.com',
      password: '123456.sS',
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user.same@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without body', async () => {
    const res = await testServer.post('/sign-up').send({});
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(3);
  });
  it('without password', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user@mail.com',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to short', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'CC',
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to long', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890',
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('sign.in', () => {
  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'Sign In User',
      email: 'sign.in.user@mail.com',
      password: '123456.sS',
    });
  });
  it('success', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'sign.in.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('accessToken');
  });
  it('without email', async () => {
    const res = await testServer.post('/sign-in').send({
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without password', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'sign.in.user@mail.com',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without body', async () => {
    const res = await testServer.post('/sign-in').send({});
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(2);
  });
  it('invalid email', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'invalid@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('invalid password', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'sign.in.user@mail.com',
      password: '123456',
    });
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('users.getAll', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/sign-up').send({
      name: 'Get All User',
      email: 'get.all.user@mail.com',
      password: '123456.sS',
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    let accessToken: string | undefined = undefined;
    const signIn = await testServer.post('/sign-in').send({
      email: 'get.all.user@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;

    const res = await testServer
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('records');
    expect(res.body.records.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('totalOfRecords');
    expect(res.body.totalOfRecords).toBeGreaterThan(0);
  });
});

describe('users.getById', () => {
  let accessToken: string | undefined = undefined;
  let userId: string | number | undefined = undefined;
  beforeAll(async () => {
    const resCreate = await testServer.post('/sign-up').send({
      name: 'Get User',
      email: 'get.user@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'get.user@mail.com',
      password: '123456.sS',
    });
    userId = resCreate.body.id;
    accessToken = signIn.body.accessToken;
  });
  it('success', async () => {
    const res = await testServer
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('name', 'Get User');
  });
  it('string param', async () => {
    const res = await testServer
      .get('/users/string')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer
      .get('/users/99999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('users.updateById', () => {
  let accessToken: string | undefined = undefined;
  let userId: string | number | undefined = undefined;
  beforeAll(async () => {
    const resCreate = await testServer.post('/sign-up').send({
      name: 'Update User',
      email: 'update.user@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'update.user@mail.com',
      password: '123456.sS',
    });
    userId = resCreate.body.id;
    accessToken = signIn.body.accessToken;
  });
  it('success', async () => {
    const res = await testServer
      .put(`/users/${userId}`)
      .send({
        name: 'Updated User',
        email: 'updated.user@mail.com',
        password: '123456.sS',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('with email already registered', async () => {
    const resCreateNew = await testServer
      .post('/sign-up')
      .send({
        name: 'Update User',
        email: 'update.user.same@mail.com',
        password: '123456.sS',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreateNew.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .put(`/users/${userId}`)
      .send({
        name: 'Updated User',
        email: 'update.user.same@mail.com',
        password: '123456.sS',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('string param', async () => {
    const res = await testServer
      .get('/users/string')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer
      .get('/users/99999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});
