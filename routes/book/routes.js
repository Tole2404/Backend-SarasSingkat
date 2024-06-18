const router = require('express').Router();
const bookController = require('../../controllers/book')
const multer = require('multer');
const { route } = require('../authRoutes');
const upload = multer({dest: 'uploads'})

router.post('/tambah-buku', upload.single('image'), bookController.store);
router.get('/index', bookController.index);
router.delete('/delete/:id', bookController.deleteBook);
router.get('/view/:id', bookController.view);
router.put('/update/:id', upload.single('image'), bookController.update);
module.exports = router;