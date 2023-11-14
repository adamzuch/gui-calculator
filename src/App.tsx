import React, { useState } from 'react'
import { cn } from './utils'
import { evaluatePostfix, infixToPostfix } from './calculator'

function App() {
  const [tokens, setTokens] = useState<string[]>([])

  const operators = ['+', '-', '*', '/']
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  console.log('tokens', tokens)

  return (
    <div className="p-16">
      <div className="flex flex-col items-center justify-center gap-6">
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={tokens.join('')}
          placeholder="0"
          onChange={() => {}}
        />
        <div className="grid grid-cols-3 grid-rows-1 gap-3">
          <Button className="bg-red-500 w-fit" onClick={() => setTokens([])}>
            C
          </Button>

          <Button
            className="bg-red-500 w-fit"
            onClick={() => {
              const last = tokens[tokens.length - 1]
              if (last?.length > 1) {
                setTokens([...tokens.slice(0, -1), last.slice(0, -1)])
              } else if (last?.length === 1) {
                setTokens(tokens.slice(0, -1))
              }
            }}
          >
            CE
          </Button>

          <Button
            className="bg-green-500 w-fit"
            onClick={() => {
              const rpn = infixToPostfix(tokens)
              console.log('rpn', rpn)
              const res = evaluatePostfix(rpn)
              console.log('res', res)

              setTokens([String(res)])
            }}
          >
            =
          </Button>
        </div>

        <div className="grid grid-cols-4 grid-rows-1 gap-3">
          {operators.map((operator) => (
            <Button
              key={operator}
              onClick={() => {
                const last = tokens[tokens.length - 1]
                if (last !== undefined && !operators.includes(last)) {
                  setTokens(tokens.concat(operator))
                }
              }}
            >
              {operator}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 grid-rows-3 gap-3">
          {numbers.reverse().map((number) => (
            <Button
              key={number}
              className=""
              onClick={() => {
                const last = tokens[tokens.length - 1]
                if (last !== undefined && last === '0') {
                  setTokens([...tokens.slice(0, -1), String(number)])
                } else if (last !== undefined && !operators.includes(last)) {
                  setTokens([...tokens.slice(0, -1), last + String(number)])
                } else {
                  setTokens(tokens.concat(String(number)))
                }
              }}
            >
              {number}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App

const Button = ({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={cn(
      'rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
      className
    )}
    {...rest}
  >
    {children}
  </button>
)
