'use strict';

const assert = require('assert');
const featherify = require('../');
const fs = require('fs');
const File = require('vinyl');

describe('gulp-feather', () => {
  describe('featherify()', () => {
    describe('null input', () => {
      it("should do nothing", function(done) {
        let file = new File({
          path: 'test/original/basic.html',
          contents: null
        });

        let stream = featherify();
        stream.write(file);
        stream.end();
        done();
      });
    });

    describe('buffered input with basic html', () => {
      let file, check;
      beforeEach(function () {
        file = new File({
          path: 'test/original/basic.html',
          contents: fs.readFileSync('test/original/basic.html')
        });

        check = function (stream, done, cb) {
          stream.on('data', function (newFile) {
            cb(newFile);
            done();
          });

          stream.write(file);
          stream.end();
        };
      });

      it('should render icons on a buffer', function(done) {
        let stream = featherify();

        check(stream, done, function (newFile) {
          const testHTML = newFile.contents;
          const expectedHTML = fs.readFileSync('test/expected/basic.html');
          assert(testHTML.equals(expectedHTML));
        });
      });
      
      it('should ensure global variables unchanged', function(done) {
        let a = new Object();
        let b = new Object();
        global.document = a;
        global.DOMParser = b;
        let stream = featherify();

        check(stream, done, function (newFile) {
          const testHTML = newFile.contents;
          const expectedHTML = fs.readFileSync('test/expected/basic.html');
          assert(testHTML.equals(expectedHTML));
          assert.strictEqual(a, global.document);
          assert.strictEqual(b, global.DOMParser);
        });
      });

      it('should apply attributes to svg', function(done) {
        let stream = featherify({ class: 'foo bar', 'stroke-width': 1 });

        check(stream, done, function (newFile) {
          const testHTML = newFile.contents;
          const expectedHTML = fs.readFileSync('test/expected/attrs.html');
          assert(testHTML.equals(expectedHTML));
        });
      });
    });

    describe('buffered input with placeholder replacement', () => {
      let file, check;
      beforeEach(function () {
        file = new File({
          path: 'test/original/placehold.html',
          contents: fs.readFileSync('test/original/placehold.html')
        });

        check = function (stream, done, cb) {
          stream.on('data', function (newFile) {
            cb(newFile);
            done();
          });

          stream.write(file);
          stream.end();
        };
      });

      it('should render icons on a buffer', function(done) {
        let stream = featherify();

        check(stream, done, function (newFile) {
          const testHTML = newFile.contents;
          const expectedHTML = fs.readFileSync('test/expected/placehold.html');
          assert(testHTML.equals(expectedHTML));
        });
      });
    });

    describe('buffered input with not related contents', () => {
      let file, check;
      beforeEach(function () {
        file = new File({
          path: 'test/original/nothing.html',
          contents: fs.readFileSync('test/original/nothing.html')
        });

        check = function (stream, done, cb) {
          stream.on('data', function (newFile) {
            cb(newFile);
            done();
          });

          stream.write(file);
          stream.end();
        };
      });

      it('should make same result', function(done) {
        let stream = featherify();

        check(stream, done, function (newFile) {
          const testHTML = newFile.contents;
          const expectedHTML = fs.readFileSync('test/expected/nothing.html');
          assert(testHTML.equals(expectedHTML));
        });
      });
    });

    describe('streamed input', () => {
      it("should not accept streamed data", function(done) {
        let file = new File({
          path: 'test/original/basic.html',
          contents: fs.createReadStream('test/original/basic.html')
        });

        let errored = false;
        let stream = featherify();
        stream.on('error', function() {
          errored = true;
        });
        stream.write(file);
        stream.end();
        assert(errored);
        done();
      });
    });
  });
});
