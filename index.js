module.exports = (options = {}, context) => ({
    extendPageData($page) {
        const cdn = options.cdn
        var content = $page._content
        var src = ("src=\"" + cdn)
        content.replace(
            "src=\"/",
            src
        )
        $page._content = content
    }
})