import {useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'

export type SearchParam = {
  offset?: number,
}

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
    if (e.data.key !== undefined) {
      if (waiting[e.data.key]) {
        let r = waiting[e.data.key]
        delete waiting[e.data.key]
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
function rpc(param) {
  let resolve
  const promise = new Promise((r) => {resolve = r})
  const key = uuidv4()
  waiting[key] = resolve
  param['key'] = key
  namesPromise.then(() => {
    worker.postMessage(param)
  })
  return promise
}
export async function getSearch(param: SearchParam): Promise<number[]> {
  return (await rpc({
    type: 'search',
    ...param
  })) as number[]
}
export async function getInfo (codepoint: number){
  return await rpc(
    {
      codepoint
    }
  )
}