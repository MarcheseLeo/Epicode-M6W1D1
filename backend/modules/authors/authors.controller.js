const { response } = require('express')
const authorService = require('./authors.service')
const UserNotFoundException = require('../../exceptions/users/UserNotFoundException')
const { sendEmail, sgtSend } = require('../email/index')

const cloudinary = require('cloudinary').v2;

const getMe = async (req, res, next) => {
    try {
        const authorId = req.user.id

        const author = await authorService.getAuthor(authorId)

        if (!author) throw new UserNotFoundException()

        res.status(200)
            .send(author)

    } catch (e) {
        next(e)
    }
}

const getAuthors = async (request, response, next) => {
    try {
        const { firstName } = request.query
        const authors = await authorService.getAuthors(firstName)

        if (authors.length === 0) {
            throw new UserNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                authors
            })
    } catch (error) {
        next(error)
    }
}

const getAuthor = async (request, response, next) => {
    try {
        const { id } = request.params
        const author = await authorService.getAuthor(id)

        response.status(200)
            .send({
                statusCode: 200,
                author
            })

    } catch (error) {
        next(error)
    }
}

const createAuthor = async (request, response, next) => {
    try {
        const { body } = request
        const author = await authorService.createAuthor(body)

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #00d66f;">Benvenuto su Strive Blog!</h1>
                <p>Ciao <strong>${author.firstName}</strong>,</p>
                <p>Siamo felicissimi di averti a bordo. Il tuo account è stato creato con successo utilizzando l'email ${author.email}.</p>
                <p>Non vediamo l'ora di leggere i tuoi articoli!</p>
            </div>
        `;

        await sgtSend(
            author.email,
            'Benvenuto su Strive Blog!',
            htmlTemplate
        ).catch(err => console.error("Errore invio email:", err))
        
        // await sendEmail(
        //     author.email,
        //     'Benvenuto su Strive Blog!',
        //     htmlTemplate
        // ).catch(err => console.error("Errore invio email:", err));

        response.status(201)
            .send({
                statusCode: 201,
                author
            })
    } catch (error) {
        next(error)
    }
}

const editAuthor = async (request, response, next) => {
    try {
        const { id } = request.params
        const { body } = request
        const author = await authorService.editAuthor(id, body)

        response.status(200)
            .send({
                statusCode: 200,
                author
            })
    } catch (error) {
        next(error)
    }
}
const deleteAuthor = async (request, response, next) => {
    try {
        const { id } = request.params
        const author = await authorService.deleteAuthor(id)

        if (!author) {
            throw new UserNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                author
            })
    } catch (error) {
        next(error)
    }
}

const uploadAvatar = async (req, res, next) => {
    try {
        const { authorId } = req.params

        if (!req.file) {
            return res.status(400)
                .send({
                    message: "Nessun file caricato"
                })
        }

        const currentAuthor = await authorService.getAuthor(authorId);
        if (!currentAuthor) {
            throw new UserNotFoundException();
        }

        if (currentAuthor.avatar && currentAuthor.avatar.includes("cloudinary.com")) {
            try {
                const urlParts = currentAuthor.avatar.split('/');
                const uploadIndex = urlParts.indexOf('upload');

                if (uploadIndex !== -1) {

                    let publicIdParts = urlParts.slice(uploadIndex + 1);

                    if (publicIdParts[0].startsWith('v')) {
                        publicIdParts = publicIdParts.slice(1);
                    }

                    const publicId = publicIdParts.join('/').split('.')[0];

                    console.log(`Sto cancellando il vecchio avatar con public_id: ${publicId}`);

                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (cloudinaryError) {
                console.error("Impossibile cancellare il vecchio file da Cloudinary:", cloudinaryError);
            }
        }

        const avatarUrl = req.file.path;
        const updatedAuthor = await authorService.editAuthor(authorId, { avatar: avatarUrl });

        res.status(200).send({
            message: "Avatar aggiornato con successo!",
            avatar: updatedAuthor.avatar
        });
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getMe,
    getAuthors,
    getAuthor,
    createAuthor,
    editAuthor,
    deleteAuthor,
    uploadAvatar
}