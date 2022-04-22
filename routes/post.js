const express = require('express')
const router = express.Router()
const errorHelper = require('../errorHelper')

const Post = require('../models/post')

router.get('/', async (req, res) => {
  try {
    const Posts = await Post.find()
    res.status(200).json({
      status: 'success',
      data: Posts,
    })
  } catch (error) {
    res.status(400).json({
      status: 'success',
      error,
    })
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const post = await Post.findOne({ _id: id })
    if (post) {
      res.status(200).json({
        status: 'success',
        data: post,
      })
    } else {
      errorHelper(res, '查無此ID')
    }
  } catch (error) {
    errorHelper(res, '', error)
  }
})

router.post('/', async (req, res) => {
  const data = req.body
  try {
    const newPost = await Post.create({
      name: data.name,
      content: data.content,
    })
    res.status(200).json({
      status: 'success',
      data: newPost,
    })
  } catch {
    errorHelper(res, '欄位未填寫正確', error)
  }
})

router.delete('/', async (req, res) => {
  try {
    await Post.deleteMany({})
    const posts = await Post.find()
    res.status(200).json({
      status: 'success',
      message: '全部刪除成功',
    })
  } catch (error) {
    errorHelper(res, '全部刪除失敗', error)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const test = await Post.findByIdAndDelete(id)
    if (test) {
      res.status(200).json({
        status: 'success',
        message: '刪除單筆成功',
      })
    } else {
      errorHelper(res, '查無此IP')
    }
  } catch (error) {
    errorHelper(res, '', error)
  }
})

router.patch('/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body
  try {
    const post = await Post.findByIdAndUpdate(id, { $set: data })
    if (post) {
      Object.assign(post, data)
      res.status(200).json({
        status: 'success',
        data: post,
      })
    } else {
      errorHelper(res, '或查無此ID')
    }
  } catch (error) {
    errorHelper(res, '欄位未填寫正確', error)
  }
})

module.exports = router
