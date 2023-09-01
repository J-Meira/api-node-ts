import { StatusCodes } from 'http-status-codes';
import { testServer } from './jest.setup';

describe('clients.create', () => {
  it('success', async () => {
    const res = await testServer.post('/clients').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      cityId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');
  });
  it('without name', async () => {
    const res = await testServer.post('/clients').send({
      cityId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without state', async () => {
    const res = await testServer.post('/clients').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to short', async () => {
    const res = await testServer.post('/clients').send({
      name: 'Ne',
      email: 'john.doe@mail.com',
      cityId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to long', async () => {
    const res = await testServer.post('/clients').send({
      name: 'John Doe City is here hue hue hue hue hue hue hue hue hue hue',
      email: 'john.doe@mail.com',
      cityId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('clients.delete', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      cityId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.delete(`/clients/${resCreate.body.id}`);
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('string param', async () => {
    const res = await testServer.delete('/clients/string');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer.delete('/clients/99999');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without param', async () => {
    const res = await testServer.delete('/clients');
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('clients.getAll', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      cityId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.get('/clients');
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('records');
    expect(res.body.records.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('totalOfRecords');
    expect(res.body.totalOfRecords).toBeGreaterThan(0);
  });
});

describe('clients.getById', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      cityId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.get(`/clients/${resCreate.body.id}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('name', 'John Doe');
    expect(res.body).toHaveProperty('cityId', 1);
  });
  it('string param', async () => {
    const res = await testServer.get('/clients/string');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer.get('/clients/99999');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('clients.updateById', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      cityId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .put(`/clients/${resCreate.body.id}`)
      .send({
        name: 'John Doe City',
        email: 'john.doe@mail.com',
        cityId: 1,
      });
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('string param', async () => {
    const res = await testServer.get('/clients/string');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer.get('/clients/99999');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});
