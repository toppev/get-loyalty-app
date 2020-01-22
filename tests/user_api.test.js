const mongoose = require('mongoose');
const userService = require('../src/services/userService');
const User = require('../src/models/user');
const ResetPassword = require('../src/models/passwordReset');
const uuidv4 = require('uuid/v4');
const app = require('../app');
const api = require('supertest')(app);

const userParams = { email: "example@email.com", password: "password123" };
let userId;

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-user-test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
    userId = (await new User(userParams).save())._id;
});

describe('Not logged in user should', () => {

    it('register', async () => {
        const secondUserParams = { email: 'example2@email.com' };
        const res = await api
            .post('/user/register')
            .send(secondUserParams)
            .set('Accept', 'application/json')
            .expect(200);
        const user = await userService.getById(res.body._id);
        expect(user.email).toBe(secondUserParams.email);
    });

    it('forgotPassword', async () => {
        await api
            .post('/user/forgotpassword')
            .send(userParams)
            .set('Accept', 'application/json')
            .expect(200);
        const reset = await ResetPassword.findOne({})
        expect(reset.uuid).toEqual(expect.anything());
        expect(reset.userId).toEqual(expect.anything());
    });

    it('resetPassword', async () => {
        const uuid = uuidv4();
        const reset = new ResetPassword({ uuid, userId });
        await reset.save();
        const res = await api
            .get('/user/resetPassword/' + uuid)
            .expect(200);
        expect(res.body).toEqual({ success: true });
    });

    it('login (local)', async () => {
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        expect(res.body.email).toEqual(userParams.email);
    });

});

describe('Logged in user should', () => {

    // Storing cookies for session here
    let cookie;

    beforeAll(async () => {
        // Just use this to login for now
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        // Setting the cookie
        cookie = res.headers['set-cookie'];
    });

    it('profile', async () => {
        const res = await api
            .get('/user/profile')
            .set('Cookie', cookie)
            .expect(200);
        // Enough good
        expect(res.body.email).toEqual(userParams.email);
    });

    it('get self', async () => {
        const res = await api
            .get('/user/' + userId)
            .set('Cookie', cookie)
            .expect(200);
        // Enough good
        expect(res.body.email).toEqual(userParams.email);
    });

    it('patch self', async () => {
        const res = await api
            .patch('/user/' + userId)
            .set('Cookie', cookie)
            .send({ email: "example2@email.com" })
            .expect(200);
        expect(res.body.email).toEqual("example2@email.com");
        // And was saved in database
        const user = await userService.getById(res.body._id);
        expect(user.email).toEqual("example2@email.com");
    });

    it('logout', async () => {
        await api
            .get('/user/logout')
            .set('Cookie', cookie)
            .expect(200);
    });

    it('delete self', async () => {
        const res = await api
            .delete('/user/' + userId)
            .set('Cookie', cookie)
            .expect(200);
        const user = await userService.getById(res.body._id);
        expect(user).toBeNull();
    });

});

/*
* Testing patching, deleting and getting other users is not currently tested.
* Only site admins can do it anyway. Might implement later
*/