const { basicCampaign, isBirthday, isPurchaseGreaterThan } = require('../index');

describe('birthday campaign', () => {

    it('is birthday', () => {
        const user = { birthday: new Date() };
        const res = isBirthday.requirement([], user, null, null);
        expect(res).toBe(true);
    });

    // Try with different dates a few times to be sure
    it('is birthday', () => {
        for (let i = 0; i < 10; i++) {
            const bd = new Date();
            bd.setFullYear(2005 - i);
            const user = { birthday: bd };
            const res = isBirthday.requirement([], user, null, null);
            expect(res).toBe(true);
        }
    });

    it('is not birthday (day)', () => {
        for (let i = 1; i < 28; i++) {
            const bd = new Date();
            bd.setFullYear(2010 - i);
            bd.setDate(bd.getDate() === i ? 28 : i);
            const user = { birthday: bd };
            const res = isBirthday.requirement([], user, null, null);
            expect(res).toBeFalsy();
        }
    });

    it('is not birthday (month)', () => {
        for (let i = 0; i < 11; i++) {
            const bd = new Date();
            bd.setFullYear(2010 - i);
            bd.setMonth(bd.getMonth() === i ? 11 : i);
            const user = { birthday: bd };
            const res = isBirthday.requirement([], user, null, null);
            expect(res).toBeFalsy();
        }
    })

});

describe('purchase greater than x campaign', () => {

    it('has question', () => {
        expect(isPurchaseGreaterThan.question.length).toBeGreaterThan(10);
    });

});

describe('basic campaign', () => {

    it('does not have "requirement" function', () => {
        expect(basicCampaign.requirement).toBeUndefined()
    });

});