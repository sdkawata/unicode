export const codepointStr = (i: number) => (
  'U+' + ('00000' + i.toString(16)).slice(-5)
)