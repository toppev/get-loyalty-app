const { basicCampaign, isBirthday, isPurchaseGreaterThan, stamps } = require('../index')

describe('isBirthday campaign', () => {

    it('is birthday', () => {
        const user = { birthday: new Date() }
        const res = isBirthday.requirement({ user: user })
        expect(res).toBe(true)
    })

    // Try with different dates a few times to be sure
    it('is birthday', () => {
        for (let i = 0; i < 10; i++) {
            const bd = new Date()
            bd.setFullYear(2005 - i)
            const user = { birthday: bd }
            const res = isBirthday.requirement({ user: user })
            expect(res).toBe(true)
        }
    })

    it('is not birthday (day)', () => {
        for (let i = 1; i < 28; i++) {
            const bd = new Date()
            bd.setFullYear(2010 - i)
            bd.setDate(bd.getDate() === i ? 28 : i)
            const user = { birthday: bd }
            const res = isBirthday.requirement({ user: user })
            expect(res).toBeFalsy()
        }
    })

    it('is not birthday (month)', () => {
        for (let i = 0; i < 11; i++) {
            const bd = new Date()
            bd.setFullYear(2010 - i)
            bd.setMonth(bd.getMonth() === i ? 11 : i)
            const user = { birthday: bd }
            const res = isBirthday.requirement({ user: user })
            expect(res).toBeFalsy()
        }
    })

})

describe('isPurchaseGreaterThan campaign', () => {

    it('has question', () => {
        expect(isPurchaseGreaterThan.question.length).toBeGreaterThan(10)
    })

})

describe('basic campaign', () => {

    it('does not have "requirement" function', () => {
        expect(basicCampaign.requirement).toBeUndefined()
    })

})

describe('stamps campaign', () => {

    const campaign1 = { id: '5eebc5b43c36700f335428d4' }
    const campaign2 = { id: '5eebc5d6d8d37b456ec1f4e0' }

    it('invalid purchase does not trigger', () => {
        expect(stamps.requirement({ values: ['1'], customerData: { purchases: [] }, campaign: campaign1 })).toBeFalsy()
    })

    it('has 0 purchases, requires 1', () => {
        expect(stamps.requirement({
            values: [1],
            purchase: {},
            customerData: { purchases: [] },
            campaign: campaign1
        })).toBeTruthy()
    })

    it('has 1 purchase, requires 2', () => {
        const purchase = { campaigns: [campaign1.id] }
        expect(stamps.requirement({
            values: ['2'],
            purchase: {},
            customerData: { purchases: [purchase] },
            campaign: campaign1
        })).toBeTruthy()
    })

    it('has 2 purchases, requires 2', () => {
        const purchase = { campaigns: [campaign1.id] }
        expect(stamps.requirement({
            values: ['2'],
            purchase: {},
            customerData: { purchases: [purchase, purchase] },
            campaign: campaign1
        })).toBeFalsy()
    })

    it('has 1 purchase from other campaign, requires 2', () => {
        const purchase = { campaigns: [campaign2.id] }
        expect(stamps.requirement({
            values: ['2'],
            purchase: {},
            customerData: { purchases: [purchase] },
            campaign: campaign1
        })).toBeFalsy()
    })

})