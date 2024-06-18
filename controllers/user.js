const connection = require('../config/mysql')
const path = require('path')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { authenticateToken, secretKey } = require('./auth');

const signup = (req, res) => {
    const { nama_depan, nama_belakang, role, email, password } = req.body;
    connection.query({
        sql: 'INSERT INTO users (nama_depan, nama_belakang, role, email, password) VALUES (?, ?, ?, ?, ?)',
        values: [nama_depan, nama_belakang, role, email, password]
    }, (error, results) => {
        if (error) {
            res.send({
                status: 'FAILED',
                response: error
            });
        } else {
            res.send({
                status: 'SUCCESS',
                response: results
            });
        }
    });
};

const index = (req, res) => {
    connection.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.json(results); // Pastikan mengirim hasil sebagai JSON
        }
    })
}


const login = (req, res) => {
    const { email, password } = req.body;

    connection.query({
        sql: 'SELECT * FROM users WHERE email = ? AND password = ?',
        values: [email, password]
    }, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                status: "FAILED",
                message: "Terjadi kesalahan dalam pengambilan data",
                error: error.message
            });
        }

        if (results.length > 0) {
            const { id, nama_depan, nama_belakang, role } = results[0];
            const user = { id, email, role, nama_depan, nama_belakang };
            const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

            res.status(200).json({
                status: "SUCCESS",
                message: "Login berhasil",
                token: token,
                user: user
            });
        } else {
            res.status(401).json({
                status: "FAILED",
                message: "Email atau password salah"
            });
        }
    });
};

const getUserData = (req, res) => {
    res.status(200).json(req.user);
};
  


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
    signup,
    login,
    getUserData,
    authenticateToken,
    index
}