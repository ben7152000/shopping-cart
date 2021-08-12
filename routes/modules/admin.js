const router = require('express').Router()
const adminController = require('../../controllers/adminController')

const auth = require('../../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../shopping-cart/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
})

const upload = multer({ storage }).single('image')

router.get('/sign-in', adminController.signInPage)
router.post('/sign-in', adminController.signIn)
router.get('/sign-out', adminController.signOut)

router.get('/products', auth.authenticatedAdmin, adminController.getProducts)
router.post('/products', auth.authenticatedAdmin, upload, adminController.postProducts)
router.get('/products/:id', auth.authenticatedAdmin, adminController.getProduct)
router.put('/products/:id', auth.authenticatedAdmin, upload, adminController.editProduct)
router.delete('/products/:id', auth.authenticatedAdmin, adminController.deleteProduct)

router.get('/orders', auth.authenticatedAdmin, adminController.getOrders)
router.get('/orders/:id', auth.authenticatedAdmin, adminController.getOrder)
router.post('/orders/:id/ship', auth.authenticatedAdmin, adminController.shipOrder)
router.post('/orders/:id/cancel', auth.authenticatedAdmin, adminController.cancelOrder)
router.post('/orders/:id/recover', auth.authenticatedAdmin, adminController.recoverOrder)

router.get('/authority', auth.authenticatedAdmin, adminController.getUsers)
router.post('/authority/:id', auth.authenticatedAdmin, adminController.changeAuth)

module.exports = router
