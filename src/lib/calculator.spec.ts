import { describe, it, expect } from 'vitest'

import { calculate } from './calculator'

describe('calculator', () => {
  // TODO: add testing for unhappy paths
  it('calculates correctly', () => {
    const expression = ['1', '+', '2', '*', '3', '-', '4']

    expect(calculate(expression)).toBe(3)
  })
})
