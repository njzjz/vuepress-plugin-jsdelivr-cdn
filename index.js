module.exports = (options = {}, context) => ({
    extendPageData($page) {
        const cdn = options.cdn
        $page.size = ($page._content.length / 1024).toFixed(2) + 'kb'
    }
})