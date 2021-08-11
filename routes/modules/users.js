const router = require('express').Router()
const userController = require('../../controllers/userController')

router.get('/sign-in', userController.signInPage)
router.post('/sign-in', userController.signIn)
router.get('/sign-out', userController.signOut)
router.get('/sign-up', userController.signUpPage)
router.post('/sign-up', userController.signUp)
router.post('/sign-up/captcha', userController.sendCaptcha)

module.exports = router
