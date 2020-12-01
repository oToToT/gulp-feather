const through = require('through2');
const { JSDOM } = require('jsdom');
const { replace } = require('feather-icons');

module.exports = (attrs = {}) => {
    return through.obj(function(file, encoding, cb) {
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
        this.push(file);
        return cb();
    });
};
