const validators = require('../src/helpers/bodyFilter');

// USER
describe('user', () => {

    it('should validate #1', () => {
        const data = {
            email: 'example@email.com',
            password: 'password123',
            birthday: '2001-01-17'
        }
        const clone = { ...data };
        validators.userValidator(clone);
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

    it('should validate #2', () => {
        const data = {
            email: 'maija.meikalainen123@jonne.es',
            password: '=(#!+07CKJH"',
            birthday: '1999-01-17'
        }
        const clone = { ...data };
        validators.userValidator(clone);
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

});

// BUSINESS
describe('business', () => {

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

    it('should validate', () => {
        const clone = { ...data };
        validators.businessValidator(clone)
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

    it("should not validate (can't change plan)", () => {
        expect.assertions(1);
        const business = {
            ...data,
            plan: { type: 'premium' }
        };
        const clone = { ...business }
        validators.businessValidator(clone)
        return expect(clone.plan).toBeUndefined();
    });

});

// BUSINESS ROLE
describe('business role', () => {

    it('should validate (role: user)', () => {
        const data = {
            role: 'user',
            userId: '5e222ac86e9aa80b23b4886c'
        }
        const clone = { ...data };
        validators.businessRoleValidator(clone);
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

    it('should validate (role: business)', () => {
        const data = {
            role: 'business',
            userId: '5e222adae08de45c2c09455c'
        }
        const clone = { ...data };
        validators.businessRoleValidator(clone)
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

    it('should not validate (role)', () => {
        const data = {
            role: 'admin',
            userId: '5e222af22a5536252ec511c9',
        };
        const clone = { ...data }
        expect.assertions(1);
        return expect(() => validators.businessRoleValidator(clone)).toThrow();
    });

});


// PRODUCT
describe('product', () => {

    it('should validate (name only)', () => {
        const data = {
            name: 'A product'
        }
        const clone = { ...data };
        validators.productValidator(clone)
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

    it('should validate (all properties)', () => {
        const data = {
            name: 'A product',
            description: 'Liirum laarum',
            categories: ['5e222adae08de45c2c09455c'],
            images: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            price: 420.69
        }
        const clone = { ...data };
        validators.productValidator(clone);
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
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
        const clone = { ...data }
        validators.campaignValidator(clone)
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

});

// PURCHASE
describe('purchase', () => {

    it('should validate', () => {
        const data = {
            categories: ['5e222adae08de45c2c09455c'],
            products: ['5e222adae08de45c2c09455c'],
            userId: '5e222ac86e9aa80b23b4886c'
        }
        const clone = { ...data }
        validators.purchaseValidator(clone)
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });

});

// CUSTOMER PROPERTIES
describe('customer properties', () => {

    it('should validate', () => {
        const data = {
            points: 100
        }
        const clone = { ...data }
        validators.customerPropertiesValidator(clone)
        expect.assertions(1);
        return expect(clone).toStrictEqual(data);
    });
})
