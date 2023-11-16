import { useState } from 'react'

import { Button } from '../components/Button'
import { calculate, isOperator } from './calculate'
import { last } from '../utils'

export function Calculator() {
  const [tokens, setTokens] = useState<string[]>([])

  console.log('tokens', tokens)

  const evaluate = () => {
    const res = calculate(tokens)
    setTokens([String(res)])
  }

  const clear = () => {
    setTokens([])
  }

  const clearEntry = () => {
    const lastToken = last(tokens)
    if (lastToken !== undefined) {
      if (lastToken.length === 1) {
        removeLastToken()
      } else if (lastToken.length > 1) {
        removeDigitFromLastToken()
      }
    }
  }

  const removeLastToken = () => {
    setTokens(tokens.slice(0, -1))
  }

  const removeDigitFromLastToken = () => {
    const lastToken = last(tokens)
    if (lastToken !== undefined) {
      setTokens([...tokens.slice(0, -1), lastToken.slice(0, -1)])
    }
  }

  const enterOperator = (operator: string) => {
    const lastToken = last(tokens)

    const isLastTokenDigit = lastToken !== undefined && !isOperator(lastToken)

    // exception for '-' so we allow operations on negative numbers. Don't allow double negatives.
    const isOperatorUnaryNegative =
      operator === '-' && (lastToken === undefined || lastToken !== '-')

    if (isLastTokenDigit || isOperatorUnaryNegative) {
      setTokens(tokens.concat(operator))
    }
  }

  const enterDigit = (digit: number) => {
    const lastToken = last(tokens)
    const secondLastToken = last(tokens, 1)

    const isLastTokenZero = lastToken !== undefined && lastToken === '0'
    const isLastTokenDigit = lastToken !== undefined && !isOperator(lastToken)

    // we can detect unary negative operator if lastToken '-' is the only token OR,
    // the token before it is an operator.
    const isLastTokenUnaryNegative =
      lastToken !== undefined &&
      lastToken === '-' &&
      (tokens.length === 1 ||
        (secondLastToken !== undefined && isOperator(secondLastToken)))

    if (isLastTokenZero) {
      // remove leading zero
      setTokens([...tokens.slice(0, -1), String(digit)])
    } else if (isLastTokenDigit || isLastTokenUnaryNegative) {
      // append digit to the last token instead of creating a new token
      setTokens([...tokens.slice(0, -1), lastToken + String(digit)])
    } else {
      setTokens(tokens.concat(String(digit)))
    }
  }

  const enterPeriod = () => {
    const lastToken = last(tokens)

    if (lastToken === undefined) {
      setTokens(tokens.concat('.'))
    } else if (!lastToken.includes('.')) {
      setTokens([...tokens.slice(0, -1), lastToken + '.'])
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-9 text-xl">
      <input
        data-testid="calculator-screen"
        readOnly
        className="text-right block w-full rounded-2xl py-2 px-4 h-16 text-black border-2 shadow-sm border-neutral-100 placeholder:text-gray-500 focus:ring-4 focus:ring-inset focus:ring-amber-500 focus:outline-none"
        value={tokens.map(getDisplayToken).join('')}
        placeholder="0"
        onChange={() => {}}
      />

      <div className="flex gap-3">
        <div className="grid grid-cols-4 gap-3">
          {[7, 8, 9].map((digit) => (
            <Button
              key={digit}
              variant="tertiary"
              onClick={() => enterDigit(digit)}
            >
              {digit}
            </Button>
          ))}
          <Button variant="secondary" onClick={() => enterOperator('/')}>
            {getDisplayToken('/')}
          </Button>
          {[4, 5, 6].map((digit) => (
            <Button
              key={digit}
              variant="tertiary"
              onClick={() => enterDigit(digit)}
            >
              {digit}
            </Button>
          ))}
          <Button variant="secondary" onClick={() => enterOperator('*')}>
            {getDisplayToken('*')}
          </Button>
          {[1, 2, 3].map((digit) => (
            <Button
              key={digit}
              variant="tertiary"
              onClick={() => enterDigit(digit)}
            >
              {digit}
            </Button>
          ))}
          <Button variant="secondary" onClick={() => enterOperator('-')}>
            {getDisplayToken('-')}
          </Button>
          <Button variant="tertiary" onClick={() => enterDigit(0)}>
            {0}
          </Button>
          <Button variant="secondary" onClick={enterPeriod}>
            .
          </Button>
          <Button variant="primary" onClick={evaluate}>
            =
          </Button>
          <Button variant="secondary" onClick={() => enterOperator('+')}>
            {getDisplayToken('+')}
          </Button>
        </div>
        <div
          data-testid="ce"
          className="flex flex-col gap-3 justify-start items-start"
        >
          <Button variant="destructive" onClick={clearEntry}>
            ←
          </Button>
          <Button variant="destructive" onClick={clear}>
            C
          </Button>
        </div>
      </div>
    </div>
  )
}

const getDisplayToken = (token: string) => {
  if (token === '/') {
    return '÷'
  } else if (token === '*') {
    return '×'
  } else {
    return token
  }
}
