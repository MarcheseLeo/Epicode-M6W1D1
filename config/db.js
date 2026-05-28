const mongoose = require('mongoose')
const databaseConnectionString = 'mongodb+srv://LeoMarchese:LeoMarchese2!@epicbooks.aupuspr.mongodb.net/'


const initDatabaseConnection = async () =>{
    try{
        await mongoose.connect(databaseConnectionString)
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
