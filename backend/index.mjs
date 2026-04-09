import { calculate } from './calculate.js';

export const handler = async (event) => {
  let expression;
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    expression = body?.expression;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (typeof expression !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'expression required' }) };
  }

  try {
    const result = calculate(expression);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: String(err.message || err) }),
    };
  }
};
