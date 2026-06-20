const CommentSchema = require('./comments.schema')
const PostSchema = require('../posts/posts.schema')

const getComments = async (postId) =>{
    const post = await PostSchema.findById(postId).populate({
        path: 'comments',
        populate: {
            path: 'author',
            select: 'firstName lastName email avatar'
        }
    })

    return post ? post.comments : []
}

const getCommentById = async (id) =>{
    return await CommentSchema.findById(id).populate('author', 'firstName lastName email avatar')
}

const createComment = async (body, postId) =>{
    const newComment = new CommentSchema(body)
    const commentToSave = await newComment.save()

    await PostSchema.updateOne({_id:postId}, {$push: {comments: commentToSave}})
    return commentToSave
}

const editComment = async(id, body) =>{
    return await CommentSchema.findByIdAndUpdate(id, body, {new:true})
        .populate('author', 'firstName lastName email avatar')
}

const deleteComment = async(id, postId) =>{
    const commentToDelete = await CommentSchema.findByIdAndDelete(id)

    if(!commentToDelete)
        return null

    await PostSchema.findByIdAndUpdate(
        postId,
        {$pull:{comments: commentToDelete.id}}
    )

    return commentToDelete
}

module.exports ={
    getComments,
    getCommentById,
    createComment,
    editComment,
    deleteComment
}
