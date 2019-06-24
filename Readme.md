<h1 align="center">cheerio-mapper</h1>
<h5 align="center">Cheerio plugin that extracts information from a html string based on a configuration parameter</h5>

## Installation

`npm install cheerio-mapper`

[Cheerio](https://www.npmjs.com/package/cheerio) is listed as a peer dependency.

## Examples

### usage

```js
const Mapper = require('cheerio-mapper');
const result = new Mapper(html, map).extract();
```

### text

By default, the text from the node is extracted if none of the properties `innerHTML`, `outerHTML`, `attr` and `data` are defined.

```js
const html = '<div><h1>foo</h1><p>bar</p></div>';
const map = { path: 'div' };

new Mapper(html, map).extract(); // => "foobar"
```

### outerHTML

```js
const html = '<div><h1>foo</h1><p>bar</p></div>';
const map = { path: 'div', outerHTML: true };

new Mapper(html, map).extract(); // => <div><h1>foo</h1><p>bar</p></div>
```

### innerHTML

```js
const html = '<div><h1>foo</h1><p>bar</p></div>';
const map = { path: 'div', innerHTML: true };

new Mapper(html, map).extract(); // => <h1>foo</h1><p>bar</p>
```

### attr

```js
const html = '<a href="www.foo.com" />';
const map = { path: 'a', attr: 'href' };

new Mapper(html, map).extract(); // => "www.foo.com"
```

### data

```js
const html = '<div data-foo="bar" />';
const map = { path: 'div', data: 'foo' };

new Mapper(html, map).extract(); // => "bar"
```

### parse

```js
const html = '<div data-foo="1" />';
const map = { path: 'div', data: 'foo', parse: n => parseInt(n) };

new Mapper(html, map).extract(); // => 1
```

### multiple

```js
const html = `
	<ul>
		<li>item 1</li>
		<li>item 2</li>
	</ul>
`;
const map = { path: 'li', multiple: true };

new Mapper(html, map).extract(); // => ["item 1", "item 2"]
```

### parse

```js
const html = '<div data-foo="1" />';
const map = { path: 'div', data: 'foo', parse: n => parseInt(n) };

new Mapper(html, map).extract(); // => 1
```

### nested

```js
const html = `
  <ul>
    <li>
      <h1>title</h1>
      <p>description</p>
    </li>
  </ul>
`;
const map = {
  path: 'li',
  nodes: [{ key: 'title', path: 'h1' }, { key: 'description', path: 'p' }],
};

new Mapper(html, map).extract(); // => { title: "title", description: "description" }
```

### combined example

```js
const html = `
  <div>
    <div class="actor">
      <h1>Will Smith</h1>
      <p>Born September 25, 1968...</p>
      <ul>
        <li>I am legend</li>
        <li>Men in black</li>
        <li>Independence day</li>
      </ul>
    </div>
    <div class="actor">
      <h1>Christian Bale</h1>
      <p>Born January 30, 1974...</p>
      <ul>
        <li>The dark knight</li>
        <li>American hustle</li>
      </ul>
    </div>

    <div class="links">
      <a href="www.foobar.com?actor=smith">Will Smith</a>
      <a href="www.foobar.com?actor=bale">Christian Bale</a>
    </div>
  </div>
`;
const map = [
  {
    key: 'actors',
    path: '.actor',
    multiple: true,
    nodes: [
      { key: 'name', path: 'h1' },
      { key: 'bio', path: 'p' },
      { key: 'movies', path: 'ul li', multiple: true },
    ],
  },
  {
    key: 'linkQueries',
    path: '.links a',
    attr: 'href',
    multiple: true,
    parse: l => l.split('?')[1],
  },
];

new Mapper(html, map).extract();
/* => {
  actors: [{
    name: "Will Smith",
    bio: "Born September 25, 1968...",
    movies: ["I am legend", "Men in black", "Independence day"]
  }, {
    name: "Christian Bale",
    bio: "Born January 30, 1974...",
    movies: ["The dark knight", "American hustle"]
  }],
  linkQueries: ["actor=smith", "actor=bale"]
} */
```

## License

ISC
