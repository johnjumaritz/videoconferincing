if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const route = express.Router()
const { v4: uuidV4 } = require('uuid')
route.get('/', async (req, res) => {
    return res.redirect(`/${uuidV4()}`)
})
route.get('/:id', async (req, res) => {
    return res.render('index', {roomid: req.params.id})
})
module.exports = route