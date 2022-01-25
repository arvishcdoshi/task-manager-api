const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT

// WITH MIDDLEWARE: incoming request -->  run route handler
// WITH MIDDLEWARE: incoming request --> DO SOMETHING(MIDDLEWARE CODE) --> run route handler

// MIDDLEWARE FUNCTION BELOW
// app.use((req, res, next) => {
    
//     res.status(503).send('Site is currently down..Check back soon!')
// })

// Configure Express to automatically parse the incoming JSON so that we have an object to access
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const Task = require('./models/task')
// const User = require('./models/user')
// const { compare } = require('bcryptjs')

//const main = async () => {
    // const task = await Task.findById('61ea92d40448bc15fa886b09')
    // populate allows us to populate data from a relationship (like foreign key in RDBMS)..in this case we have for owner
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

  //  const user = await User.findById('61ea8f42f12173095f8d4573')
    //await user.populate('tasks').execPopulate()
  //  console.log(user.tasks)
//}

//main()

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//       fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(doc|docx)$/)) {
//         return cb(new Error('Please upload a Word document'))
//       }
//       cb(undefined, true)
//     }
// })


// app.post('/upload', upload.single('upload'), (req,res) => {
//     res.send()
// }, (error, req, res, next) => {
//   res.status(400).send({error: error.message})
// })