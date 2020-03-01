import {useState, useEffect} from 'react'

let worker: Worker
let waiting = {}
let names = {}
let [namesPromise, namesResolve] = (() => {
  let resolve
  let p = new Promise((r) => {resolve = r})
  return [p, resolve]
})()

export function initWorker() {
  if (worker) {
    return
  }
  worker = new Worker('./worker.js')
  console.log('will start worker')
  worker.addEventListener('message', (e) => {
    if (e.data.codepoint !== undefined) {
      const waitingR = waiting[e.data.codepoint] || [];
      waiting[e.data.codepoint] = [];
      for (const r of waitingR) {
        r(e.data.result)
      }
    } else if (e.data.type === 'names') {
      names = e.data.result
      namesResolve(names)
    }
  })
}
export function useNames() {
  const [incr, setIncr] = useState(0)
  useEffect(() => {
    namesPromise.then(() => {
      setIncr(i => i+1)
    })
  }, [])
  return names;
}
export const getInfo = (codepoint: number) => {
  let resolve
  let promise = new Promise((r) => {resolve = r})
  waiting[codepoint] = (waiting[codepoint] || []).concat([resolve])
  worker.postMessage({codepoint})
  return promise
}