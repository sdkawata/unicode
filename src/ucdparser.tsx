import axios from 'axios'

let dictPromise: Promise<any> | null = null

async function getDict() {
  if (dictPromise === null) {
    dictPromise = (async () => {
      const data = (await axios.get('/ucd.json')).data
      return data
    })()
  }
  return await dictPromise;
}

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

export const getInfo = async (codepoint: number) => {
  let dict = await getDict()
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