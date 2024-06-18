const connection = require('../config/mysql')
const path = require('path')
const fs = require('fs');

const store = (req, res) => {
    const{judul_buku, penulis, tahun_terbit,genre, ringkasan_buku} = req.body;
    const image = req.file;
    if (image) {
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target)
        connection.query({
            sql: 'INSERT INTO books (judul_buku, penulis, tahun_terbit, genre, ringkasan_buku, image) VALUES (?,?,?,?,?,?)',
            values: [judul_buku, penulis, tahun_terbit, genre, ringkasan_buku, `http://localhost:5000/public/${image.originalname}`]
        }, (error, results, fields) => {
            if (error) {
              console.error("Error deleting book:", error);
              return res.status(500).json({ status: 'ERROR', message: 'Failed' });
            }
            return res.status(200).json({ status: 'SUCCESS', message: 'successfully' });
          });
    }
}

const index = (req, res) => {
    connection.query('SELECT id, judul_buku, penulis, tahun_terbit, genre, ringkasan_buku, image FROM books', (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.json(results); // Pastikan mengirim hasil sebagai JSON
        }
    });
};

const view = (req, res) => {
    connection.query({
        sql: 'SELECT * FROM books WHERE id = ?',
        values: [req.params.id]
    },
    (error, results, fields) => {
        if (error) {
          console.error("Error fetching book:", error);
          return res.status(500).json({ status: 'ERROR', message: 'Failed to fetch book' });
        }
        if (results.length === 0) {
          return res.status(404).json({ status: 'ERROR', message: 'Book not found' });
        }
        return res.status(200).json({ status: 'SUCCESS', data: results[0] });
      });
}


const deleteBook = (req, res) => {
    const { id } = req.params;
    connection.query(
    {
      sql: 'DELETE FROM books WHERE id = ?',
      values: [id]
    },
    (error, results, fields) => {
      if (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({ status: 'ERROR', message: 'Failed to delete book' });
      }
      return res.status(200).json({ status: 'SUCCESS', message: 'Book deleted successfully' });
    }
  );
};

const update = (req, res) => {
    const{judul_buku, penulis, tahun_terbit,genre, ringkasan_buku} = req.body;
    const image = req.file;
    let sql = '';
    let values = [];
    if (image) {
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);
        sql = 'UPDATE books SET judul_buku = ?, penulis = ?, tahun_terbit = ?, genre = ?, ringkasan_buku = ?, image = ? WHERE id = ?';
        values = [judul_buku, penulis, tahun_terbit, genre, ringkasan_buku, `http://localhost:5000/public/${image.originalname}`, req.params.id]
    } else {
        sql = 'UPDATE books SET judul_buku = ?, penulis = ?, tahun_terbit = ?, genre = ?, ringkasan_buku = ? WHERE id = ?';
        values = [judul_buku, penulis, tahun_terbit, genre, ringkasan_buku, req.params.id]
    }
    connection.query({sql, values},(error, results, fields) => {
        if (error) {
          console.error("Error deleting book:", error);
          return res.status(500).json({ status: 'ERROR', message: 'Failed' });
        }
        return res.status(200).json({ status: 'SUCCESS', message: 'successfully' });
      });
}


const _response = (res) => {
    return (error, result) => {
        if(error) {
            res.send({
                status: 'FAILED',
                response: error
            })
        } else {
            res.send({
                status: 'SUCCES',
                response: result
            })
        }
    }
}

module.exports = {
    store,
    index,
    deleteBook,
    view,
    update
}