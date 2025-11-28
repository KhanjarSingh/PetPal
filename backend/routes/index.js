const { initialController } = require('../controllers/init')
const { initialMiddleware } = require('../middlewares/init')

const router = require('express').Router()


router.get('/',initialMiddleware,initialController)


module.exports = router