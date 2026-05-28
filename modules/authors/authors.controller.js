const { response } = require('express')
const authorService = require('./authors.service')

const getAuthors = async (request, response) => {
    try {
        const authors = await authorService.getAuthors()
        response.status(200)
            .send({
                statusCode: 200,
                authors
            })

    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during auhtors request'
            })
    }
}

const getAuthor = async (request, response) => {
    try {
        const { id } = request.params
        const author = await authorService.getAuthor(id)
        response.status(200)
            .send({
                statusCode: 200,
                author
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during auhtor request'
            })
    }
}

const createAuthor = async (request, response) => {
    try {
        const { body } = request
        const author = await authorService.createAuthor(body)
        response.status(201)
            .send({
                statusCode: 201,
                author
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during auhtor creation',
                errorDetail: error.message
            })
    }
}

const editAuthor = async (request, response) =>{
    try{
        const {id} = request.params
        const {body} = request
        const author = await authorService.editAuthor(id, body)
        response.status(200)
            .send({
                statusCode: 200,
                author
            })
    } catch(error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during auhtor update',
                errorDetail: error.message
            })
    }
}
const deleteAuthor = async (request, response) => {
    try {
        const { id } = request.params
        const author = await authorService.deleteAuthor(id)
        response.status(200)
            .send({
                statusCode: 200,
                author
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during auhtor delete',
                errorDetail: error.message
            })
    }
}

module.exports = {
    getAuthors,
    getAuthor,
    createAuthor,
    editAuthor,
    deleteAuthor,
}