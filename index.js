const parser = require('node-html-parser')
const fs = require('fs')
const path = require('path')

module.exports = (options, context) => ({
    async onGenerated(app) {
		// https://github.com/vuepress/vuepress-next/blob/ac73433bdb788ff6f9c82eb09f14c1cccf304995/packages/%40vuepress/core/src/app/createAppPages.ts#L9-L11
		const pagePaths = await globby(app.options.pagePatterns, {
		    cwd: app.dir.source(),
		})
        const base = context.base || '/'
        const cdn = options.cdn || base

        console.log('start replacing cdn ' + cdn)

        console.log('replace *.html tags')
        // replace *.html tags
        pagePaths.forEach(pagePath => {
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
            })
        })

        console.log('replace service-worker.js tags')
        // replace service-worker.js tags
        const serviceWorkerBase = ''
        const serviceWorkerCdn = options.cdn || serviceWorkerBase
        const tags = ["assets/css/", "assets/img/", "assets/js/", "images/icons/"]
        const outDir = context.outDir || ''
        const serviceWorkerPath = path.resolve(outDir, 'service-worker.js')
        fs.readFile(serviceWorkerPath, 'utf8', function (err, data) {
            if (err) throw err
            var content = data
            tags.forEach(tag => {
                const regex = RegExp(tag, "g")
                content = content.replace(regex, serviceWorkerCdn + tag)
            })
            fs.writeFile(serviceWorkerPath, content, 'utf8', function (err) {
                if (err) throw err
            })
        })

        console.log('replace cdn successfully')
    },
})

function replace(root, selector, key, base, cdn) {
    const nodes = root.querySelectorAll(selector)
    nodes.forEach(node => {
        const value = node.getAttribute(key)
        if (value && (value.charAt(0) === base || value.charAt(0) === '/') && !value.includes('manifest.json')) {
            const newValue = cdn + value.slice(1)
            node.setAttribute(key, newValue)
        }
    })
}
