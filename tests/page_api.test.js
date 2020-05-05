const mongoose = require('mongoose');
const businessService = require('../src/services/businessService');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const businessParams = { email: "example@email.com", public: { address: 'this is an address' } };
const userParams = { email: "example@email.com", password: "password123" };
let userId;

const testPageData = { gjs: { "gjs-components": ["stuff"], "gjs-style": ["more stuff"] } }
const updatedPageData = { gjs: { "gjs-components": ["differentStuff"], "gjs-style": ["more stuff"] } }
const updatedPageData2 = { gjs: { "gjs-components": ["differentStuff2"], "gjs-style": ["more different stuff"] } }

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-page-test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
});

describe('Logged in user with permissions can', () => {

    let cookie;
    let businessId;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParams).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        // Setting the cookie
        cookie = res.headers['set-cookie'];
        businessId = (await businessService.createBusiness(businessParams, userId)).id;
    });

    it('save page', async () => {
        const res = await api
            .post(`/business/${businessId}/page`)
            .set('Cookie', cookie)
            .send(testPageData)
            .expect(200);
        const resId = res.body._id;
        expect(resId).toBeDefined();
        // eslint-disable-next-line require-atomic-updates
        testPageData.id = resId;
    });

    it('update page', async () => {
        const res = await api
            .post(`/business/${businessId}/page/${testPageData.id}`)
            .set('Cookie', cookie)
            .send(updatedPageData)
            .expect(200);
    });

    it('get page', async () => {
        const res = await api
            .get(`/business/${businessId}/page/${testPageData.id}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.gjs).toStrictEqual(updatedPageData.gjs);
    });


    it('update page gjs only', async () => {
        const res = await api
            .post(`/business/${businessId}/page/${testPageData.id}/?gjsOnly=true`)
            .set('Cookie', cookie)
            .send(updatedPageData2.gjs)
            .expect(200);
    });

    it('get page gjs only', async () => {
        const res = await api
            .get(`/business/${businessId}/page/${testPageData.id}/?gjsOnly=true`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body).toStrictEqual(updatedPageData2.gjs);
    });

    it('list pages', async () => {
        const res = await api
            .get(`/business/${businessId}/page/list`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body[0].gjs).toBeFalsy();
        expect(res.body[0]._id).toBeTruthy();
    });

    it('upload page html', async () => {
        const res = await api
            .post(`/business/${businessId}/page/${testPageData.id}/upload`)
            .set('Cookie', cookie)
            .send({ html: '<p>test</p>' })
            .expect(200);
    });

    it('get page html', async () => {
        const res = await api
            .get(`/business/${businessId}/page/${testPageData.id}/html`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.text).toBe('<p>test</p>');
    });

    const htmlPage = `
    <div>
        <h1>Hello {{user.email}}!</h1>
        <br>
        <p>This is a test with åäö</p>
    </div>
    `;

    const pageCss = `
    h1 {
        color: red;
    }
    `;

    it('replace page html', async () => {
        const res = await api
            .post(`/business/${businessId}/page/${testPageData.id}/upload`)
            .set('Cookie', cookie)
            .send({ html: htmlPage, css: pageCss })
            .expect(200);
    });

    const expectedPage = `
    <div>
        <h1 style="color: red;">Hello ${userParams.email}!</h1>
        <br>
        <p>This is a test with åäö</p>
    </div>
    `;


    it('get page html with placeholder', async () => {
        const res = await api
            .get(`/business/${businessId}/page/${testPageData.id}/html`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.text).toBe(expectedPage);
    });

});

afterAll(() => {
    mongoose.connection.close();
    const { uploadDir } = require('../src/helpers/uploader');

    const fs = require('fs');
    const files = fs.readdirSync(uploadDir);
    if (files.length > 1) {
        console.log(`Warning: not deleting upload directory ${uploadDir} because it has more files than expected`)
    } else {
        files.forEach(file => {
            fs.unlinkSync(uploadDir + '/' + file);
        });
        fs.rmdirSync(uploadDir);
    }
});