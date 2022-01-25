require('../src/db/mongoose')
const Task = require('../src/models/task')

// PROMISE CHAINING
// Task.findByIdAndDelete('61e6ad912560521a49cd89d7').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


// ASYNC AWAIT APPROACH
const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('61e6c03c55a683303c20ac75').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})