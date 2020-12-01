const PLUGIN_NAME = 'gulp-feather';

const PluginError = require('plugin-error');
const through = require('through2');
const { JSDOM } = require('jsdom');
const { replace } = require('feather-icons');

module.exports = (attrs = {}) => through.obj(function (file, encoding, cb) {

  if (file.isNull()) {
    // nothing to do
    return cb(null, file);
  }

  if (file.isStream()) {
    // might support stream in the future
    const err = new PluginError(PLUGIN_NAME, 'Streams not supported!');
    this.emit('error', err);
    return cb(err);
  }

  if (file.isBuffer()) {
    // create dom from html file
    const dom = new JSDOM(file.contents, { runScripts: 'outside-only' });

    // override document and DOMParser
    const savedVariables = new Map();
    if (typeof global.document !== 'undefined') {
      savedVariables.set('document', global.document);
    }
    global.document = dom.window.document;
    if (typeof global.DOMParser !== 'undefined') {
      savedVariables.set('DOMParser', global.DOMParser);
    }
    global.DOMParser = dom.window.DOMParser;

    // replace feathericons
    replace(attrs);

    // restore overrided variables
    if (savedVariables.has('document')) {
      global.document = savedVariables.get('document');
    }
    if (savedVariables.has('DOMParser')) {
      global.DOMParser = savedVariables.get('DOMParser');
    }

    // output to file contents
    const HTMLResult = dom.serialize();
    if (file.contents.length < HTMLResult.length) {
      const buf = Buffer.from(HTMLResult, encoding);
      file.contents = buf;
    } else {
      file.contents.write(HTMLResult, encoding);
    }

    return cb(null, file);
  }

  const err = new PluginError(PLUGIN_NAME, 'Unsupported type of file!');
  this.emit('error', err);
  return cb(err);
});
