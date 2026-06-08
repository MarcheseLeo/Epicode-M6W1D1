const postsSchema = require('./posts.schema')
const PostSchema = require('./posts.schema')

const getPosts = async (page, pageSize) => {
    const posts = await PostSchema.find()
        .populate('author')
        .limit(pageSize)
        .skip((page - 1) * pageSize)

    const totalPosts = await postsSchema.countDocuments()
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
    return await PostSchema.findById(id).populate('author')
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
    return await post.save()
}

const editPost = async (id, body) => {
    return post = PostSchema.findByIdAndUpdate(id, body, { new: true })
}

const deletePost = async (id) => {
    const post = await PostSchema.findByIdAndDelete(id)
    return post
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