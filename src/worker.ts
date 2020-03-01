import axios from 'axios'
import {SearchParam} from './ucdparser'

const MAX_SERACH_RESULTS = 30

type Dict = {
  groups: {
    chars: any[],
    attrs: any,
  }[],
  attrs: any[],
}

console.log('worker started');

function calcIndex(dict: Dict) {
  let idx = 0;
  for (let gidx = 0; gidx < dict['groups'].length; gidx++) {
    const group = dict['groups'][gidx];
    for (let cidx = 0; cidx < group['chars'].length; cidx++) {
      const char = group['chars'][cidx]._index = idx;
      idx++;
    }
  }
}

function nextcp(dict: Dict, gidx: number, cidx: number) {
  cidx++
  if (cidx < (dict['groups'][gidx]['chars'] || []).length ) {
    return parseInt(dict['groups'][gidx]['chars'][cidx].cp, 16)
  }
  for (gidx++; gidx < dict['groups'].length; gidx++) {
    if (dict['groups'][gidx]['chars'].length > 0) {
      return parseInt(dict['groups'][gidx]['chars'][0].cp, 16)
    }
  }
  return undefined
}
function prevcp(dict: Dict, gidx: number, cidx: number) {
  cidx--;
  if (cidx >= 0) {
    return parseInt(dict['groups'][gidx]['chars'][cidx].cp, 16)
  }
  for (gidx--; gidx >=0; gidx--) {
    const group = dict['groups'][gidx]
    if ((group['chars'] || []).length > 0) {
      return parseInt(group['chars'][group['chars'].length - 1].cp, 16)
    }
  }
  return undefined
}

function findChar(dict: Dict, codepoint:number) {
  for (let gidx = 0; gidx < dict['groups'].length; gidx++) {
    const group = dict['groups'][gidx];
    for (let cidx = 0; cidx < group['chars'].length; cidx++) {
      const char = group['chars'][cidx]
      if (parseInt(char.cp, 16) == codepoint) {
        char['_nextcp'] = nextcp(dict, gidx, cidx)
        char['_prevcp'] = prevcp(dict, gidx, cidx)
        return Object.assign({}, group['attrs'], char)
      } 
    }
  }
  return undefined
}

function parseInfo(dict: Dict, codepoint:number) {
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
    obj['_blockname'] = block['name']
  }
  return obj;
}

function extractNames(dict:Dict) {
  let names = {}
  for (const group of dict['groups']) {
    for (const char of group['chars']) {
      let cp = parseInt(char.cp, 16)
      names[cp] = char['na'] || group.attrs['na'] || char['na1'] || group.attrs['na1']
    }
  }
  return names
}

function search(dict:Dict, searchParam: SearchParam): number[] {
  console.log('search')
  const offset = searchParam.offset || 0;
  let result = []
  let ptr = -1;
  for (let gidx = 0; gidx < dict['groups'].length; gidx++) {
    const group = dict['groups'][gidx];
    for (let cidx = 0; cidx < group['chars'].length; cidx++) {
      const char = group['chars'][cidx]
      ptr++;
      if (ptr < offset) {
        continue;
      }
      result.push(parseInt(char.cp, 16))
      if (result.length >= MAX_SERACH_RESULTS) {
        return result
      }
    }
  }
  return result
}

(async () => {
  const data = (await axios.get('./ucd.json')).data as Dict
  calcIndex(data)
  console.log('dict fetched')
  const names = extractNames(data);
  (self as any).postMessage({
    type: 'names',
    result: names
  })
  self.addEventListener('message', function(e) {
    if (e.data.key !== undefined) {
      if (e.data.codepoint !== undefined) {
        const parsed = parseInfo(data, e.data.codepoint);
        (self as any).postMessage({
          key: e.data.key,
          result: parsed,
        });
      } else if (e.data.type === 'search') {
        const searched = search(data, e.data);
        (self as any).postMessage({
          key: e.data.key,
          result: searched,
        });
      } else {
        console.log('unprocessable message', e.data)
      }
    }
  })
})();