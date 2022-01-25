require('../src/db/mongoose')
const User = require('../src/models/user')


// PROMISE CHAINING
// User.findByIdAndUpdate('61e6bd8c253cfe2cd3ae8e49', {age : 1}).then((user) => {
//     console.log(user)
//     // now return next promise to use promise chaining pattern and afterwards, use .then and .catch as needed
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

//  CONVERT ABOVE CODE TO ASYNC AWAIT
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({ age: age })
    return count
}

updateAgeAndCount('61e6bd8c253cfe2cd3ae8e49', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})