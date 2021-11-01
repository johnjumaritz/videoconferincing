if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const route = express.Router()

route.get('/', async (req, res) => {
    return res.render('index')
})
module.exports = route