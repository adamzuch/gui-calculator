import { last } from '../utils'

type Operator = '+' | '-' | '*' | '/'

const OPERATORS: Operator[] = ['+', '-', '*', '/']

// eslint-disable-next-line no-unused-vars
const OPERATOR_PRECEDENCE: { [key in Operator]: number } = {
  '*': 3,
  '/': 3,
  '+': 2,
  '-': 2,
}
// eslint-disable-next-line no-unused-vars
const OPERATOR_EVAL: { [key in Operator]: (a: number, b: number) => number } = {
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
}

export function calculate(tokens: string[]) {
  const postfix = infixToPostfix(tokens)
  const res = evaluatePostfix(postfix)

  return res
}

/**
 * Basic implementation of Shunting yard algorithm converting infix notation to postfix (Reverse Polish notation).
 */
function infixToPostfix(tokens: string[]) {
  const output: string[] = []
  const operatorStack: Operator[] = []

  for (const token of tokens) {
    if (isOperator(token)) {
      const currOperator = token
      let prevOperator = last(operatorStack)
      while (
        prevOperator !== undefined &&
        getPrecedence(prevOperator) >= getPrecedence(currOperator)
      ) {
        operatorStack.pop()
        output.push(prevOperator)
        prevOperator = last(operatorStack)
      }
      operatorStack.push(currOperator)
    } else {
      output.push(token)
    }
  }

  while (operatorStack.length > 0) {
    const operator = operatorStack.pop()
    if (operator !== undefined) {
      output.push(operator)
    }
  }

  return output
}

/**
 * Evaluate expression using tokens expressed in postfix notation.
 */
function evaluatePostfix(tokens: string[]) {
  const stack: number[] = []

  for (const token of tokens) {
    if (isOperator(token)) {
      const b = stack.pop()
      const a = stack.pop()
      if (a !== undefined && b !== undefined) {
        const res = OPERATOR_EVAL[token](a, b)
        stack.push(res)
      }
    } else {
      stack.push(parseInt(token))
    }
  }
  return stack.pop()
}

function getPrecedence(operator: Operator) {
  return OPERATOR_PRECEDENCE[operator] ?? -1
}

function isOperator(token: string): token is Operator {
  return OPERATORS.includes(token as Operator)
}
