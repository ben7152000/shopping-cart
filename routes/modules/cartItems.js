const router = require('express').Router()
const cartController = require('../../controllers/cartController')

router.post('/:id/add', cartController.addCartItem)
router.post('/:id/sub', cartController.subCartItem)
router.delete('/:id', cartController.deleteCartItem)

module.exports = router
