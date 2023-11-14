import { describe, it, expect } from 'vitest'

import { evaluatePostfix, infixToPostfix } from './calculator'

describe('calculator', () => {
  // TODO: add testing for unhappy paths
  it('converts tokens from infix to postfix notation', () => {
    const infix = ['1', '+', '2', '*', '3', '-', '4']
    const postfix = ['1', '2', '3', '*', '+', '4', '-']
    expect(infixToPostfix(infix)).toStrictEqual(postfix)
  })

  it('evaluates postfix notation', () => {
    const tokens = ['1', '2', '3', '*', '+', '4', '-']

    expect(evaluatePostfix(tokens)).toBe(3)
  })
})
