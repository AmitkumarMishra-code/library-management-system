const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')

app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(logger)
app.use(express.static('static'))
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(cors())

//importing routes here

const bookRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const { printAllCategories } = require('./controllers/categoryController');


mongoose.connect('mongodb://127.0.0.1:27017/library', {
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

app.use('/books', bookRouter)




app.all(/.*/, (req, res) => {
    res.statusCode = (404)
    res.send('You seem lost. Contact the nearest librarian.')
})




const PORT = 3300
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})

function logger(req, res, next) {
    next()
    console.log(req.method, req.url, res.statusCode)
}