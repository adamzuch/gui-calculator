import { describe, it, expect } from 'vitest'

import { calculate } from './calculator'

describe('calculator', () => {
  // TODO: add testing for unhappy paths
  it('calculates correctly with mixed operations', () => {
    const expressions = [
      { expression: ['1', '+', '2', '*', '3', '-', '4'], answer: 3 },
      { expression: ['90', '/', '9', '*', '3', '+', '7'], answer: 37 },
      { expression: ['126', '-', '50', '*', '3'], answer: -24 },
      {
        expression: ['3', '/', '3', '*', '1', '-', '1', '+', '50'],
        answer: 50,
      },
    ]

    for (const { expression, answer } of expressions) {
      expect(calculate(expression)).toBe(answer)
    }
  })
})
