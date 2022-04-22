const express = require('express')
const router = express.Router()
const errorHelper = require('../errorHelper')
const Room = require('../models/room')

router.get('/', async (req, res) => {
  const rooms = await Room.find()
  res.status(200).json({
    ststus: 'sccess',
    rooms,
  })
})

router.post('/', async (req, res) => {
  try {
    const data = req.body
    const newRoom = await Room.create({
      name: data.name,
      price: data.price,
      rating: data.rating,
    })
    res.status(200).json({
      ststus: 'sccess',
      room: newRoom,
    })
  } catch (error) {
    errorHelper(res, '欄位未正確填寫，或沒有此ID', error)
  }
})

router.delete('/', async (req, res) => {
  try {
    await Room.deleteMany({})
    res.status(200).json({
      status: 'sccess',
      message: '全部刪除',
    })
  } catch (error) {
    errorHelper(res, '無法刪除', error)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    await Room.findByIdAndDelete(id)
    res.status(200).json({
      status: 'sccess',
      message: '刪除成功',
    })
  } catch (error) {
    errorHelper(res, '查無此ID', error)
  }
})

router.patch('/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body
  if (data) {
    try {
      const updateroom = await Room.findByIdAndUpdate(id, { $set: data })
      res.status(200).json({
        status: 'sccess',
        data: updateroom,
      })
    } catch (error) {
      errorHelper(res, '查無此ID', error)
    }
  } else {
    errorHelper(res, '資料格式錯誤')
  }
})

module.exports = router
