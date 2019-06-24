const cheerio = require('cheerio');

class Mapper {
  constructor(html, selector) {
    this.$ = cheerio.load(html);
    this.selector = selector;
  }

  parse(sel, $context) {
    const { attr, data, innerHTML, outerHTML, parse } = sel;

    let result = attr
      ? $context.attr(attr)
      : data
      ? $context.data(data)
      : innerHTML
      ? this.$($context).html()
      : outerHTML
      ? this.$.html($context)
      : $context.text();

    if (result && parse) {
      result = parse(result);
    }

    return result;
  }

  extractSelect(sel, $context = null) {
    const { path, multiple, nodes } = sel;
    const $children = this.$(path, $context);

    if (nodes) {
      const reduceCallback = i => (acc, n) => {
        acc[n.key] = this.extractSelect(n, $children.eq(i));
        return acc;
      };

      return multiple
        ? $children.map(i => nodes.reduce(reduceCallback(i), {})).get()
        : nodes.reduce(reduceCallback(0), {});
    }

    return multiple
      ? $children.map(i => this.parse(sel, $children.eq(i))).get()
      : this.parse(sel, $children.eq(0));
  }

  extract() {
    return this.selector instanceof Array
      ? this.selector.reduce(
          (acc, s) => Object.assign(acc, { [s.key]: this.extractSelect(s) }),
          {}
        )
      : this.extractSelect(this.selector);
  }
}

module.exports = Mapper;
