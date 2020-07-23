/**
 * Script to create the manifest.json by replacing environment variables.
 *
 * Executed in package.json build script before react-scripts build
 */

require('dotenv').config()
const fs = require("fs");

let text = fs.readFileSync('./scripts/template_manifest.json').toString('utf-8');

Object.entries(process.env).forEach(([k, v]) => {
    text = text.replace(`%${k}%`, v)
})

fs.writeFileSync('./public/manifest.json', text);

console.log('Copied template_manifest.json to public/manifest.json and replaced environment variables.')