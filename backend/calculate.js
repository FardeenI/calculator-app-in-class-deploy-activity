// Safe expression evaluator (moved from project root)
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ') { i++; continue; }
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let j = i + 1;
      while (j < expr.length && ((expr[j] >= '0' && expr[j] <= '9') || expr[j] === '.')) j++;
      tokens.push({ type: 'number', value: expr.slice(i, j) });
      i = j; continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '%' || ch === '(' || ch === ')') {
      tokens.push({ type: 'op', value: ch });
      i++; continue;
    }
    if (ch === 'x' || ch === 'X') { tokens.push({ type: 'op', value: '*' }); i++; continue; }
    if (ch === '÷') { tokens.push({ type: 'op', value: '/' }); i++; continue; }
    throw new Error('Invalid character in expression');
  }
  return tokens;
}

function toRPN(tokens) {
  const out = [];
  const ops = [];
  const prec = { '+': 2, '-': 2, '*': 3, '/': 3, '%': 3, 'u': 4 };
  const assoc = { '+': 'L', '-': 'L', '*': 'L', '/': 'L', '%': 'L', 'u': 'R' };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'number') { out.push(t); continue; }
    if (t.value === '(') { ops.push(t.value); continue; }
    if (t.value === ')') {
      while (ops.length && ops[ops.length-1] !== '(') out.push({ type: 'op', value: ops.pop() });
      if (!ops.length) throw new Error('Mismatched parentheses');
      ops.pop();
      continue;
    }
    let op = t.value;
    if (op === '-') {
      const prev = i === 0 ? null : tokens[i-1];
      if (!prev || (prev.type === 'op' && prev.value !== ')')) op = 'u';
    }
    while (ops.length) {
      const top = ops[ops.length-1];
      if (top === '(') break;
      const pTop = prec[top] || 0;
      const pOp = prec[op] || 0;
      if ((assoc[op] === 'L' && pOp <= pTop) || (assoc[op] === 'R' && pOp < pTop)) {
        out.push({ type: 'op', value: ops.pop() });
      } else break;
    }
    ops.push(op);
  }
  while (ops.length) {
    const v = ops.pop();
    if (v === '(' || v === ')') throw new Error('Mismatched parentheses');
    out.push({ type: 'op', value: v });
  }
  return out;
}

function evalRPN(rpn) {
  const st = [];
  for (const t of rpn) {
    if (t.type === 'number') st.push(parseFloat(t.value));
    else {
      if (t.value === 'u') { const a = st.pop(); st.push(-a); continue; }
      const b = st.pop();
      const a = st.pop();
      if (typeof a === 'undefined' || typeof b === 'undefined') throw new Error('Invalid expression');
      switch (t.value) {
        case '+': st.push(a + b); break;
        case '-': st.push(a - b); break;
        case '*': st.push(a * b); break;
        case '/': if (b === 0) throw new Error('Division by zero'); st.push(a / b); break;
        case '%': st.push(a % b); break;
        default: throw new Error('Unknown operator');
      }
    }
  }
  if (st.length !== 1) throw new Error('Invalid expression');
  return st[0];
}

export function calculate(expression) {
  if (typeof expression !== 'string') throw new Error('Expression must be a string');
  const cleaned = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\u2212/g, '-');
  const tokens = tokenize(cleaned);
  const rpn = toRPN(tokens);
  const val = evalRPN(rpn);
  const rounded = Math.abs(val) < 1e-12 ? 0 : Number.parseFloat(val.toPrecision(12));
  return String(rounded);
}
