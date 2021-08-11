const router = require('express').Router()
const orderController = require('../../controllers/orderController')

router.get('/orders', orderController.getOrders)
router.post('/order', orderController.postOrder)
router.post('/order/:id/cancel', orderController.cancelOrder)
router.get('/order/:id/payment', orderController.getPayment)

router.post('/spgateway/callback', orderController.spgatewayCallback)

module.exports = router
