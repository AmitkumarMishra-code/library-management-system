const mongoose = require('mongoose')

const Issue = require('../models/issue')
const Book = require('../models/book')
const Member = require('../models/member')


const searchIssue = async(type, key) => {
    if (type === 'book') {
        let issue = await Issue.findOne({ book: key })
        if (issue) {
            return issue.isIssued
        } else {
            return true
        }
    } else {
        let issue = await Issue.findOne({ member: key })
        if (issue) {
            return issue.isIssued
        } else {
            return true
        }
    }
}

const issueBook = async(bookName, memberId) => {
    let book = await Book.findOne({ title: bookName })
    if (book) {
        checkBookStatus = await searchIssue('book', book._id)
        if (!checkBookStatus) {
            console.log('\n\nBook is already issued to a member! Please try another book.\n\n')
            return
        }
    } else {
        console.log('\n\nInvalid Book Name. Try Again!\n\n')
        return
    }
    let member = await Member.findOne({ memberId: memberId })
    if (member) {
        checkMemberStatus = await searchIssue('member', member._id)
        if (!checkMemberStatus) {
            console.log('\n\nMembers are only allowed 1 book at a time.\n\n')
            return
        }
    } else {
        console.log('\n\nInvalid Member ID\n\n')
        return
    }
    let newIssue = await new Issue({ isIssued: false, book: book._id, member: member._id })
    await newIssue.save()
    console.log(`\n\n${bookName} issued to ${member.name} successfully. Due date for the book is 7 days from now!`)
}

const submitBook = async(bookName) => {
    let book = await Book.findOne({ title: bookName })
    let beforeReturn = await Issue.updateOne({ book: book._id, isIssued: false }, { $set: { isIssued: true } })
    calculateTime(beforeReturn.createdAt)
    console.log(`${bookName} returned successfully`)
}

function calculateTime(time) {
    timeInHours = time / 360000
    if (timeInHours > 168) {
        console.log('Book was overdue. You have a pending penalty against this book.\n\nPay the penalty if you want to issue a new book.')
    }
}

const activeIssues = async() => {
    let activeIssues = await Issue.find({ isIssued: false }).populate('book', 'title').populate('member', 'name')
    if (activeIssues.length) {
        console.log('\n\n---Start of List---\n')
        activeIssues.forEach(issue => console.log(`${issue.book.title} | issued to ${issue.member.name} on ${new Date(issue.createdAt).toString()}`))
        console.log('\n\n---End of List---\n')
    } else {
        console.log('\n\nNo Active Issues\n\n')
    }
}

const issueHistory = async(bookName) => {
    let book = await Book.findOne({ title: bookName })
    if (!book) {
        console.log('\n\nInvalid Book Name!\n\n')
        return
    }
    let issueHistory = await Issue.find({ book: book._id }).populate('member', 'name')
    if (!issueHistory.length) {
        console.log('\n\nBook has never been issued!\n\n')
    } else {
        console.log('\n\n---Start of List---\n')
        issueHistory.forEach(issue => console.log(`Issued to ${issue.member.name} on ${new Date(issue.createdAt).toString()}`))
        console.log('\n\n---End of List---\n')
    }
}

module.exports = {
    issueBook,
    submitBook,
    activeIssues,
    issueHistory
}