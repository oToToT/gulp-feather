# gulp-feather

[![version](https://img.shields.io/npm/v/gulp-feather?color=brightgreen&label=version)](https://www.npmjs.com/package/gulp-feather)

## What is gulp-feather

This package allows you to use [Feather](https://github.com/feathericons/feather) without executing any JavaScript on the client-side, by rendereing icons on the server-side using [gulp](https://gulpjs.com/).

## Install

```bash
$ npm install --save-dev gulp-feather
```

## Usage

> **Note:** This is directly copied from the [API Reference of Feather](https://github.com/feathericons/feather/blob/b15b4a7535d83172d7dee408b4cf099b0550bdcb/README.md)

### `featherify([attrs])`

Replaces all elements that have a `data-feather` attribute with SVG markup corresponding to the element's `data-feather` attribute value.

#### Parameters

| Name       | Type   | Description |
| ---------- | ------ | ----------- |
| `attrs` (optional)  | Object | Key-value pairs in the `attrs` object will be mapped to HTML attributes on the `<svg>` tag (e.g. `{ foo: 'bar' }` maps to `foo="bar"`). All default attributes on the `<svg>` tag can be overridden with the `attrs` object. |

#### Usage

Simple usage:

`gulpfile.js`

```javascript
const gulp = require('gulp');
const featherify = require('gulp-feather');

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(featherify())
    .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['html']);
```

`index.html`

```html
<i data-feather="circle"></i>
```

`dest/index.html`

```html
<svg class="feather feather-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
```

You can pass `featherify` an `attrs` object:

`gulpfile.js`

```javascript
const gulp = require('gulp');
const featherify = require('gulp-feather');

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(featherify({ class: 'foo bar', 'stroke-width': 1 }))
    .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['html']);
```

`index.html`

```html
<i data-feather="circle"></i>
```

`dist/index.html`

```html
<svg class="feather feather-circle foo bar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
```

All attributes on the placeholder element (i.e. `<i>`) will be copied to the `<svg>` tag:

`gulpfile.js`

```javascript
const gulp = require('gulp');
const featherify = require('gulp-feather');

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(featherify())
    .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['html']);
```

`index.html`

```html
<i data-feather="circle" id="my-circle" class="foo bar" stroke-width="1"></i>
```

`dist/index.html`

```html
<svg id="my-circle" class="feather feather-circle foo bar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
```

## License

[MIT](https://github.com/oToToT/gulp-feather/blob/main/LICENSE) © [oToToT](https://github.com/oToToT)
