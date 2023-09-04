import { StatusCodes } from 'http-status-codes';
import { testServer } from './jest.setup';

describe('clients.create', () => {
  let cityId: number | undefined = undefined;
  beforeAll(async () => {
    const resCity = await testServer.post('/cities').send({
      name: 'Test City',
      stateId: 1,
    });
    cityId = resCity.body.id;
  });

  it('success', async () => {
    const res = await testServer.post('/clients').send({
      name: 'Create Client',
      email: 'create.client@mail.com',
      cityId,
    });
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');
  });
  it('without name', async () => {
    const res = await testServer.post('/clients').send({
      email: 'create.client@mail.com',
      cityId,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without email', async () => {
    const res = await testServer.post('/clients').send({
      name: 'Create Client',
      cityId,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('invalid email', async () => {
    const res = await testServer.post('/clients').send({
      name: 'Create Client',
      email: 'create.client',
      cityId,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('with email already registered', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'Create Client',
      email: 'create.client.same@mail.com',
      cityId,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.post('/clients').send({
      name: 'Create Client',
      email: 'create.client.same@mail.com',
      cityId,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without city', async () => {
    const res = await testServer.post('/clients').send({
      name: 'Create Client',
      email: 'create.client@mail.com',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without body', async () => {
    const res = await testServer.post('/clients').send({});
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(3);
  });
  it('with unknown city', async () => {
    const res = await testServer.post('/clients').send({
      name: 'Create Client',
      email: 'create.client@mail.com',
      cityId: 9999,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to short', async () => {
    const res = await testServer.post('/clients').send({
      name: 'CC',
      email: 'create.client@mail.com',
      cityId,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to long', async () => {
    const res = await testServer.post('/clients').send({
      name: 'Create Client 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890',
      email: 'create.client@mail.com',
      cityId,
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('clients.delete', () => {
  let cityId: number | undefined = undefined;
  beforeAll(async () => {
    const resCity = await testServer.post('/cities').send({
      name: 'Test City',
      stateId: 1,
    });
    cityId = resCity.body.id;
  });

  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'Delete Client',
      email: 'delete.client@mail.com',
      cityId,
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
  let cityId: number | undefined = undefined;
  beforeAll(async () => {
    const resCity = await testServer.post('/cities').send({
      name: 'Test City',
      stateId: 1,
    });
    cityId = resCity.body.id;
  });

  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'Get All Client',
      email: 'get.all.client@mail.com',
      cityId,
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
  let cityId: number | undefined = undefined;
  beforeAll(async () => {
    const resCity = await testServer.post('/cities').send({
      name: 'Test City',
      stateId: 1,
    });
    cityId = resCity.body.id;
  });

  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'Get Client',
      email: 'get.client@mail.com',
      cityId,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.get(`/clients/${resCreate.body.id}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('name', 'Get Client');
    expect(res.body).toHaveProperty('cityId', cityId);
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
  let cityId: number | undefined = undefined;
  beforeAll(async () => {
    const resCity = await testServer.post('/cities').send({
      name: 'Test City',
      stateId: 1,
    });
    cityId = resCity.body.id;
  });

  it('success', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'Update Client',
      email: 'update.client@mail.com',
      cityId,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .put(`/clients/${resCreate.body.id}`)
      .send({
        name: 'Updated Client',
        email: 'updated.client@mail.com',
        cityId,
      });
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('with email already registered', async () => {
    const resCreate = await testServer.post('/clients').send({
      name: 'Update Client',
      email: 'update.client@mail.com',
      cityId,
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const resCreateNew = await testServer.post('/clients').send({
      name: 'Update Client',
      email: 'update.client.same@mail.com',
      cityId,
    });
    expect(resCreateNew.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .put(`/clients/${resCreate.body.id}`)
      .send({
        name: 'Updated Client',
        email: 'update.client.same@mail.com',
        cityId,
      });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
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
