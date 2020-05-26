const { initDatabase, closeDatabase } = require('./testUtils');
const Category = require('../src/models/category');
const app = require('../app');
const api = require('supertest')(app);

let testCategory;

beforeAll(async () => {
    await initDatabase('category');

    testCategory = new Category({ official: true, name: "haircut" });
    await testCategory.save();

});

describe('Category API: ', () => {

    it('create pizza category', async () => {
        const res = await api
            .post('/category')
            .send({ name: 'pizza', official: true })
            .expect(200)
        expect(res.body.name).toEqual('pizza');
        expect(res.body.official).toBeFalsy();
    });

    it('find haircut', async () => {
        const res = await api
            .get('/category/?query=haircut')
            .expect(200)
        const category = res.body[0];
        expect(category._id).toBe(testCategory.id);
    });

    it('find by id', async () => {
        const res = await api
            .get(`/category/${testCategory.id}`)
            .expect(200)
        expect(res.body.name).toEqual(testCategory.name);
    });

    it('not find pizza', async () => {
        const res = await api
            .get('/category/?query=pizza')
            .expect(200)
        expect(res.body.name).toBeUndefined();
    });
});

afterAll(() => {
    closeDatabase();
});