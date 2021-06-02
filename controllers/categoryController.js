const mongoose = require('mongoose')

const Category = require('../models/category')

const printAllCategories = async() => {
    let data = await Category.find()
    console.log('\n\n---Start of List---\n')
    data.forEach(category => console.log(category.name))
    console.log('\n---End of List---\n\n')
}

const addNewCategory = async(categoryName) => {
    const category = await new Category({ name: categoryName }, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('\n\n' + categoryName + ' added to the database')
        }
    });
    await category.save()
}

const deleteCategory = async(categoryName) => {
    let category = await Category.findOne({ name: categoryName })
    if (!category) {
        console.log('\n\nNo record found')
    } else {
        category.remove()
        console.log('\n\n' + categoryName + ' removed successfully')
    }
}


module.exports = {
    printAllCategories,
    addNewCategory,
    deleteCategory,

}