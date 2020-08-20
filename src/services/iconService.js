const fs = require('fs');
const sharp = require('sharp');
const toIco = require('to-ico');

/**
 *
 * @param input
 * @param sizes
 * @param outputDir
 * @param name
 */
async function resizeToPNG(input, sizes, outputDir, name) {
    const tasks = sizes.map(size => sharp(input).resize(size, size).toFile(`${outputDir}/${name}-${size}.png`))
    return Promise.all(tasks)
}

/**
 * Generate a favicon.ico file from the PNG image source. Saves it in the output
 */
async function generateFavicon(source, output) {
    const image = await fs.promises.readFile(source);

    const result = await toIco([image], {
        sizes: [16, 24, 32, 48, 64],
        resize: true
    })
    await fs.promises.writeFile(output, result)
}

module.exports = {
    generateFavicon,
    resizeToPNG
}