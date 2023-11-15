import { useState } from 'react'

import { Button } from './Button'
import { calculate, OPERATORS, isOperator } from '../lib/calculator'
import { last } from '../utils'

const DIGITS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

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
    if (
      isLastTokenDigit ||
      (lastToken !== undefined &&
        isOperator(lastToken) &&
        lastToken !== '-' &&
        operator === '-') ||
      (tokens.length === 0 && operator === '-')
    ) {
      setTokens(tokens.concat(operator))
    }
  }

  const enterDigit = (digit: number) => {
    const lastToken = last(tokens)

    const isLastTokenZero = lastToken !== undefined && lastToken === '0'
    const isLastTokenDigit =
      (lastToken !== undefined && !isOperator(lastToken)) ||
      (lastToken !== undefined &&
        lastToken === '-' &&
        (tokens.length === 1 || isOperator(last(tokens, 1))))

    if (isLastTokenZero) {
      // remove leading zero
      setTokens([...tokens.slice(0, -1), String(digit)])
    } else if (!isLastTokenZero && isLastTokenDigit) {
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
    <div className="flex flex-col items-center justify-center gap-6">
      <input
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={tokens.join('')}
        placeholder="0"
        onChange={() => {}}
      />
      <div className="grid grid-cols-3 grid-rows-1 gap-3">
        <Button className="bg-red-500 w-fit" onClick={clear}>
          C
        </Button>

        <Button className="bg-red-500 w-fit" onClick={clearEntry}>
          CE
        </Button>

        <Button className="bg-green-500 w-fit" onClick={evaluate}>
          =
        </Button>
      </div>

      <div className="grid grid-cols-4 grid-rows-1 gap-3">
        {OPERATORS.map((operator) => (
          <Button key={operator} onClick={() => enterOperator(operator)}>
            {operator}
          </Button>
        ))}
      </div>

      <Button onClick={enterPeriod}>.</Button>

      <div className="grid grid-cols-3 grid-rows-3 gap-3">
        {DIGITS.map((digit) => (
          <Button key={digit} onClick={() => enterDigit(digit)}>
            {digit}
          </Button>
        ))}
      </div>
    </div>
  )
}
