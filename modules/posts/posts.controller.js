const { response } = require('express')
const postService = require('./posts.service')

const getPosts = async (request, response) => {
    const { page = 1, pageSize = 3 } = request.query
    try {
        const { posts, totalPosts, totalPages } = await postService.getPosts(page, pageSize)

        if (posts.length === 0) {
            response.status(404)
                .send({
                    statusCode: 404,
                    message: 'No post found'
                })
        }
        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage
            ? `http://localhost:9099/posts?page=${page - 1}&pageSize=${pageSize}`
            : null;

        const hasNextPage = page < totalPages;
        const nextPage = hasNextPage
            ? `http://localhost:9099/posts/?page=${Number(page) + 1}&pageSize=${pageSize}`
            : null;

        response.status(200)
            .send({
                statusCode: 200,
                prevPage,
                nextPage,
                totalPages,
                totalPosts,
                page,
                pageSize,
                posts,

            })
    } catch (error) {
        console.log(error.message)
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during posts request'
            })
    }
}

const getPostById = async (request, response) => {
    try {
        const { id } = request.params
        const post = await postService.getPostById(id)

        if (!post) {
            response.status(404)
                .send({
                    statusCode: 404,
                    message: 'No post found'
                })
        }

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during posts request'
            })
    }
}

const getByCategory = async (request, response) => {
    try {
        const { category } = request.query
        console.log(category)
        const posts = await postService.getByCategory(category)

        if (!posts) {
            response.status(404)
                .send({
                    statusCode: 404,
                    message: 'No post found'
                })
        }

        response.status(200)
            .send({
                statusCode:200,
                posts
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during posts request'
            })
    }
}

const createPost = async (request, response) => {
    try {
        const { body } = request
        const { id } = request.params
        const posts = await postService.createPost(body)

        if (!posts.length === 0) {
            response.status(404)
                .send({
                    statusCode: 404,
                    message: 'No post found'
                })
        }

        response.status(200)
            .send({
                statusCode: 200,
                posts
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during posts request'
            })
    }
}

const editPost = async (request, response) => {
    try {
        const { id } = request.params
        const { body } = request
        const post = await postService.editPost(id, body)
        if (!post) {
            response.status(404)
                .send({
                    statusCode: 404,
                    message: 'No post found'
                })
        }

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during posts request'
            })
    }
}

const deletePost = async (request, response) => {
    try {
        const { id } = request.params
        const post = await postService.deletePost(id)

        if (!post) {
            response.status(404)
                .send({
                    statusCode: 404,
                    message: 'No post found'
                })
        }
        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        response.status(500)
            .send({
                statusCode: 500,
                message: 'Error during posts request'
            })
    }
}
module.exports = {
    getPosts,
    getPostById,
    getByCategory,
    createPost,
    editPost,
    deletePost
}