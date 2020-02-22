import axios from 'axios'

let dictPromise: Promise<Document> | null = null

async function getDict() {
  if (dictPromise === null) {
    dictPromise = (async () => {
      const data = (await axios.get('/ucd.all.grouped.xml')).data
      console.log('parse start')
      const start = performance.now()
      const domparser = new DOMParser();
      const parsed = domparser.parseFromString(data, 'text/xml')
      const end = performance.now()
      console.log(`parse end ${end-start} ms`)
      return parsed
    })()
  }
  return await dictPromise;
}

export const getInfo = async (codepoint: number) => {
  let dict = await getDict()
  const char = Array.from(dict.getElementsByTagName('char')).find((node) => {
    let cp = parseInt(node.getAttribute('cp'), 16);
    return cp === codepoint
  })
  if (!char) {
    console.log('NOT FOUND')
    return {}
  }
  const obj = {}
  Array.from(char.attributes).forEach((attribute) => {
    obj[attribute.name] = attribute.value
  })
  let aliases = Array.from(char.getElementsByTagName('name-alias')).map((node) => {
    let alias = node.getAttribute('alias')
    let type = node.getAttribute('type')
    return `${alias}(${type})`
  }).join(", ")
  if (aliases !== '') {
    obj['aliases'] = aliases
  }
  let block = Array.from(dict.getElementsByTagName('block')).find((node) => {
    const first = parseInt(node.getAttribute('first-cp'), 16);
    const last = parseInt(node.getAttribute('last-cp'), 16);
    return first <= codepoint && codepoint <= last
  })
  if (block) {
    obj['blockname'] = block.getAttribute('name')
  }
  if (char.parentNode.nodeName === 'group') {
    Array.from((char.parentNode as Element).attributes).forEach((attribute) => {
      obj[attribute.name] = obj[attribute.name] || attribute.value
    })
  }
  return obj;
}