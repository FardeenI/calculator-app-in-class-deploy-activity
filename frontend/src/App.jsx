import React, { useState } from 'react'

export default function App() {
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState('')

  function append(s) { setExpr(prev => prev + s); setResult('') }

  function handleNumber(n) { append(n) }
  function handleDot() {
    const m = expr.match(/(\d*\.?\d+)$/)
    if (m && m[0].includes('.')) return
    append('.')
  }

  function handleOp(op) {
    if (!expr) {
      if (op === '-') append('-')
      return
    }
    const newExpr = expr.replace(/[+\-*/xX÷%]$/, '') + op
    setExpr(newExpr)
    setResult('')
  }

  function handleClear() { setExpr(''); setResult('') }

  function handleBackspace() { setExpr(s => s.slice(0, -1)) }

  function handleToggleSign() {
    const re = /(-?\d*\.?\d+)$/
    const m = expr.match(re)
    if (!m) { if (!expr) setExpr('-'); return }
    const num = m[1]
    const toggled = num.startsWith('-') ? num.slice(1) : ('-' + num)
    setExpr(expr.slice(0, m.index) + toggled)
  }

  async function handleEqual() {
    if (!expr) return
    try {
      const res = await fetch('http://localhost:3001/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expression: expr }) })
      const j = await res.json()
      if (res.ok) { setResult(j.result); setExpr(j.result) }
      else setResult('Error: ' + (j.error || 'calc'))
    } catch (err) { setResult('Error') }
  }

  function handlePercent() {
    const re = /(\d*\.?\d+)$/
    const m = expr.match(re)
    if (!m) return
    const num = parseFloat(m[1])
    if (isNaN(num)) return
    const replaced = (num / 100).toString()
    setExpr(expr.slice(0, m.index) + replaced)
  }

  const btn = (label, onClick, cls='') => (
    <button className={cls} onClick={onClick}>{label}</button>
  )

  return (
    <div>
      <div className="display">{expr || '0'}</div>
      <div style={{ height: 20, textAlign: 'right', color: '#333' }}>{result}</div>
      <div className="buttons">
        {btn('Clear', handleClear, 'fn')}
        {btn('Back', handleBackspace, 'fn')}
        {btn('%', handlePercent, 'fn')}
        {btn('÷', () => handleOp('/'), 'op')}

        {btn('7', () => handleNumber('7'))}
        {btn('8', () => handleNumber('8'))}
        {btn('9', () => handleNumber('9'))}
        {btn('x', () => handleOp('*'), 'op')}

        {btn('4', () => handleNumber('4'))}
        {btn('5', () => handleNumber('5'))}
        {btn('6', () => handleNumber('6'))}
        {btn('-', () => handleOp('-'), 'op')}

        {btn('1', () => handleNumber('1'))}
        {btn('2', () => handleNumber('2'))}
        {btn('3', () => handleNumber('3'))}
        {btn('+', () => handleOp('+'), 'op')}

        {btn('+/-', handleToggleSign, 'fn')}
        {btn('0', () => handleNumber('0'))}
        {btn('.', handleDot)}
        {btn('=', handleEqual, 'equal')}
      </div>
    </div>
  )
}
