const through = require('through2');
const { JSDOM } = require('jsdom');
const { icons } = require('feather-icons');
const classnames = require('classnames/dedupe');

module.exports = (attrs = {}) => {
    return through.obj(function(file, encoding, cb) {
        const dom = new JSDOM(file.contents, { runScripts: "outside-only" });

        /* modified from https://github.com/feathericons/feather/blob/master/src/replace.js */
        function getAttrs(element) {
            return Array.from(element.attributes).reduce((attrs, attr) => {
                attrs[attr.name] = attr.value;
                return attrs;
            }, {});
        }
        function replaceElement(element, attrs = {}) {
            const elementAttrs = getAttrs(element);
            const name = elementAttrs['data-feather'];
            delete elementAttrs['data-feather'];

            const svgString = icons[name].toSvg({
                ...attrs,
                ...elementAttrs,
                ...{ class: classnames(attrs.class, elementAttrs.class) },
            });
            const svgDocument = new dom.window.DOMParser().parseFromString(
                svgString,
                'image/svg+xml',
            );
            const svgElement = svgDocument.querySelector('svg');

            element.parentNode.replaceChild(svgElement, element);
        }
        const elementsToReplace = dom.window.document.querySelectorAll('[data-feather]');
        Array.from(elementsToReplace).forEach(element => replaceElement(element, attrs));

        const buf = Buffer.from(dom.serialize(), 'utf-8');
        file.contents = buf;
        this.push(file);
        return cb();
    });
};
