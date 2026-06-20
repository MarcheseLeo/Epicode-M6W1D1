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
        const { commentId } = req.params
        const comment = await commentService.getCommentById(commentId)

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

const createComment = async (req, res, next) => {
    try {
        const { body, user } = req
        const { id } = req.params

        const comment = await commentService.createComment({
            ...body,
            author: user.id
        }, id)
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
                message: 'Comment created succesfully',
                comment
            })
    } catch (e) {
        next(e)
    }
}

const editComment = async (req, res, next) => {
    try {
        const { body, user } = req
        const { commentId } = req.params
        const currentComment = await commentService.getCommentById(commentId)

        if (!currentComment) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No comment found'
                })
        }

        if (!currentComment.author || String(currentComment.author._id) !== user.id) {
            return res.status(403)
                .send({
                    statusCode: 403,
                    message: 'You can edit only your comments'
                })
        }

        const comment = await commentService.editComment(commentId, body)

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
        const { user } = req
        const currentComment = await commentService.getCommentById(commentId)

        if (!currentComment) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No comment found'
                })
        }

        if (!currentComment.author || String(currentComment.author._id) !== user.id) {
            return res.status(403)
                .send({
                    statusCode: 403,
                    message: 'You can delete only your comments'
                })
        }

        const comment = await commentService.deleteComment(commentId, id)

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
