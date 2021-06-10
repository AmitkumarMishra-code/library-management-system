const express = require('express');
const { addNewUser, getUsers } = require('../controllers/usersController');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'static/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
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
    req.body.photoUrl = req.file.path
    let newUser = await addNewUser(req.body)
    if (newUser.status) {
        res.send(newUser.result)
    } else {
        res.status(400).send(newUser.result)
    }
})

module.exports = router