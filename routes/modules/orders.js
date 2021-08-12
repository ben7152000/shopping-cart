const router = require('express').Router()
const orderController = require('../../controllers/orderController')

router.get('/', orderController.getOrders)
router.get('/data', orderController.fillOrderData)
router.post('/data', orderController.postOrder)
router.get('/:id', orderController.getOrder)
router.post('/:id/cancel', orderController.cancelOrder)

router.post('/spgateway/callback', orderController.spgatewayCallback)

module.exports = router
