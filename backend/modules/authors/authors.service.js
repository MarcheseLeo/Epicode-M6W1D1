const AuthorSchema = require('./authors.schema')
const PostSchema = require('../posts/posts.schema')
const CommentSchema = require('../comments/comments.schema')


const getAuthors = async (name='') => {
    const authors = await AuthorSchema.find({firstName:new RegExp(name, 'i')}).populate('posts', 'title category')
    return authors
}

const getAuthor = async (id) => {
    const author = await AuthorSchema.findById(id)
    return author
}

const createAuthor = async (body) => {
    const newAuthor = new AuthorSchema(body)
    const authorToSave = await newAuthor.save()
    return authorToSave
}
const editAuthor = async (id, body) => {
    const updatedAuthor = await AuthorSchema.findByIdAndUpdate(id, body, { new: true });
    return updatedAuthor;
}

const deleteAuthor = async (id) => {
    const authorPosts = await PostSchema.find({ author: id })

    const allCommentIds = authorPosts.flatMap(post => post.comments)
    if (allCommentIds.length > 0) {
        await CommentSchema.deleteMany({ _id: { $in: allCommentIds } })
    }
    
    await PostSchema.deleteMany({ author: id })
    const authorToDelete = await AuthorSchema.findByIdAndDelete(id)

    if (!authorToDelete)
        return null

    return authorToDelete
}
module.exports = {
    getAuthors,
    getAuthor,
    createAuthor,
    editAuthor,
    deleteAuthor,
}
