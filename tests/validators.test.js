const validators = require('../src/helpers/validation');

// USER
describe('user', () => {

    it('should validate #1', async () => {
        const data = {
            email: 'example@email.com',
            password: 'password123',
            birthday: '2001-01-17'
        }
        expect.assertions(1);
        return expect(validators.userValidator(data)).resolves.toBe(data);
    });

    it('should validate #2', () => {
        const data = {
            email: 'maija.meikalainen123@jonne.es',
            password: '=(#!+07CKJH"',
            birthday: '1999-01-17'
        }
        expect.assertions(1);
        return expect(validators.userValidator(data)).resolves.toBe(data);
    });

    it('should not validate (additional properties)', () => {
        expect.assertions(1);
        return expect(validators.userValidator({
            email: 'teppo',
            password: 'password123',
            birthday: '1999-01-17',
            role: 'admin'
        })).rejects.toThrow();
    });

    it('should not validate (invalid email)', () => {
        expect.assertions(1);
        return expect(validators.userValidator({
            email: 'teppo',
            password: 'password123',
            birthday: '1999-01-17'
        })).rejects.toThrow();
    });

    it('should not validate (password)', () => {
        expect.assertions(1);
        return expect(validators.userValidator({
            email: 'example@email.com',
            password: 'kissa',
            birthday: '1999-01-17'
        })).rejects.toThrow();
    });

    it('should not validate (birthday)', () => {
        expect.assertions(1);
        return expect(validators.userValidator({
            email: 'teppo',
            password: 'password123',
            birthday: '1999-01-17T21:09:01.786Z'
        })).rejects.toThrow();
    });

    it('should not validate (birthday)', () => {
        expect.assertions(1);
        return expect(validators.userValidator({
            email: 'example@email.com',
            password: 'password123',
            birthday: 'kolmas toukokuuta'
        })).rejects.toThrow();
    });

});

// BUSINESS
describe('business', () => {

    it('should validate', () => {
        const data = {
            email: 'test@email.com',
            config: {
                will: 'add',
                stuff: 'here'
            },
            public: {
                address: 'Country Street 69 something',
                openingHours: [{
                    dayOfWeek: 1,
                    opens: '9:00',
                    closes: '18:00',
                    validFrom: new Date().toISOString(),
                    // skip for now
                    //validThrough:
                }],
                customerLevels: [
                    { name: 'Silver', requiredPoints: 200 },
                    { name: 'Gold', requiredPoints: 500, },
                    { name: 'Platinum', requiredPoints: 1000 }
                ]
            }
        }
        validators.businessValidator(data).catch(err => console.log(err))
        expect.assertions(1);
        return expect(validators.businessValidator(data)).resolves.toBe(data);
    });

});

// BUSINESS ROLE
describe('business role', () => {

    it('should validate (role: user)', () => {
        const data = {
            role: 'user',
            userId: '5e222ac86e9aa80b23b4886c'
        }
        expect.assertions(1);
        return expect(validators.businessRoleValidator(data)).resolves.toBe(data);
    });

    it('should validate (role: business)', () => {
        const data = {
            role: 'business',
            userId: '5e222adae08de45c2c09455c'
        }
        expect.assertions(1);
        return expect(validators.businessRoleValidator(data)).resolves.toBe(data);
    });

    it('should not validate (additional properties)', () => {
        expect.assertions(1);
        return expect(validators.businessRoleValidator({
            role: 'god',
            userId: '5e222af22a5536252ec511c9',
            admin: true
        })).rejects.toThrow();
    });

    it('should not validate (invalid role)', () => {
        expect.assertions(1);
        return expect(validators.businessRoleValidator({
            role: 'god',
            userId: '5e222af22a5536252ec511c9'
        })).rejects.toThrow();
    });

    it('should not validate (role: admin)', () => {
        expect.assertions(1);
        return expect(validators.businessRoleValidator({
            role: 'admin',
            userId: '5e222b02b1a0a27618f4297e'
        })).rejects.toThrow();
    });

    it('should not validate (userId missing)', () => {
        expect.assertions(1);
        return expect(validators.businessRoleValidator({
            role: 'admin',
        })).rejects.toThrow();
    });

    it('should not validate (role missing)', () => {
        expect.assertions(1);
        return expect(validators.businessRoleValidator({
            userId: '5e222b8d938a59af918ad339'
        })).rejects.toThrow();
    });

    it('should not validate (invalid ObjectId)', () => {
        expect.assertions(1);
        return expect(validators.businessRoleValidator({
            userId: 'asd123'
        })).rejects.toThrow();
    });

});


// PRODUCT
describe('product', () => {

    it('should validate (name only)', () => {
        expect.assertions(1);
        const data = {
            name: 'A product'
        }
        return expect(validators.productValidator(data)).resolves.toBe(data);
    });

    it('should validate (all properties)', () => {
        const data = {
            name: 'A product',
            description: 'Liirum laarum',
            categories: ['5e222adae08de45c2c09455c'],
            images: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            price: 420.69
        }
        expect.assertions(1);
        return expect(validators.productValidator(data)).resolves.toBe(data);
    });

    it('should not validate (additional properties)', () => {
        expect.assertions(1);
        return expect(validators.productValidator({
            name: 'A product',
            description: 'Liirum laarum',
            categories: ['5e222adae08de45c2c09455c'],
            images: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            price: 420.69,
            additionalProperty: true
        })).rejects.toThrow();
    });

    it('should not validate (invalid uri)', () => {
        expect.assertions(1);
        return expect(validators.productValidator({
            name: 'A product',
            description: 'Liirum laarum',
            categories: ['5e222adae08de45c2c09455c'],
            images: ['heh'],
            price: 420.69
        })).rejects.toThrow();
    });

});

// CAMPAIGN
describe('campaign', () => {

    it('should validate', () => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        const data = {
            start: new Date().toISOString(),
            end: endDate.toISOString(),
            name: '6 month campaign',
            description: 'A nice desc',
            transactionPoints: 10,
            requirements: [{
                requirement: 'ifPurchaseGreaterThan',
                values: ['2€'],
            }],
            endReward: {
                name: 'Free Drink',
                description: 'Get a free drink (tea or coffee)',
                categories: ['5e222adae08de45c2c09455c'],
                itemDiscount: 'free',
                customerPoints: 100,
                requirements: 'Only from Monday to Friday'
            }
        }
        expect.assertions(1);
        return expect(validators.campaignValidator(data)).resolves.toBe(data);
    });

});

// PURCHASE
describe('purchase', () => {

    it('should validate', () => {
        const data = {
            category: '5e222adae08de45c2c09455c',
            userId: '5e222ac86e9aa80b23b4886c'
        }
        expect.assertions(1);
        return expect(validators.purchaseValidator(data)).resolves.toBe(data);
    });

    it('should not validate (invalid category ObjectID)', () => {
        expect.assertions(1);
        return expect(validators.purchaseValidator({
            category: 'not an ObjectId',
            userId: '5e222adae08de45c2c09455c',
        })).rejects.toThrow();
    });

    it('should not validate (invalid userId ObjectID)', () => {
        expect.assertions(1);
        return expect(validators.purchaseValidator({
            category: '5e222adae08de45c2c09455c',
            userId: 'not an ObjectId',
        })).rejects.toThrow();
    });

    it('should not validate (additional properties)', () => {
        expect.assertions(1);
        return expect(validators.purchaseValidator({
            category: '5e222adae08de45c2c09455c',
            userId: '5e222ac86e9aa80b23b4886c',
            admin: true
        })).rejects.toThrow();
    });

});

// CUSTOMER PROPERTIES
describe('customer properties', () => {

    it('should validate', () => {
        const data = {
            points: 100
        }
        expect.assertions(1);
        return expect(validators.customerPropertiesValidator(data)).resolves.toBe(data);
    });
})
