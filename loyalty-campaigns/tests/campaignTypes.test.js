const { isBirthday, isPurchaseGreaterThan, stamps } = require('../index')

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

describe('stamps campaign', () => {

  // Current campaign
  const campaign1 = { id: '5eebc5b43c36700f335428d4', start: (Date.now() - 1000), end: (Date.now() + 120000) }
  const purchase1 = { createdAt: Date.now() }
  const purchase2 = { createdAt: (Date.now() - 60000) }

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
    expect(stamps.requirement({
      values: ['2'],
      purchase: {},
      customerData: { purchases: [purchase1] },
      campaign: campaign1
    })).toBeTruthy()
  })

  it('has 2 purchases, requires 2', () => {
    expect(stamps.requirement({
      values: ['2'],
      purchase: {},
      customerData: { purchases: [purchase1, purchase1] },
      campaign: campaign1
    })).toBeFalsy()
  })

  it('has 1 too old purchase, requires 2', () => {
    expect(stamps.requirement({
      values: ['2'],
      purchase: {},
      customerData: { purchases: [purchase2] },
      campaign: campaign1
    })).toBeFalsy()
  })

  it('campaign has no end, requires 1', () => {
    expect(stamps.requirement({
      values: ['1'],
      purchase: {},
      customerData: { purchases: [] },
      campaign: { id: '5eec74a71c780d72dc5d1374', start: (Date.now() - 5000) }
    })).toBeTruthy()
  })

})
