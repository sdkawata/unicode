import axios from 'axios'
import {parseInfo} from './ucdparser'

console.log('worker started');

(async () => {
  const data = (await axios.get('/ucd.json')).data
  console.log('dict fetched')
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