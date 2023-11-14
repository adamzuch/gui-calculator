// while there are tokens to be read:
//     read a token
//     if the token is:
//     - a number:
//         put it into the output queue
//     - an operator o1:
//         while (
//             (o2 has greater precedence than o1 or (o1 and o2 have the same precedence and o1 is left-associative)
//         ):
//             pop o2 from the operator stack into the output queue
//         push o1 onto the operator stack
//
// /* After the while loop, pop the remaining items from the operator stack into the output queue. */
// while there are tokens on the operator stack:
//     pop the operator from the operator stack onto the output queue

import { last } from './utils'

export function infixToPostfix(tokens: string[]) {
  const outputQueue: string[] = []
  const operatorStack: string[] = []

  for (const token of tokens) {
    if (isNumeric(token)) {
      outputQueue.push(token)
    } else if (operators.includes(token)) {
      const o1 = token
      let o2 = last(outputQueue)
      while (o2 !== undefined && getPrecedence(o2) >= getPrecedence(o1)) {
        if (operatorStack.length > 0) {
          const top = operatorStack.pop()
          if (top !== undefined) {
            outputQueue.push(top)
          } else {
            throw Error()
          }
        }
        o2 = last(outputQueue)
      }
      operatorStack.push(o1)
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()
    if (top !== undefined) {
      outputQueue.push(top)
    } else {
      throw Error()
    }
  }

  return outputQueue
}

const operators = ['+', '-', '*', '/']

const precedence: { [key: string]: number } = { '*': 3, '/': 3, '+': 2, '-': 2 }

function getPrecedence(s: string) {
  return precedence[s] ?? -1
}

function isNumeric(s: string) {
  return !operators.includes(s)
}
