const Mapper = require('./index');

test('text', () => {
  const html = '<div><h1>foo</h1><p>bar</p></div>';
  const map = { path: 'div' };

  const result = new Mapper(html, map).extract();
  expect(result).toBe('foobar');
});

test('outerHTML', () => {
  const html = '<div><h1>foo</h1><p>bar</p></div>';
  const map = { path: 'div', outerHTML: true };

  const result = new Mapper(html, map).extract();
  expect(result).toBe('<div><h1>foo</h1><p>bar</p></div>');
});

test('innerHTML', () => {
  const html = '<div><h1>foo</h1><p>bar</p></div>';
  const map = { path: 'div', innerHTML: true };

  const result = new Mapper(html, map).extract();
  expect(result).toBe('<h1>foo</h1><p>bar</p>');
});

test('data', () => {
  const html = '<div data-foo="bar" />';
  const map = { path: 'div', data: 'foo' };

  const result = new Mapper(html, map).extract();
  expect(result).toBe('bar');
});

test('attr', () => {
  const html = '<a href="www.foo.com" />';
  const map = { path: 'a', attr: 'href' };

  const result = new Mapper(html, map).extract();
  expect(result).toBe('www.foo.com');
});

test('parse', () => {
  const html = '<div data-foo="1" />';
  const map = { path: 'div', data: 'foo', parse: n => parseInt(n) };

  const result = new Mapper(html, map).extract();
  expect(result).toBe(1);
});

test('multiple', () => {
  const html = `
	<ul>
		<li>item 1</li>
		<li>item 2</li>
	</ul>
  `;
  const map = { path: 'li', multiple: true };

  const result = new Mapper(html, map).extract();
  expect(result).toEqual(['item 1', 'item 2']);
});

test('nested', () => {
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

  const result = new Mapper(html, map).extract();
  expect(result).toEqual({
    title: 'title',
    description: 'description',
  });
});

test('nested multiple', () => {
  const html = `
	<ul>
		<li>
			<h1>title 1</h1>
			<p>description 1</p>
		</li>
		<li>
			<h1>title 2</h1>
			<p>description 2</p>
		</li>
	</ul>
	  `;
  const map = {
    path: 'li',
    multiple: true,
    nodes: [{ key: 'title', path: 'h1' }, { key: 'description', path: 'p' }],
  };

  const result = new Mapper(html, map).extract();
  expect(result).toEqual([
    {
      title: 'title 1',
      description: 'description 1',
    },
    {
      title: 'title 2',
      description: 'description 2',
    },
  ]);
});

test('combined example', () => {
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

  const result = new Mapper(html, map).extract();
  expect(result).toEqual({
    actors: [
      {
        name: 'Will Smith',
        bio: 'Born September 25, 1968...',
        movies: ['I am legend', 'Men in black', 'Independence day'],
      },
      {
        name: 'Christian Bale',
        bio: 'Born January 30, 1974...',
        movies: ['The dark knight', 'American hustle'],
      },
    ],
    linkQueries: ['actor=smith', 'actor=bale'],
  });
});
