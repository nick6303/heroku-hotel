const mongoose = require('mongoose')
const express = require('express')

const roomRouter = require('./routes/room')

const app = express()

app.use('/rooms', roomRouter)

app.use(express.json())

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const DATABASE = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(DATABASE)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => {
    console.log(error)
  })

const port = process.env.PORT || 3000
app.listen(port)
