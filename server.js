const http = require('http')
const mongoose = require('mongoose')
const Room = require('./models/room')
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

const requireListener = async (req, res) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  }
  if (req.url == '/rooms' && req.method == 'GET') {
    const rooms = await Room.find()
    res.writeHead(200, headers)
    res.write(
      JSON.stringify({
        ststus: 'sccess',
        rooms,
      })
    )
    res.end()
  } else if (req.url == '/rooms' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        })
        res.writeHead(200, headers)
        res.write(
          JSON.stringify({
            ststus: 'sccess',
            rooms: newRoom,
          })
        )
        res.end()
      } catch (error) {
        res.writeHead(200, headers)
        res.write(
          JSON.stringify({
            ststus: 'false',
            message: '欄位未正確填寫，或沒有此ID',
            error: error,
          })
        )
        res.end()
      }
    })
  } else if (req.url == '/rooms' && req.method == 'DELETE') {
    await Room.deleteMany({})
    res.writeHead(200, headers)
    res.write(
      JSON.stringify({
        status: 'sccess',
        message: '全部刪除',
      })
    )
    res.end()
  } else if (req.url.startsWith('/rooms/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop()
    try {
      await Room.findByIdAndDelete(id)
      res.writeHead(200, headers)
      res.write(
        JSON.stringify({
          status: 'sccess',
          message: '刪除成功',
        })
      )
      res.end()
    } catch {
      res.writeHead(400, headers)
      res.write(
        JSON.stringify({
          status: 'false',
          message: '查無此ID',
        })
      )
      res.end()
    }
  } else if (req.url.startsWith('/rooms/') && req.method == 'PATCH') {
    const id = req.url.split('/').pop()
    req.on('end', async () => {
      const data = JSON.parse(body)
      if (data) {
        try {
          const updateroom = await Room.findByIdAndUpdate(id, data)
          res.writeHead(200, headers)
          res.write(
            JSON.stringify({
              status: 'sccess',
              data: updateroom,
            })
          )
          res.end()
        } catch {
          res.writeHead(400, headers)
          res.write(
            JSON.stringify({
              status: 'false',
              message: '查無此ID',
            })
          )
          res.end()
        }
      } else {
        res.writeHead(400, headers)
        res.write(
          JSON.stringify({
            status: 'false',
            message: '資料格式錯誤',
          })
        )
        res.end()
      }
    })
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers)
    res.end()
  } else {
    res.writeHead(404, headers)
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    )
    res.end()
  }
}

const server = http.createServer(requireListener)

server.listen(process.env.PORT)
