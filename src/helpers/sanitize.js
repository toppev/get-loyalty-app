const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function sanitizeInput(dirty) {
    return DOMPurify.sanitize(dirty);
}

module.exports = {
    sanitizeInput
}