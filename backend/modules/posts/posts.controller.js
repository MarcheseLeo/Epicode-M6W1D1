const { response } = require('express')
const postService = require('./posts.service')
const PostNotFoundException = require('../../exceptions/posts/PostNotFoundException')

const {sendEmail,sgtSend} = require('../email/index');

const cloudinary = require('cloudinary').v2

const getPosts = async (request, response, next) => {
    const { page = 1, pageSize = 3 } = request.query
    try {
        const { posts, totalPosts, totalPages } = await postService.getPosts(page, pageSize)

        if (posts.length === 0) {
            throw new PostNotFoundException()
        }

        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage
            ? `${process.env.BACKEND_BASE_URL}/posts?page=${page - 1}&pageSize=${pageSize}`
            : null;

        const hasNextPage = page < totalPages;
        const nextPage = hasNextPage
            ? `${process.env.BACKEND_BASE_URL}/posts/?page=${Number(page) + 1}&pageSize=${pageSize}`
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
        next(error)
    }
}

const getPostById = async (request, response, next) => {
    try {
        const { id } = request.params
        const post = await postService.getPostById(id)
        if (!post) {
            throw new PostNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        next(error)
    }
}

const getByTitle = async (request, response, next) => {
    try {
        const { title } = request.query

        const posts = await postService.getByTitle(title)

        if (posts.length === 0) {
            throw new PostNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                posts
            })
    } catch (error) {
        next(error)
    }
}

const getPostByAuthor = async (request, response, next) => {
    try {
        const { id } = request.params
        const posts = await postService.getPostByAuthor(id)

        if (posts.length === 0) {
            throw new PostNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                posts
            })
    } catch (error) {
        next(error)
    }
}
const createPost = async (request, response, next) => {
    try {
        const { body, user } = request

        const post = await postService.createPost({
            ...body,
            author: user.id
        })

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Ottimo lavoro, ${user.firstName}! 🎉</h2>
                <p>Il tuo nuovo articolo intitolato "<strong>${post.title}</strong>" è stato pubblicato con successo sul nostro blog.</p>
                <p>Continua così!</p>
            </div>
        `;

        sgtSend(
            user.email,
            'Nuovo articolo pubblicato!',
            htmlTemplate
        ).catch(err => console.error("Errore invio email post:", err));

        // sendEmail(
        //     user.email,
        //     'Nuovo articolo pubblicato!',
        //     htmlTemplate
        // ).catch(err => console.error("Errore invio email post:", err));

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        next(error)
    }
}

const editPost = async (request, response, next) => {
    try {
        const { id } = request.params
        const { body, user } = request
        const currentPost = await postService.getPostById(id)

        if (!currentPost) {
            throw new PostNotFoundException()
        }

        if (String(currentPost.author._id) !== user.id) {
            return response.status(403).send({
                statusCode: 403,
                message: 'You can edit only your posts'
            })
        }

        const post = await postService.editPost(id, body)

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        next(error)
    }
}

const deletePost = async (request, response, next) => {
    try {
        const { id } = request.params
        const { user } = request
        const currentPost = await postService.getPostById(id)

        if (!currentPost) {
            throw new PostNotFoundException()
        }

        if (String(currentPost.author._id) !== user.id) {
            return response.status(403).send({
                statusCode: 403,
                message: 'You can delete only your posts'
            })
        }

        const post = await postService.deletePost(id)

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        next(error)
    }
}

const uploadPostCover = async (request, response, next) => {
    try {
        const { id } = request.params;

        if (!request.file) {
            return response.status(400).send({ message: "Nessun file caricato." });
        }

        const currentPost = await postService.getPostById(id);
        if (!currentPost) {
            throw new PostNotFoundException();
        }

        if (String(currentPost.author._id) !== request.user.id) {
            return response.status(403).send({
                statusCode: 403,
                message: 'You can update only your post cover'
            })
        }

        if (currentPost.cover && currentPost.cover.includes("cloudinary.com")) {
            try {
                const urlParts = currentPost.cover.split('/');
                const uploadIndex = urlParts.indexOf('upload');

                if (uploadIndex !== -1) {
                    let publicIdParts = urlParts.slice(uploadIndex + 1);
                    if (publicIdParts[0].startsWith('v')) {
                        publicIdParts = publicIdParts.slice(1);
                    }
                    const publicId = publicIdParts.join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (err) {
                console.error("Errore cancellazione vecchia cover:", err);
            }
        }

        const coverUrl = request.file.path;
        const updatedPost = await postService.editPost(id, { cover: coverUrl });

        response.status(200).send({
            message: "Cover aggiornata con successo!",
            post: updatedPost
        });

    } catch (error) {
        next(error);
    }
}
module.exports = {
    getPosts,
    getPostById,
    getByTitle,
    getPostByAuthor,
    createPost,
    editPost,
    deletePost,
    uploadPostCover
}
