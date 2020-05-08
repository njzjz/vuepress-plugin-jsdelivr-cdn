const parser = require('node-html-parser')
const fs = require('fs')

module.exports = (options, context) => ({
    async generated(pagePaths) {
        const base = context.base || '/'
        const cdn = options.cdn || base
        console.log(options, context)
        console.log(cdn)
        pagePaths.forEach(pagePath => {
            console.log('start parse: ' + pagePath)
            fs.readFile(pagePath, 'utf8', function (err, data) {
                if (err) throw err
                const root = parser.parse(data)
                replace(root, 'link', 'href', base, cdn)
                replace(root, 'script', 'src', base, cdn)
                replace(root, 'img', 'src', base, cdn)
                replace(root, 'img', 'data-src', base, cdn)
                const newContent = root.toString()
                fs.writeFile(pagePath, newContent, 'utf8', function (err) {
                    if (err) throw err
                })
                console.log('end parse: ' + pagePath)
            })
        })
    },
})

function replace(root, selector, key, base, cdn) {
    const nodes = root.querySelectorAll(selector)
    nodes.forEach(node => {
        const value = node.getAttribute(key)
        if (value && (value.charAt(0) === base || value.charAt(0) === '/')) {
            const newValue = cdn + value.slice(1)
            node.setAttribute(key, newValue)
        }
    })
}
