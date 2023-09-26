const {nanoid} = require('nanoid');
const books = require ('./books');

const addBookHandler = (Request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if(name === undefined){
        const response = h.response ({
            status : "Failed",
            message : "Gagal menambah buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if(pageCount < readPage){
        const response = h.response({
            status: "Failed",
            message: "Gagal menambah buku. readPage tidak boleh melebihi pageCount",
        });
        response.code(400);
        return response;
    }
    const id = nanoid (16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess){
        const response = h.response({
            status : "success",
            message: "Berhasil menambahkan buku",
            data : {
                bookId : id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: "Failed",
        message : "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) =>{
    const {name, reading, finished} = request.query;

    let filteredBooks = books;

    if(name !== undefined){
        filteredBooks = filteredBooks.filter((book)=> book.name.toLowerCase().include(name.toLowerCase()));
    }
    if(reading !== undefined){
        filteredBooks = filteredBooks.filter((book)=> book.reading === !!Number(reading));
    }
    if(finished !== undefined){
        filteredBooks = filteredBooks.filter((book) => book.finished == !!Number(finished));
    }

    const response = h.response({
        status : "Succes",
        data : {
            books : filteredBooks.map((book) => ({
                id : book.id,
                name : book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) =>{
    const {id} = request.params;
    const book = books.filter((b) => b.id === id) [0];

    if(book !== undefined){
        return {
            status: "Success",
            data: {
                book,
            },
        };
    }

    const response = h.response ({
        status: "Failed",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const {id} = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id===id);

    if(index !== -1){
        if(name === undefined){
            const response = h.response({
                status: "Failed",
                message: "Gagal meng-Update buku",
            });
            response.code(400);
            return response;
        }
        
        if(pageCount < readPage){
            const response = h.response({
                status: "Failed",
                message: "Gagal meng-Update buku. pageCount tidak boleh lebih besar dari readPage",
            });
            response.code(400);
            return response;
        }

        const finished = (pageCount === readPage);

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };


        const response = h.response ({
            status: "Success",
            message: "Buku berhasil di Update"
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: "Failed",
        message: "Gagal meng Update buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = books.findIndex((note) => note.id === id);

    if(index !== -1){
        books.splice(index,1);
        const response = h.response({
            status : " Success",
            message: " Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }

    const response = h.response ({
        status: "Failed",
        message: "Gagal menghapus buku",
    });
    response.code(404);
    return response;
}

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};