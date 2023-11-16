import { describe, it, expect, beforeEach } from 'vitest'
import { screen, render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Calculator } from './Calculator'

beforeEach(() => {
  render(<Calculator />)
})

describe('Calculator', () => {
  it('allows entering and deleting of digits and operators', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    expect(calculatorScreen).toHaveValue('')

    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('4'))
    expect(calculatorScreen).toHaveValue('2+4')

    fireEvent.click(screen.getByText('←'))
    expect(calculatorScreen).toHaveValue('2+')

    fireEvent.click(screen.getByText('C'))
    expect(calculatorScreen).toHaveValue('')
  })

  it('allows entering negatives but not double negatives', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    fireEvent.click(screen.getByText('-'))
    fireEvent.click(screen.getByText('-'))
    expect(calculatorScreen).toHaveValue('-')

    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('×'))
    fireEvent.click(screen.getByText('-'))
    fireEvent.click(screen.getByText('2'))
    expect(calculatorScreen).toHaveValue('-1×-2')
  })

  it('allows entering of decimal numbers', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('.'))
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('5'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('.'))
    fireEvent.click(screen.getByText('8'))
    expect(calculatorScreen).toHaveValue('2.25+.8')
  })

  it('does not allow entering binary operators initially', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('÷'))
    fireEvent.click(screen.getByText('×'))
    expect(calculatorScreen).toHaveValue('')
  })

  it('does not allow entering binary operators consecutively', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('÷'))
    fireEvent.click(screen.getByText('×'))
    expect(calculatorScreen).toHaveValue('3+')
  })

  it('does not allow entering periods consecutively', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    fireEvent.click(screen.getByText('.'))
    fireEvent.click(screen.getByText('.'))

    expect(calculatorScreen).toHaveValue('.')
  })

  it('calculates correctly, respecting order of operations', () => {
    const expressions = [
      { expr: ['1', '+', '2', '×', '3', '-', '4'], ans: '3' },
      { expr: ['9', '0', '÷', '9', '×', '3', '+', '7'], ans: '37' },
      { expr: ['1', '2', '6', '-', '5', '0', '×', '3'], ans: '-24' },
      { expr: ['3', '÷', '3', '×', '1', '-', '1', '+', '5', '0'], ans: '50' },
      { expr: ['-', '.', '5', '×', '-', '3'], ans: '1.5' },
      { expr: ['5', '+', '5', '÷', '5'], ans: '6' },
    ]

    const calculatorScreen = screen.getByTestId('calculator-screen')

    for (const { expr, ans } of expressions) {
      for (const token of expr) {
        fireEvent.click(screen.getByText(token))
      }
      fireEvent.click(screen.getByText('='))
      expect(calculatorScreen).toHaveValue(ans)
      fireEvent.click(screen.getByText('C'))
    }
  })

  it('shows error for malformed expressions or undefined results', () => {
    const expressions = [
      { expr: ['1', '+', '2', '×'] },
      { expr: ['1', '÷', '0'] },
    ]

    const calculatorScreen = screen.getByTestId('calculator-screen')

    for (const { expr } of expressions) {
      for (const token of expr) {
        fireEvent.click(screen.getByText(token))
      }
      fireEvent.click(screen.getByText('='))
      expect(calculatorScreen).toHaveValue('error')
      fireEvent.click(screen.getByText('C'))
    }
  })

  it('replaces leading zeroes when entering digits', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    fireEvent.click(screen.getByText('0'))
    fireEvent.click(screen.getByText('1'))
    expect(calculatorScreen).toHaveValue('1')

    fireEvent.click(screen.getByText('-'))
    fireEvent.click(screen.getByText('0'))
    fireEvent.click(screen.getByText('2'))
    expect(calculatorScreen).toHaveValue('1-2')
  })

  it('replaces error when entering tokens after an erroneous expression', () => {
    const calculatorScreen = screen.getByTestId('calculator-screen')

    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('÷'))
    fireEvent.click(screen.getByText('0'))
    fireEvent.click(screen.getByText('='))
    fireEvent.click(screen.getByText('1'))
    expect(calculatorScreen).not.toHaveValue('error1')
    expect(calculatorScreen).toHaveValue('1')

    fireEvent.click(screen.getByText('C'))

    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('÷'))
    fireEvent.click(screen.getByText('0'))
    fireEvent.click(screen.getByText('='))
    fireEvent.click(screen.getByText('.'))
    expect(calculatorScreen).not.toHaveValue('error.')
    expect(calculatorScreen).toHaveValue('.')

    fireEvent.click(screen.getByText('C'))

    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('÷'))
    fireEvent.click(screen.getByText('0'))
    fireEvent.click(screen.getByText('='))
    fireEvent.click(screen.getByText('-'))
    expect(calculatorScreen).not.toHaveValue('error.')
    expect(calculatorScreen).toHaveValue('-')
  })
})
