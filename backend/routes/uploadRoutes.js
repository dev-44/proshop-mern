import express from 'express'
const router = express.Router()
import Image from '../models/imageModel.js'
import path from 'path'
import multer from 'multer'
import {protect, isAdmin} from '../middleware/authMiddleware.js'
import fs from 'fs'
import mongoose from 'mongoose'

const storage = multer.diskStorage({

  destination(req, file, cb) {
    cb(null, 'uploads/')
  },

  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },

})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router.post('/', upload.single('image'), async(req, res) => {
  //res.send(`/${req.file.path}`)

  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString('base64')
  
  var final_img = {
      contentType:req.file.mimetype,
      data: Buffer.from(encode_img, 'base64')
  }

  console.log(final_img)

  try {
    const newImage = await Image.create({img: final_img})

    if (newImage) {
      console.log('image uploaded in the db!!')
      
      /*
      res.contentType(req.file.mimetype)
      console.log(newImage.img.data.buffer)
      return res.status(201).send(newImage.img.data.buffer)
      */

      res.contentType('json')
      //console.log(newImage)
      res.send(newImage)
    }

  } catch (error) {
    console.log(error)
  }
})

export default router