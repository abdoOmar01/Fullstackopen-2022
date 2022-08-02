const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Top 10 JRPGs of all time',
        author: 'Abdelrahman Omar',
        url: 'test',
        likes: 14
    },
    {
        title: 'Why Dark Souls is the greatest game ever made',
        author: 'Mark Brown',
        url: 'gmtk',
        likes: 120
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb
}