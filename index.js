const PLUGIN_NAME = 'gulp-feather';

const PluginError = require('plugin-error');
const through = require('through2');
const { JSDOM } = require('jsdom');
const { replace } = require('feather-icons');

module.exports = (attrs = {}) => {
    return through.obj(function(file, encoding, cb) {
        if (file.isNull()) {
            // nothing to do
            return callback(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
        } else if (file.isBuffer()) {
            const dom = new JSDOM(file.contents, { runScripts: "outside-only" });

            let saved_variables = new Map();

            if (typeof document !== 'undefined') {
                saved_variables.set('document', document);
            }
            document = dom.window.document;
            if (typeof DOMParser !== 'undefined') {
                saved_variables.set('DOMParser', DOMParser);
            }
            DOMParser = dom.window.DOMParser;

            replace(attrs);

            if (saved_variables.has('document')) {
                document = saved_variables.get('document');
            }
            if (saved_variables.has('DOMParser')) {
                document = saved_variables.get('DOMParser');
            }

            const result_html = dom.serialize();
            if (file.contents.length < result_html.length) {
                const buf = Buffer.from(result_html, encoding);
                file.contents = buf;
            } else {
                file.contents.write(result_html, encoding);
            }

            return cb(null, file);
        } else {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
        }
    });
};
