const router = require('express').Router()
const orderController = require('../../controllers/orderController')

router.get('/', orderController.getOrders)
router.get('/:id', orderController.getOrder)
router.post('/', orderController.postOrder)
router.post('/:id/cancel', orderController.cancelOrder)
router.get('/:id/payment', orderController.getPayment)

router.post('/spgateway/callback', orderController.spgatewayCallback)

module.exports = router
