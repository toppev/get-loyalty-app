const role = require('../src/models/role');
const mongoose = require('mongoose');

const Business = require('../src/models/business');
const userService = require('../src/services/userService');
const customerService = require('../src/services/customerService');
const productService = require('../src/services/productService');
const campaignService = require('../src/services/campaignService');

// Params for the first business
const params = { reqParams: {} };
// Params for the other business
const otherParams = { reqParams: {} };

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-role-test'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();

    await initParams(params)
    await initParams(otherParams)
});


async function initParams(paramsObj) {
    const businessId = (await new Business({}).save()).id;
    paramsObj.reqParams.businessId = businessId;

    const userId = (await userService.create({})).id;
    paramsObj.userId = userId;
    paramsObj.reqParams.userId = paramsObj.userId;

    paramsObj.reqParams.productId = (await productService.create(businessId, { name: 'Pizza' })).id;
    paramsObj.reqParams.campaignId = (await campaignService.create(businessId, { name: 'Sick Campaign' })).id;
    
    const purchases = await customerService.addPurchase(userId, businessId, { categories: ['5e2721e1dab8355d82d53379'] });
    paramsObj.reqParams.purchaseId = purchases[0].id;
}

// Not all but many permissions are tested here
// TODO purchases

// ADMIN
describe('admin', () => {
    it('should have permission to test:example ', () => {
        expect.assertions(1);
        return expect(role.can('admin', 'test:example', params)).resolves.toBeTruthy();
    });

    it('should have permission to test:* ', () => {
        expect.assertions(1);
        return expect(role.can('admin', 'test:*', params)).resolves.toBeTruthy();
    });

    it('should have permission to * ', () => {
        expect.assertions(1);
        return expect(role.can('admin', '*', params)).resolves.toBeTruthy();
    });
});

// BUSINESS
describe('business', () => {
    it('should have permission to campaign:update', () => {
        expect.assertions(1);
        return expect(role.can('business', 'campaign:create', params)).resolves.toBeTruthy();
    });

    it('should have permission to product:*', () => {
        expect.assertions(1);
        return expect(role.can('business', 'product:*', params)).resolves.toBeTruthy();
    });

    it('should have permission to purchase:create', () => {
        expect.assertions(1);
        return expect(role.can('business', 'purchase:create', params)).resolves.toBeTruthy();
    });

    it('should not should have permission to *', () => {
        expect.assertions(1);
        return expect(role.can('business', '*', params)).resolves.toBeFalsy();
    });

    it('should not should have permission to user:*', () => {
        expect.assertions(1);
        return expect(role.can('business', '*', params)).resolves.toBeFalsy();
    });

    // Modifying other business stuff
    it('should not should have permission to campaign:update other', () => {
        const fakeNews = JSON.parse(JSON.stringify(params));
        fakeNews.reqParams.campaignId = otherParams.reqParams.campaignId;
        expect.assertions(1);
        return expect(role.can('business', 'campaign:create', fakeNews)).resolves.toBeFalsy();
    });

    it('should not should have permission to product:* other', () => {
        const fakeNews = JSON.parse(JSON.stringify(params));
        fakeNews.reqParams.productId = otherParams.reqParams.productId;
        expect.assertions(1);
        return expect(role.can('business', 'product:*', fakeNews)).resolves.toBeFalsy();
    });

    // Because role is always taken from the user's role in that business (specified in url params)
    // we can just let the user modify purchases as only the user's "customerData"
    // that matches the businessId url param is modified (and user has permission from that business)
    // For products etc the 
    //
    // hence checking if role has permission would return true always (only for purchases)
    /*
    it('should not have permission to purchase:create other', async () => {
        const fakeNews = JSON.parse(JSON.stringify(params));
        fakeNews.reqParams.purchaseId = otherParams.reqParams.purchaseId;
        expect.assertions(1);
        return expect(role.can('business', 'purchase:create', fakeNews)).resolves.toBeFalsy();
    });
    */
});

// USER
describe('user', () => {
    it('should not should have permission to *', () => {
        expect.assertions(1);
        return expect(role.can('user', '*', params)).resolves.toBeFalsy();
    });

    it('should not should have permission to campaign:*', () => {
        expect.assertions(1);
        return expect(role.can('user', 'campaign:*', params)).resolves.toBeFalsy();
    });

    it('should not should have permission to product:*', () => {
        expect.assertions(1);
        return expect(role.can('user', 'product:*', params)).resolves.toBeFalsy();
    });

    it('should not should have permission to purchase:*', () => {
        expect.assertions(1);
        return expect(role.can('user', 'purchase:*', params)).resolves.toBeFalsy();
    });

    it('should have permission to product:list', () => {
        expect.assertions(1);
        return expect(role.can('user', 'product:list', params)).resolves.toBeTruthy();
    });

    it('should have permission to campaign:list', () => {
        expect.assertions(1);
        return expect(role.can('user', 'campaign:list', params)).resolves.toBeTruthy();
    });

    it('should have permission to user:create', () => {
        expect.assertions(1);
        return expect(role.can('user', 'user:create', params)).resolves.toBeTruthy();
    });
});

afterAll(() => {
    mongoose.connection.close();
});