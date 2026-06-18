const mongoose = require('mongoose')
const pc = require('picocolors')

const initDatabaseConnection = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(pc.greenBright('Database connected'))
    }catch(error){
        console.error('Database connection error')
        process.exit(1)
    }
}

const startServer = async (port, server) =>{
    await initDatabaseConnection()
    server.listen(port, () =>{
        console.log(`${pc.green('Server in ascolto sulla porta')} ${pc.yellow(pc.bold(port))}`)
    })
}

module.exports = startServer
