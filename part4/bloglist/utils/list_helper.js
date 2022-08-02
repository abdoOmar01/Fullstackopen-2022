const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0
    : blogs.reduce((p, c) => p + c.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    //const maxLikes = Math.max(...blogs.map(b => b.likes))
    //const blog = blogs.find(b => b.likes === maxLikes)
    const blog = blogs.reduce((max, b) => max.likes > b.likes ? max : b)
    return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const authors = lodash.groupBy(blogs, 'author')
    const blogCount = lodash.mapValues(authors, a => a.length)

    const author = Object.keys(authors).reduce((p, c) => blogCount[p] > blogCount[c] ? p : c)

    return {
        author,
        blogs: blogCount[author]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) { 
        return {}
    }

    const authors = lodash.groupBy(blogs, 'author')
    const likeCount = lodash.mapValues(authors, a => a.reduce((p, c) => p + c.likes, 0))

    const author = Object.keys(likeCount).reduce((p, c) => likeCount[p] > likeCount[c] ? p : c)

    return {
        author,
        likes: likeCount[author]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}