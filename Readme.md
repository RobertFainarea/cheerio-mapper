# cheerio-mapper
#### Cheerio plugin that extracts information from a html string based on a configuration parameter

## Installation

`npm install cheerio-mapper`

[Cheerio](https://www.npmjs.com/package/cheerio) is listed as a peer dependency.

## API

#### target properties

| property  | type      |
| --------- | --------- |
| attr      | _string_  |
| data      | _string_  |
| innerHTML | _boolean_ |
| outerHTML | _boolean_ |
| text      | _default_ |

#### mapping properties

| property | type     |
| -------- | -------- |
| key      | _string_ |
| path     | _string_ |
| multiple | _bool_   |
| nodes    | _array_  |

## Examples

#### usage

```js
const Mapper = require('cheerio-mapper');
const result = new Mapper(html, map).extract();
```

#### basic example

```js
const html = `
  <section >
    <div class="actor">
      <h1>Will Smith</h1>
      <p>September 25, 1968</p>
    </div>

    <div class="movie">
      <h1>Men in black</h1>
      <p>July 2, 1997</p>
    </div>
  </section>
`;
const map = [
  {
    key: 'actor',
    path: '.actor',
    nodes: [{ name: 'h1', born: 'p' }],
  },
  {
    key: 'movie',
    path: '.movie',
    nodes: [{ title: 'h1', released: 'p' }],
  },
];

new Mapper(html, map).extract();
/* => {
  actor: {
    name: "Will Smith",
    born: "September 25, 1968"
  },
  movie: {
    title: "Men in black",
    year: "July 2, 1997"
  }
} */
```

#### advanced example

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
