const jsep = require('jsep');

// Utility function for type checking
const isNumber = (value) => typeof value === 'number' && !isNaN(value);
const isString = (value) => typeof value === 'string';
const isBoolean = (value) => typeof value === 'boolean';

// Evaluate binary expressions
const evaluateBinaryExpression = (operator, left, right) => {
  switch (operator) {
    case '+':
      if (isString(left) || isString(right)) return `${left}${right}`;
      if (isNumber(left) && isNumber(right)) return left + right;
      break;
    case '-':
      if (isNumber(left) && isNumber(right)) return left - right;
      break;
    case '*':
      if (isNumber(left) && isNumber(right)) return left * right;
      break;
    case '/':
      if (isNumber(left) && isNumber(right)) {
        if (right === 0) throw new Error('Division by zero');
        return left / right;
      }
      break;
    case '%':
      if (isNumber(left) && isNumber(right)) {
        if (right === 0) throw new Error('Modulo by zero');
        return left % right;
      }
      break;
    case '>':
      if (isNumber(left) && isNumber(right)) return left > right;
      if (isString(left) && isString(right)) return left > right;
      break;
    case '<':
      if (isNumber(left) && isNumber(right)) return left < right;
      if (isString(left) && isString(right)) return left < right;
      break;
    case '>=':
      if (isNumber(left) && isNumber(right)) return left >= right;
      if (isString(left) && isString(right)) return left >= right;
      break;
    case '<=':
      if (isNumber(left) && isNumber(right)) return left <= right;
      if (isString(left) && isString(right)) return left <= right;
      break;
    case '==':
      return left == right;
    case '!=':
      return left != right;
    case '===':
      return left === right;
    case '!==':
      return left !== right;
    case '&&': // Logical AND
      return left && right;
    case '||': // Logical OR
      return left || right;
    default:
      throw new Error(`Unsupported binary operator: ${operator}`);
  }
  throw new Error(`Invalid operands for operator ${operator}: ${left} and ${right}`);
};

// Evaluate logical expressions
const evaluateLogicalExpression = (operator, left, right) => {
    switch (operator) {
      case '&&':
        return left && right;
      case '||':
        return left || right;
      default:
        throw new Error(`Unsupported logical operator: ${operator}`);
    }
  };
  

// Evaluate unary expressions
const evaluateUnaryExpression = (operator, argument) => {
  switch (operator) {
    case '-':
      if (isNumber(argument)) return -argument;
      break;
    case '!':
      return !argument;
    case '+':
      if (isNumber(argument)) return +argument;
      break;
    default:
      throw new Error(`Unsupported unary operator: ${operator}`);
  }
  throw new Error(`Invalid operand for unary operator ${operator}: ${argument}`);
};

// Main evaluation function for the AST
const evaluateAST = (ast, data) => {
  switch (ast.type) {
    case 'BinaryExpression':
        return evaluateBinaryExpression(
          ast.operator,
          evaluateAST(ast.left, data),
          evaluateAST(ast.right, data)
        );
      case 'LogicalExpression':
        return evaluateLogicalExpression(
          ast.operator,
          evaluateAST(ast.left, data),
          evaluateAST(ast.right, data)
        );
    case 'UnaryExpression':
      return evaluateUnaryExpression(
        ast.operator,
        evaluateAST(ast.argument, data)
      );
    case 'Literal':
      return ast.value;
    case 'Identifier':
      if (!(ast.name in data)) {
        throw new Error(`Undefined variable: ${ast.name}`);
      }
      return data[ast.name];
    case 'Compound':
      return ast.body.map(expr => evaluateAST(expr, data)).pop();
    case 'ConditionalExpression':
      return evaluateAST(ast.test, data)
        ? evaluateAST(ast.consequent, data)
        : evaluateAST(ast.alternate, data);
    default:
      throw new Error(`Unsupported AST node type: ${ast.type}`);
  }
};

// Parse a rule string into an AST
const parseRuleToAST = (ruleString) => {
  try {
    return jsep(ruleString); // Convert the string into AST
  } catch (error) {
    throw new Error('Invalid rule string syntax');
  }
};

// Parse and evaluate function
const parseAndEvaluate = (expression, data) => {
  try {
    const ast = jsep(expression);
    return evaluateAST(ast, data);
  } catch (error) {
    throw new Error(`Error evaluating expression "${expression}": ${error.message}`);
  }
};

// Evaluate a rule
const evaluateRule = (ruleId, expression, data) => {
  try {
    const result = parseAndEvaluate(expression, data);
    console.log(`Rule ${ruleId} evaluated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error evaluating rule ${ruleId}:`, error.message);
    throw error;
  }
};

module.exports = { evaluateRule, parseAndEvaluate, parseRuleToAST, evaluateAST,evaluateLogicalExpression };












































