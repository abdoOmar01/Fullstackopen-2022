const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

//blogs
describe('getting blogs from db', () => {
    test('blogs are returned as json', async () => {
        const response = 
            await api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 10000)
    
    test('id property is correctly named and defined', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body[0].id).toBeDefined()
    })
})

//users
describe('creating a new blog', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('secret', 10)
    
        const user = new User({
            username: 'init',
            name: 'reginald',
            passwordHash
        })
    
        await user.save()
    })
    
    test('a new blog post is saved successfully', async () => {
        const blog = {
            title: 'The Hex: A Masterclass in multi-genre game design',
            author: 'Daniel Mullins',
            url: 'sarsaparilla',
            likes: 6
        }

        const response = await api
            .post('/api/login')
            .send({
                username: 'init',
                password: 'secret'
            })
        
        const token = response.body.token
    
        await api
            .post('/api/blogs')
            .send(blog)
            .set('authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('The Hex: A Masterclass in multi-genre game design')
    })
    
    test('likes will default to zero if left empty', async () => {
        const blog = {
            title: 'unknown',
            author: 'anonymous',
            url: '<<>>'
        }

        const response = await api
        .post('/api/login')
        .send({
            username: 'init',
            password: 'secret'
        })
    
        const token = response.body.token
    
        await api
            .post('/api/blogs')
            .send(blog)
            .set('authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]
        expect(addedBlog.likes).toBe(0)
    })
    
    test('bad request when the title and/or url are missing', async () => {
        const blog = {
            author: 'abdo',
            likes: 42
        }

        const response = await api
        .post('/api/login')
        .send({
            username: 'init',
            password: 'secret'
        })
    
        const token = response.body.token
    
        await api
            .post('/api/blogs')
            .send(blog)
            .set('authorization', `bearer ${token}`)
            .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('unauthorized error when creating a blog without a token', async () => {
        const blog = {
            title: 'The Hex: A Masterclass in multi-genre game design',
            author: 'Daniel Mullins',
            url: 'sarsaparilla',
            likes: 6
        }

        await api
            .post('/api/blogs')
            .send(blog)
            .expect(401)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

//blogs, users
describe('deleting a blog', () => {
    test('a blog can be successfully deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    
        const titles = blogsAtEnd.map(b => b.title)
    
        expect(titles).not.toContain('Top 10 JRPGs of all time')
    })
})

//blogs
describe('updating a blog', () => {
    test('a blog can be successfully updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
    
        const blog = {
            title: 'new title',
            author: 'new author',
            url: 'new url',
            likes: 1
        }
    
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blog)
        
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    
        const titles = blogsAtEnd.map(b => b.title)
    
        expect(titles).not.toContain(blogToUpdate.title)
        expect(titles).toContain('new title')
    })
})

//users
describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('secret', 10)
    
        const user = new User({
            username: 'init',
            name: 'reginald',
            passwordHash
        })
    
        await user.save()
    })
    
    test('without specifiying a username', async () => {
        const usersAtStart = await helper.usersInDb()

        const user = {
            name: 'anonymous',
            password: '123456'
        }

        const result = await api
            .post('/api/users')
            .send(user)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
        
        expect(result.body.error).toBe('username required')
    })

    test('with a username that already exists', async () => {
        const usersAtStart = await helper.usersInDb()

        const user = {
            username: 'init',
            name: 'newuser',
            password: '123456'
        }

        const result = await api
            .post('/api/users')
            .send(user)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)

        expect(result.body.error).toBe('username must be unique')
    })

    test('with a username less than 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const user = {
            username: 'x',
            name: 'newuser',
            password: '123456'
        }

        const result = await api
            .post('/api/users')
            .send(user)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
        
        expect(result.body.error).toBe('username must be at least 3 characters long')
    })

    test('without specifying a password', async () => {
        const usersAtStart = await helper.usersInDb()

        const user = {
            username: 'validusername',
            name: 'newuser',
        }

        const result = await api
            .post('/api/users')
            .send(user)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)

        expect(result.body.error).toBe('password required')
    })

    test('with a password less than 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const user = {
            username: 'validusername',
            name: 'newuser',
            password: '1'
        }

        const result = await api
            .post('/api/users')
            .send(user)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)

        expect(result.body.error).toBe('password must be at least 3 characters long')
    })
})

afterAll(() => {
    mongoose.connection.close()
})