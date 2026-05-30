const mongoose = require('mongoose')

const initDatabaseConnection = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connected')
    }catch(error){
        console.error('Database connection error')
        process.exit(1)
    }
}

const startServer = async (port, server) =>{
    await initDatabaseConnection()
    server.listen(port, () =>{
        console.log(`Server in ascolto sulla porta ${port}`)
    })
}

module.exports = startServer
