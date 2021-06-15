const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/users')


const addNewUser = async({ name, email, password, photoUrl }) => {
    let emailCheck = /.*@.*\..*/
    if (!emailCheck.test(email)) {
        return { status: false, result: 'Invalid Email Id' }
    }
    if (!photoUrl || !photoUrl.length) {
        photoUrl = '/images/default.png'
    }
    if (!password.length) {
        return { status: false, result: 'Password cannot be empty' }
    }
    let hash = await bcrypt.hash(password, 10)
    try {
        let user = new User({ name, email, password: hash, photoUrl })
        let savedUser = await user.save()
        return { status: true, result: savedUser }
    } catch (err) {
        return { status: false, result: 'Error' + err.message }
    }
}

const getUsers = async() => {
    try {
        let users = await User.find()
        return { status: true, result: users }
    } catch (error) {
        return { status: false, result: 'Error' + error.message }
    }
}

const loginUser = async({ email, password }) => {
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return { status: false, result: { message: 'Invalid Email' } }
        }
        let result = await bcrypt.compare(password, user.password)
        if (!result) {
            return { status: false, result: { message: 'Invalid Password' } }
        } else {
            return { status: true, result: user }
        }
    } catch (error) {
        return { status: false, result: { message: 'Error' + error.message } }
    }
}

module.exports = {
    addNewUser,
    getUsers,
    loginUser
}