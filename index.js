const readlineSync = require('readline-sync')
const mongoose = require('mongoose')

const Category = require('./models/category')
const { printAllCategories, addNewCategory, deleteCategory } = require('./controllers/categoryController')
const { printAllBooks, getCategoryId, addNewBook, searchBook, deleteBook } = require('./controllers/bookController')


function displayOptions() {
    console.log('\n\nWelcome to McLaren Library\n\n')
    console.log('Here are a few things you can do : \n')
    console.log('1. See all categories')
    console.log('2. Add a new category')
    console.log('3. Delete a category')
    console.log('4. See All Books')
    console.log('5. Add New Book')
    console.log('6. Delete a Book')
    console.log('7. Search for a book')
    console.log('8. Exit')

}

mongoose.connect('mongodb://127.0.0.1:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    showOptions()
})

async function showOptions() {
    displayOptions();

    let userChoice = readlineSync.question('Enter a choice : ')
    switch (userChoice) {
        case '1':
            await printAllCategories()
            break;
        case '2':
            let categoryName = readlineSync.question('What is the name of the category you want to add? ')
            await addNewCategory(categoryName)
            break;
        case '3':
            let categoryToDelete = readlineSync.question('Enter the name of the category to be deleted : ')
            await deleteCategory(categoryToDelete)
            break;
        case '4':
            await printAllBooks()
            break;
        case '5':
            let title = readlineSync.question('Title: ')
            let price = readlineSync.question('Price: Rs. ')
            let bookCategory = readlineSync.question('Category: ')
            let authors = readlineSync.question('Authors (comma separate multiple names): ')
            let response = await getCategoryId(bookCategory)
            if (response.id) {
                await addNewBook(title, price, response.id, authors)
            } else {
                console.log('Invalid Category!\nHere are list of available categories to help you out')
                console.log('\n\n---Start of List---\n')
                response.categories.forEach(category => console.log(category.name))
                console.log('\n---End of List---\n\n')
            }
            break;
        case '6':
            let deleteName = readlineSync.question('Enter a book name to delete (This action cannot be reversed): ')
            await deleteBook(deleteName)
            break;
        case '7':
            let searchName = readlineSync.question('Enter the full book name or partial name to search: ')
            await searchBook(searchName)
            break;
        default:
            mongoose.connection.close()
            return;
    }
    showOptions()
}


// showOptions()