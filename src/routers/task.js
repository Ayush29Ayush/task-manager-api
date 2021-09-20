const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//! GET /tasks?completed=true
// router.get('/tasks', auth, async (req, res) => {
//     // req.query.completed
//     const match = {}

//     if (req.query.completed) {
//         match.completed = req.query.completed ==='true'
//     }

//     try {
//         // const task =  await Task.find({owner:req.user._id})
//         await req.user.populate({
//             path: 'tasks',
//             match,
//             options: {
//                 limit: parseInt(req.query.limit),
//                 skip: parseInt(req.query.skip)
//             }
//         }).execPopulate()
//         // res.send(req.user.task)
//         res.send(req.user.tasks)
//     } catch (e) {
//         console.log(e)
//         res.status(500).send()
//     }
// })

//! Goal: Setup support for skip
//1. Setup "skip" option
//   - Parse query value to integer
//2. Fire off some requests to test it's working

//! GET /tasks?completed=true
//TODO - Pagination defination => no. of data that can be shown on the page at a time
// pagination => limit , skip
// GET /tasks?limit=10&skip=0

// GET /tasks?sortBy=createdAt:asc or :desc
router.get('/tasks', auth, async (req, res) => {
    let tasks
    try {
        const limitValue = parseInt(req.query.limit)
        const skipValue = parseInt(req.query.skip)
        
        const sortByParam = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sortByParam[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        // tasks = await Task.find({owner: req.user._id}).limit(limitValue).skip(skipValue)


        if (req.query.completed) { 
            //query given as input url exists: use it
            // find and skip bhi implement kar diya
            tasks = await Task.find({owner: req.user._id, completed: req.query.completed}).limit(limitValue).skip(skipValue).sort(sortByParam)
        } else { 
            //query in input url doesnt exist: dont try and and use it
            // find and skip bhi implement kar diya
            tasks = await Task.find({owner: req.user._id}).limit(limitValue).skip(skipValue).sort(sortByParam)
        }
    
        if (!tasks) {
        res.status(404).send()
        }
        
        res.send(tasks)
}   catch (e) {
        console.log(e)
        res.status(500).send()
}
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//! Goal: Refactor DELETE /tasks/:id
//1. Add auth
//2. Find the task by _id/owner (findOneAndDelete)
//3. Test your work! 

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router