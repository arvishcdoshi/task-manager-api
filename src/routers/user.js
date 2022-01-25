const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    }catch (e) {
        res.status(400).send(e)
    }

    // OLD CODE WITH MULTIPLE PROMISES

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})


router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }catch(e) {
        res.status(400).send()
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try{
        
        // If on line 46, it returns true which means they aren't equal, we will keep it in the tokens array..
        // if they are equal, it will end up returning false, filtering it out and removing it.
        // we will look at current token we'are iterating over..token is an object with token property..so we'll use token.token
        // IN SHORT, WE WANT TO KEEP EVERY TOKEN EXCEPT THE ONE SENT IN THE REQUEST.
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send()
    }
})


router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send()
    }
})




// 2nd argument is middleware..once that is run, the route handler (i.e async function) will run
router.get('/users/me', auth ,async (req, res) => {
    res.send(req.user)

})



router.patch('/users/me', auth ,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        // Certain mongoose queries bypasses more advanced features like middleware
        // findByIdAndUpdate method bypasses mongoose..performs direct operation on database and that's why we had to set special option(runValidators) for running the validators.
        // below line bypasses middleware as it does find and update directly and our validations might be ignored
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an Image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar') , async (req,res) => {
    // Convert req image to .png and resize it
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            // below line stops execution of the try block and immediately goes to catch to render 404
            throw new Error()
        }

        // Customize response headers
        res.set('Content-Type', 'image/png')

        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router