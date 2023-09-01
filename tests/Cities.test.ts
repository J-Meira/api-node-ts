import { StatusCodes } from 'http-status-codes';
import { testServer } from './jest.setup';

describe('cities.create', () => {
  it('success', async () => {
    const res = await testServer.post('/cities').send({
      name: 'New York',
      stateId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');
  });
  it('without name', async () => {
    const res = await testServer.post('/cities').send({
      stateId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without state', async () => {
    const res = await testServer.post('/cities').send({
      name: 'New York',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to short', async () => {
    const res = await testServer.post('/cities').send({
      name: 'Ne',
      stateId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to long', async () => {
    const res = await testServer.post('/cities').send({
      name: 'New York City is here hue hue hue hue hue hue hue hue hue hue',
      stateId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('cities.delete', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/cities').send({
      name: 'New York',
      stateId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.delete(`/cities/${resCreate.body.id}`);
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('string param', async () => {
    const res = await testServer.delete('/cities/string');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer.delete('/cities/99999');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without param', async () => {
    const res = await testServer.delete('/cities');
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('cities.getAll', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/cities').send({
      name: 'New York',
      stateId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.get('/cities');
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('records');
    expect(res.body.records.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('totalOfRecords');
    expect(res.body.totalOfRecords).toBeGreaterThan(0);
  });
});

describe('cities.getById', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/cities').send({
      name: 'New York',
      stateId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.get(`/cities/${resCreate.body.id}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('name', 'New York');
    expect(res.body).toHaveProperty('stateId', 1);
  });
  it('string param', async () => {
    const res = await testServer.get('/cities/string');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer.get('/cities/99999');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('cities.updateById', () => {
  it('success', async () => {
    const resCreate = await testServer.post('/cities').send({
      name: 'New York',
      stateId: 1,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.put(`/cities/${resCreate.body.id}`).send({
      name: 'New York City',
      stateId: 1,
    });
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('string param', async () => {
    const res = await testServer.get('/cities/string');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer.get('/cities/99999');
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});
