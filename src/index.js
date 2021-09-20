//! mongod chalake yeh sab karna , varna nahi chalega
//TODO - https://httpstatuses.com

const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
// const port = process.env.PORT || 3000
const port = process.env.PORT


// const multer = require('multer')
// const upload = multer({
//     // dest is short form of destination
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     // cb is callback
//     fileFilter(req, file, cb) {
//         //TODO => Use regex101.com to use regular expressions 
//         // if (!file.originalname.endsWith('.pdf')) {
//         //     return cb(new Error('Please upload a PDF'))
//         // }
//         //! "\." ke baad () mein jo likhenge voh file type hoga and $ means $ se pehle jitna tha , utne tak hi hai file type , agar doc or docx ke baad bhi kuch likha hai then wrong file 
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a Word document'))
//         }

//         cb(undefined,true)


//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })

// // const errorMiddleware = (req,res,next)=>{
// //     throw new Error('From my Middleware')
// // }

// // app.post('/upload',upload.single('upload'), (req,res)=>{
// // app.post('/upload',errorMiddleware, (req,res)=>{
// app.post('/upload',upload.single('upload'), (req,res)=>{
//     res.send()
// }, (error , req , res , next)=>{
//     res.status(400).send({ error: error.message })
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port , () => {
    console.log('Server is up on port' + port)
})

// _____________________________________________________

