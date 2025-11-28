require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes')
const app = express()

const PORT = process.env.PORT || 3000

app.use(cors('*'))


app.get('/',(req,res)=>{
    res.send('Welcome to PetPal API')
}) // Welcome API FOR TEAM 4 :) 

app.use('/api',router)


app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
})




