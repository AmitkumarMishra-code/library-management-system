require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken')

app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(logger)
app.use(cors())
app.use(express.static('static'))
app.use(express.json())

app.use(express.urlencoded({ extended: true }))


//importing routes here

const bookRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const { printAllCategories } = require('./controllers/categoryController');


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})

app.get('/', (req, res) => {
    res.send('Welcome to Mclaren Library!')
})

app.use('/auth', authRouter)

app.get('/addBook', async(req, res) => {
    res.statusCode = (201)
    let categories = await printAllCategories()
    res.render('addBook', { categories: categories })
})

let validateRequest = (req, res, next) => {
    let authorized = req.headers.authorization
    if (!authorized) {
        res.status(403).send('You are not authorized to view this page')
    } else {
        try {
            let decoded = jwt.verify(authorized.split(' ')[1], process.env.ACCESS_TOKEN_SECRET)
            next()
        } catch (error) {
            res.status(403).send(error.message)
        }
    }
}

app.use('/books', validateRequest, bookRouter)




app.all(/.*/, (req, res) => {
    res.statusCode = (404)
    res.send('You seem lost. Contact the nearest librarian.')
})




const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is listening at port number : ${PORT}`);
})

function logger(req, res, next) {
    next()
    console.log(req.method, req.url, res.statusCode)
}