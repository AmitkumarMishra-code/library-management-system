const express = require('express');
const { addNewBook, getCategoryId, printAllBooks } = require('../controllers/bookController');
// const mongoose = require('mongoose')

const router = express.Router()

router
    .route('/')
    .get(async(req, res) => {
        let books = await printAllBooks()
        console.log(books)
        res.render('index', { message: 'Welcome to Mclaren Library!', serverBooks: books })
    })
    .post((req, res) => {
        res.send('Adding New Book')
    });

router.post('/add-book', async(req, res) => {
    let response = await getCategoryId(req.body.category)
    await addNewBook(req.body.title, req.body.price, response.id, req.body.authors)
    res.redirect(201, '/books')
})

let bookIdHandler1 = (req, res, next) => {
    let id = req.params.bookID;
    if (Number(id) !== NaN && Number(id) > 0) {
        next()
    } else {
        res.send('Invalid Book Id')
    }
}

let bookIdHandler2 = (req, res) => {
    res.send('Book Requested: ' + req.params.bookID)
}

router.get('/:bookID', [bookIdHandler1, bookIdHandler2])



module.exports = router;