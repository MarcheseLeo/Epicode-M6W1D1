const pc = require('picocolors')
const requestLogger = (req, res, next) => {
    const { method, url } = req
    const timeString = new Date().toLocaleTimeString()

    let coloredMethod = pc.white(method)
    switch (method) {
        case 'GET': coloredMethod = pc.green(method); break;
        case 'POST': coloredMethod = pc.yellow(method); break;
        case 'PUT': coloredMethod = pc.blue(method); break;
        case 'DELETE': coloredMethod = pc.red(method); break;
    }

    console.log(
        `${pc.gray(timeString)} | ${pc.bold(coloredMethod)} -> ${pc.cyan(url)}`
    )
    next()

}

module.exports = {
    requestLogger
}