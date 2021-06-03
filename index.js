const readlineSync = require('readline-sync')
const mongoose = require('mongoose')

const Category = require('./models/category')
const { printAllCategories, addNewCategory, deleteCategory } = require('./controllers/categoryController')
const { printAllBooks, getCategoryId, addNewBook, searchBook, deleteBook, getBooksOfCategory } = require('./controllers/bookController')
const { printAllMembers, addNewMember, searchMember, deleteMember } = require('./controllers/memberController')
const { issueBook, submitBook, activeIssues, issueHistory } = require('./controllers/issueController')


function displayOptions() {
    console.log('\n\nWelcome to McLaren Library\n\n')
    console.log('Here are a few things you can do : \n')
    console.log('---Category Options---')
    console.log('1. See all categories')
    console.log('2. Add a new category')
    console.log('3. Delete a category')
    console.log('---Book Options---')
    console.log('4. See All Books')
    console.log('5. Add New Book')
    console.log('6. Delete a Book')
    console.log('7. Search for a book')
    console.log('8. Get all books of a category')
    console.log('---Member Options---')
    console.log('9. See All Members')
    console.log('10. Add a New Member')
    console.log('11. Delete a Member')
    console.log('12. Search for a Member')
    console.log('---Issue Options---')
    console.log('13. Issue a book')
    console.log('14. Return a book')
    console.log('15. List all Active Issues')
    console.log('16. Issue History of a book')
    console.log('17. Exit')
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
        case '8':
            let searchCategoryName = readlineSync.question('Enter a category name: ')
            await getBooksOfCategory(searchCategoryName)
            break;
        case '9':
            await printAllMembers()
            break;
        case '10':
            let memberName = readlineSync.question('Member Name: ')
            let addedMember = await addNewMember(memberName)
            console.log(`Member Id: ${addedMember.memberId} | Name: ${addedMember.name} | joined on: ${new Date(addedMember.joinDate).toString()}`)
            break;
        case '11':
            let memberId = readlineSync.question('Enter Member Id to delete Member (This action cannot be reversed): ')
            await deleteMember(memberId)
            break;
        case '12':
            let searchTerm = readlineSync.question('Enter the full member name or partial name to search: ')
            await searchMember(searchTerm)
            break;
        case '13':
            let bookName = readlineSync.question('Book Name: ')
            let issueMemberId = readlineSync.question('Member ID: ')
            await issueBook(bookName, issueMemberId)
            break;
        case '14':
            let returnBookName = readlineSync.question('Book Name: ')
            await submitBook(returnBookName)
            break;
        case '15':
            await activeIssues()
            break;
        case '16':
            let historyBookName = readlineSync.question('Book Name: ')
            await issueHistory(historyBookName)
            break;
        default:
            mongoose.connection.close()
            return;
    }
    showOptions()
}


// showOptions()