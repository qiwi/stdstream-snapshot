import {
  relatify,
  tabsToSpaces,
  trim,
} from '../../main/ts/handler'

describe('stringHandlers', () => {
  it('#trim() trims spaces', () => {
    expect(trim(' foo   ')).toBe('foo')
  })

  it('#tabsToSpaces() replaces tabs with double space', () => {
    expect(tabsToSpaces('\t\tfoo\tbar\t')).toBe('    foo  bar  ')
  })

  it('#relatify() removes current cwd path prefix from the output', () => {
    const dirname = __dirname
    const str = `
      ${dirname}/foo/bar.js
      ${dirname}/other/path.ts
    `
    const expected = `
      /foo/bar.js
      /other/path.ts
    `

    expect(relatify(str, dirname)).toBe(expected)
  })
})
