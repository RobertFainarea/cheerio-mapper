<h1  align="center">cheerio-mapper</h1>
<h5  align="center">Cheerio plugin that extracts information from a html string based on a configuration parameter</h5>

## Installation  

`npm install cheerio-mapper`
  
[Cheerio](https://www.npmjs.com/package/cheerio) is listed as a peer dependency.

## Usage example

```js
const Mapper = require("cheerio-mapper");

const html = `
	<div>
		<div class="obj">
			<h1 class="title">title 1</h1>
			<p class="description">description 1</p>
			<ul class="props">
				<li>prop-1.1</li>
				<li>prop-1.2</li>
				<li>prop-1.3</li>
			</ul>
		</div>
		<div class="obj">
			<h1 class="title">title 2</h1>
			<p class="description">description 2</p>
			<ul class="props">
				<li>prop-2.1</li>
				<li>prop-2.2</li>
			</ul>
		</div>
		
		<div class="links">
			<a href="www.foo.com?bar=1">link 1</a>
			<a href="www.foo.com?bar=2">link 2</a>
		</div>
	</div>
`;

const map = [
	{
		key: "objs",
		path: ".obj",
		multiple: true,
		nodes: [
			{ key: "title", path: ".title" },
			{ key: "description", path: ".description" },
			{ key: "props",path: ".props li", multiple: true }
		]
	},
	{
		key: "linkQueries",
		path: ".links a",
		attr: "href",
		multiple: true,
		parse: l => l.split("bar=")[1]
	}
];

const result = new Mapper(html,  map).extract();  

console.log(result);
/*
{
	objs: [{
			title: "title 1",
			description: "description 1",
			props: [ "prop-1.1", "prop-1.2", "prop-1.3" ]
		}, {
			"title": "title 2",
			"description": "description 2",
			"props": [ "prop-2.1", "prop-2.2" ]
		}
	],
	"linkQueries": [ "1", "2" ]
}
*/
```

## License

ISC