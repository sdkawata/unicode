import axios from 'axios'

let dictPromise: Promise<Document> | null = null

async function getDict() {
  if (dictPromise === null) {
    dictPromise = (async () => {
      const data = (await axios.get('/ucd.all.grouped.xml')).data
      const domparser = new DOMParser();
      const parsed = domparser.parseFromString(data, 'text/xml')
      return parsed
    })()
  }
  return await dictPromise;
}

export const getInfo = async (codepoint) => {
  let dict = await getDict()
  const char = Array.from(dict.getElementsByTagName('char')).find((node) => {
    let cp = parseInt(node.getAttribute('cp'), 16);
    return cp === codepoint
  })
  if (!char) {
    return {}
  }
  const obj = {}
  Array.from(char.attributes).forEach((attribute) => {
    obj[attribute.name] = attribute.value
  })
  if (char.parentNode.nodeName === 'group') {
    Array.from((char.parentNode as Element).attributes).forEach((attribute) => {
      obj[attribute.name] = obj[attribute.name] || attribute.value
    })
  }
  return obj;
}