// const {query} = require('@hapi/hapi/lib/validation');
const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

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
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book)=> book.id === id).length > 0;

    if (name === undefined) {
        // client tidak menyertakan nama buku
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        // jumlah halaman buku yang dibaca lebih besar daripada jumlah halaman buku yang ada
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    // const {name} = request.query;
    const specificBooks = books;

    // if (name !== undefined) {
    //     // bila terdapat query nama di pencarian
    //     specificBooks = specificBooks.filter((specificBook) => specificBook.name.toLowerCase().includes(name.toLowerCase()));

    //     const response = h.response({
    //         status: 'success',
    //         data: {
    //           books: specificBooks.map((book) => ({
    //             id: book.id,
    //             name: book.name,
    //             publisher: book.publisher,
    //           })),
    //         },
    //       });
    //       response.code(200);
    //       return response;
    // }

    // if (reading === 1) {
    //     specificBooks = specificBooks.filter((specificBook) => specificBook.reading === !!Number(reading));
    //     const response = h.response({
    //         status: 'success',
    //         data: {
    //           books: specificBooks.map((book) => ({
    //             id: book.id,
    //             name: book.name,
    //             publisher: book.publisher,
    //           })),
    //         },
    //       });
    //       response.code(200);
    //       return response;
    // }

    // if (finished === 1) {
    //     specificBooks = specificBooks.filter((specificBook) => specificBook.finished === !!Number(finished));
    //     const response = h.response({
    //         status: 'success',
    //         data: {
    //           books: specificBooks.map((book) => ({
    //             id: book.id,
    //             name: book.name,
    //             publisher: book.publisher,
    //           })),
    //         },
    //       });
    //       response.code(200);
    //       return response;

    const response = h.response({
        status: 'success',
        data: {
          books: specificBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
};

const getBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const updateAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updateAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbaharui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku memperbaharui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
