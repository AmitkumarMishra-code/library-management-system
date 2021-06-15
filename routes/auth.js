const express = require('express');
const { addNewUser, getUsers, loginUser } = require('../controllers/usersController');
const jwt = require('jsonwebtoken')
const multer = require('multer')
const refreshTokens = []
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'static/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const multipart = multer({ storage: storage })
const router = express.Router()

router.get('/', async(req, res) => {
    let users = await getUsers()
    if (users.status) {
        res.send(users.result)
    } else {
        res.status(400).send(users.result)
    }
})

router.post('/signup', multipart.single('profilePic'), async(req, res) => {
    if (req.body.photoUrl) {
        req.body.photoUrl = req.file.filename
    }
    let newUser = await addNewUser(req.body)
    if (newUser.status) {
        res.send(newUser.result)
    } else {
        res.status(400).send(newUser.result)
    }
})

router.post('/login', async(req, res) => {
    console.log(req.body)
    let loginResult = await loginUser(req.body)
    if (loginResult.status) {
        let payload = {
            email: loginResult.result.email,
        }
        let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })
        refreshTokens.push(refreshToken)
        res.status(200).json({ 'access_Token': token, 'refresh_Token': refreshToken })
    } else {
        res.status(400).json(loginResult.result)
    }
})

router.post('/token', (req, res) => {
    let { token } = req.body
    if (!token || !refreshTokens.includes(token)) {
        res.status(403).send('Invalid Token')
    } else {
        try {
            let decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
            let payload = { email: decoded.email }
            let newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
            res.status(200).json({ 'access_Token': newToken })
        } catch (error) {
            res.status(403).send(error.message)
        }
    }
})

module.exports = router