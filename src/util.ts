export const codepointStr = (i: number) => (
  'U+' + ('0000' + i.toString(16)).slice(-4)
)