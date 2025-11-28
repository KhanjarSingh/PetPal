

const initialMiddleware = (req,res,next) =>{
    console.log('Initial Middleware')
    next()
}


module.exports = {initialMiddleware}