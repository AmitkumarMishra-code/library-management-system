const mongoose = require('mongoose')

const Member = require('../models/member')

const printAllMembers = async() => {
    let members = await Member.find()
    console.log('\n\n---Start of List---\n')
    members.length ? members.forEach(member => console.log(`Member ID: ${member.memberId} | Name: ${member.name} | Member since: ${member.joinDate}`)) : console.log('No Members Found!')
    console.log('\n---End of List---\n\n')
}

const addNewMember = async(memberName) => {
    const member = new Member({ name: memberName }, (err) => {
        if (err) {
            console.log(err.message)
        }
    })
    let newMember = await member.save()
    console.log('\n\n' + memberName + ' joined successfully\n\n')
    return newMember
}

const searchMember = async(memberName) => {
    let members = await Member.find({ name: { "$regex": memberName } })
    console.log('\n\n---Search Result---\n')
    members.length ? members.forEach(member => console.log(`Member ID: ${member.memberId} | Name: ${member.name} | Member since: ${member.joinDate}`)) : console.log('No Members found! Try another search term')
    console.log('\n---End of Search Result---\n\n')
}

const deleteMember = async(memberId) => {
    let member = await Member.findOne({ memberId: memberId })
    if (!member) {
        console.log('\n\nNo record found')
    } else {
        member.remove()
        console.log('\n\n' + member.name + ' removed successfully')
    }
}

module.exports = {
    printAllMembers,
    addNewMember,
    searchMember,
    deleteMember
}