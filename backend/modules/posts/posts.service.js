const PostSchema = require('./posts.schema')
const AuthorSchema = require('../authors/authors.schema')
const CommentSchema = require('../comments/comments.schema')
const bcrypt = require('bcrypt')

const getPosts = async (page, pageSize) => {
    const posts = await PostSchema.find()
        .populate('author', 'firstName lastName email dob')
        .populate('comments', 'rate comment')
        .limit(pageSize)
        .skip((page - 1) * pageSize)

    const totalPosts = await PostSchema.countDocuments()
    const totalPages = Math.ceil(totalPosts / pageSize)
    return {
        page: Number(page),
        pageSize: Number(pageSize),
        totalPosts,
        totalPages,
        posts
    }
}

const getPostById = async (id) => {
    return await PostSchema.findById(id).populate('author',  'firstName lastName email dob')
}

const getByTitle = async (query) => {
    return await PostSchema.find({
        title: {
            $regex: query,
            $options: 'i',
        }
    })
}

const getPostByAuthor = async (authorId) => {
    return await PostSchema.find({ author: authorId }).populate('author')
}

const createPost = async (body) => {
    const post = new PostSchema(body)
    const savedPost = await post.save()

    await AuthorSchema.updateOne({ _id: body.author }, { $push: { posts: savedPost } })
    return savedPost
}

const editPost = async (id, body) => {
    return post = await PostSchema.findByIdAndUpdate(id, body, { new: true })
}

const deletePost = async (id) => {
    const postToDelete = await PostSchema.findById(id)

    if (!postToDelete)
        return null

    await CommentSchema.deleteMany({ _id: { $in: postToDelete.comments } })

    await AuthorSchema.findByIdAndUpdate(
        postToDelete.author,
        { $pull: { posts: postToDelete.id } }
    )

    return await PostSchema.findByIdAndDelete(id)
}

module.exports = {
    getPosts,
    getPostById,
    getByTitle,
    getPostByAuthor,
    createPost,
    editPost,
    deletePost
}