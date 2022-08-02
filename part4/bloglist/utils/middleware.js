const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }
    request.user = await User.findById(decodedToken.id)

    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        if (error.message.includes('required')) {
            return response.status(400)
                .json({ error: 'username required' })
        } else if (error.message.includes('length')) {
            return response.status(400)
                .json({ error: 'username must be at least 3 characters long' })
        }
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' })
    }

    next(error)
}

module.exports = {
    tokenExtractor,
    userExtractor,
    errorHandler
}