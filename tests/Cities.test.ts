import { StatusCodes } from 'http-status-codes';
import { testServer } from './jest.setup';

describe('cities.create', () => {
  let accessToken: string | undefined = undefined;
  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;
  });

  it('success', async () => {
    const res = await testServer
      .post('/cities')
      .send({
        name: 'Create City',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');
  });
  it('without name', async () => {
    const res = await testServer
      .post('/cities')
      .send({
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without state', async () => {
    const res = await testServer
      .post('/cities')
      .send({
        name: 'Create City',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to short', async () => {
    const res = await testServer
      .post('/cities')
      .send({
        name: 'Ne',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to long', async () => {
    const res = await testServer
      .post('/cities')
      .send({
        name: 'Create City 1234567890 1234567890 1234567890 1234567890 1234567890',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('cities.delete', () => {
  let accessToken: string | undefined = undefined;
  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User ',
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;
  });

  it('success', async () => {
    const resCreate = await testServer
      .post('/cities')
      .send({
        name: 'Create City',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .delete(`/cities/${resCreate.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('string param', async () => {
    const res = await testServer
      .delete('/cities/string')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer
      .delete('/cities/99999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without param', async () => {
    const res = await testServer
      .delete('/cities')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('cities.getAll', () => {
  let accessToken: string | undefined = undefined;
  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;
  });

  it('success', async () => {
    const resCreate = await testServer
      .post('/cities')
      .send({
        name: 'Get All Cities',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .get('/cities')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('records');
    expect(res.body.records.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('totalOfRecords');
    expect(res.body.totalOfRecords).toBeGreaterThan(0);
  });
});

describe('cities.getById', () => {
  let accessToken: string | undefined = undefined;
  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;
  });

  it('success', async () => {
    const resCreate = await testServer
      .post('/cities')
      .send({
        name: 'Get City',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .get(`/cities/${resCreate.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('name', 'Get City');
    expect(res.body).toHaveProperty('stateId', 1);
  });
  it('string param', async () => {
    const res = await testServer
      .get('/cities/string')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer
      .get('/cities/99999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('cities.updateById', () => {
  let accessToken: string | undefined = undefined;
  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.cities@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;
  });

  it('success', async () => {
    const resCreate = await testServer
      .post('/cities')
      .send({
        name: 'Update City',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .put(`/cities/${resCreate.body.id}`)
      .send({
        name: 'Updated City',
        stateId: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('string param', async () => {
    const res = await testServer
      .get('/cities/string')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer
      .get('/cities/99999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});
