const AuthorSchema = require('./authors.schema')
const PostSchema = require ('../posts/posts.schema')

const getAuthors = async () => {
    const authors = await AuthorSchema.find().populate('posts', 'title category')
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
    const authorToDelete = await AuthorSchema.findByIdAndDelete(id)
    
    if(!authorToDelete)
        return null
    

}
module.exports = {
    getAuthors,
    getAuthor,
    createAuthor,
    editAuthor,
    deleteAuthor,
}