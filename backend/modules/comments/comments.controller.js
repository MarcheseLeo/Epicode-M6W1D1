const commentService = require('./comments.service')

const getComments = async (req, res, next) => {
    try {
        const { id } = req.params
        const comments = await commentService.getComments(id)

        if (comments.length === 0) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No comment found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                comments
            })
    } catch (e) {
        next(e)
    }
}

const getCommentById = async (req, res, next) => {
    try {
        const { id } = req.params
        const comment = await commentService.getCommentById(id)

        if (comment.length === 0) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No comment found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                comment
            })
    } catch (e) {
        next(e)
    }
}

const createComment = async (req, res, next) => {
    try {
        const { body } = req
        const { id } = req.params

        const comment = await commentService.createComment(body, id)
        if (!comment) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No comment found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'Comment created succesfully'
            })
    } catch (e) {
        next(e)
    }
}

const editComment = async (req, res, next) => {
    try {
        const { body } = req
        const { commentId } = req.params
        const comment = await commentService.editComment(commentId, body)

        if (!comment) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No comment found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                comment
            })
    } catch (e) {
        next(e)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const { id, commentId } = req.params

        const comment = await commentService.deleteComment(commentId, id)

        if (!comment) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No comment found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'Comment deleted succesfully'
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getComments,
    getCommentById,
    createComment,
    editComment,
    deleteComment
}