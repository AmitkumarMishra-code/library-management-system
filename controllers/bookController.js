const mongoose = require('mongoose')

const Category = require('../models/category')
const Book = require('../models/book')


const printAllBooks = async() => {
    let books = await Book.find()
    console.log('\n\n---Start of List---\n')
    books.length ? books.forEach(book => console.log(`${book.title}, by ${book.authors.join(',')}`)) : console.log('No Books Found!')
    console.log('\n---End of List---\n\n')
}

const addNewBook = async(title, price, category, authors) => {
    const book = new Book({ title: title, price: price, category: category, authors: authors.split(',') });
    let newBook = await book.save()
    console.log(title + ' added successfully')
}

const getCategoryId = async(categoryName) => {
    let category = await Category.findOne({ name: categoryName })
    if (category) {
        return { id: category._id, categories: [] }
    } else {
        let categories = await Category.find()
        return { id: null, categories: categories }
    }
}

const searchBook = async(bookName) => {
    let books = await Book.find({ title: { "$regex": bookName } })
    console.log('\n\n---Search Result---\n')
    books.length ? books.forEach(book => console.log(`${book.title}, by ${book.authors.join(',')}`)) : console.log('No books found! Try another search term')
    console.log('\n---End of Search Result---\n\n')
}

const deleteBook = async(bookName) => {
    let book = await Book.findOne({ title: bookName })
    if (!book) {
        console.log('\n\nNo record found')
    } else {
        book.remove()
        console.log('\n\n' + bookName + ' removed successfully')
    }
}

module.exports = {
    printAllBooks,
    addNewBook,
    getCategoryId,
    searchBook,
    deleteBook
}