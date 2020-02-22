function findChar(dict: any, codepoint:number) {
  for (const group of dict['groups']) {
    for (const char of group['chars']) {
      if (parseInt(char.cp, 16) == codepoint) {
        return Object.assign({}, group['attrs'], char)
      } 
    }
  }
  return null;
}

export function parseInfo(dict:any, codepoint:number) {
  const char = findChar(dict, codepoint);
  if (!char) {
    console.log('NOT FOUND')
    return {}
  }
  const obj = char
  let block = dict['blocks'].find((block) => {
    const first = parseInt(block['first-cp'], 16);
    const last = parseInt(block['last-cp'], 16);
    return first <= codepoint && codepoint <= last
  })
  if (block) {
    obj['blockname'] = block['name']
  }
  return obj;
}

let worker: Worker
let waiting = {}
export function initWorker() {
  if (worker) {
    return
  }
  worker = new Worker('/worker.js')
  console.log('will start worker')
  worker.addEventListener('message', (e) => {
    if (e.data.codepoint) {
      const waitingR = waiting[e.data.codepoint] || [];
      waiting[e.data.codepoint] = [];
      for (const r of waitingR) {
        r(e.data.result)
      }
    }
  })
}
export const getInfo = (codepoint: number) => {
  let resolve
  let promise = new Promise((r) => {resolve = r})
  waiting[codepoint] = (waiting[codepoint] || []).concat([resolve])
  worker.postMessage({codepoint})
  return promise
}