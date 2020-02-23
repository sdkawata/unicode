import axios from 'axios'

console.log('worker started');

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

function parseInfo(dict:any, codepoint:number) {
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

function extractNames(dict:any) {
  let names = {}
  for (const group of dict['groups']) {
    for (const char of group['chars']) {
      let cp = parseInt(char.cp, 16)
      names[cp] = char['na'] || group['na'] || char['na1'] || group['na1']
    }
  }
  return names
}

(async () => {
  const data = (await axios.get('./ucd.json')).data
  console.log('dict fetched')
  const names = extractNames(data);
  (self as any).postMessage({
    type: 'names',
    result: names
  })
  self.addEventListener('message', function(e) {
    if (e.data.codepoint !== undefined) {
      const parsed = parseInfo(data, e.data.codepoint);
      (self as any).postMessage({
        codepoint: e.data.codepoint,
        result: parsed,
      });
    }
  })
})();