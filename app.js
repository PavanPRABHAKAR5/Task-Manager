const fs = require('fs')
const express = require('express');
const task = require('./task.json')
const Validation = require('./Helper/validation.js')

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET /tasks: Retrieve all tasks.
app.get('/tasks', (req, res) => {
    try {
        res.status(200).json(task.tasks)
    } catch (err) {
        res.status(400).json({
            Status: "Failed",
            message: err.message
        })
    }
})

// GET /tasks/:id: Retrieve a single task by its ID.
app.get('/tasks/:id', (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let taskList = task.tasks;

        let result = taskList.find((task) => task.id === id);


        if (!result) {
            return res.status(404).json({
                status: "Failed",
                message: "id is invalid"
            })
        }

        res.status(200).json(result)


    } catch (err) {
        res.status(400).json({
            Status: "Failed",
            message: err.message
        })
    }
})

// POST /tasks: Create a new task
app.post('/tasks', (req, res) => {
    try {
        let postData = req.body;
        let taskList = task;
        let id = taskList.tasks.length + 1
        postData.id = id
        taskList.tasks.push(postData)

        if (Validation(postData).status === true) {
            fs.writeFile('./task.json', JSON.stringify(taskList), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                if (err) {
                    return res.status(500).json({
                        Status: "Failed",
                        message: err.message
                    })
                } else {
                    res.status(200).json(postData)
                }
            })
        } else {
            res.status(400).json({
                status: "Failed",
                message: Validation(postData).message,

            })
        }


    } catch (err) {
        res.status(400).json({
            Status: "Failed",
            message: err.message
        })

    }
})

// PUT /tasks/:id: Update an existing task by its ID.
app.put('/tasks/:id', (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let putData = req.body

        let putResult = task.tasks.findIndex((task) => task.id === id)
        if (putResult == -1) {
            return res.status(404).json({
                status: "Failed",
                message: "id is invalid"
            })
        }

        if (Validation(putData).status == true) {

            task.tasks[putResult].title = req.body.title;
            task.tasks[putResult].description = req.body.description;
            task.tasks[putResult].completed = req.body.completed

            fs.writeFile('./task.json', JSON.stringify(task), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                if (err) {
                    return res.status(500).json({
                        Status: "Failed",
                        message: err.message
                    })
                } else {
                    res.status(200).json({
                        status: "successful",
                        Data: putData.tasks
                    })
                }
            })
        } else {
            return res.status(400).json({
                status: "Failed",
                message: Validation(putData).message
            })
        }
    } catch (err) {
        return res.status(400).json({
            Status: "Failed",
            message: err.message
        })
    }


})

// DELETE /tasks/:id: Delete a task by its ID.
app.delete('/tasks/:id', (req, res) => {
    try {
        let id = parseInt(req.params.id);

        let deleteId = task.tasks.findIndex((course) => course.id == id);

        if (deleteId === -1) {
            return res.status(404).json({
                status: "Failed",
                message: "id is invalid"
            })
        }

        task.tasks.splice(deleteId, 1)

        fs.writeFile('./task.json', JSON.stringify(task), { encoding: 'utf8', flag: 'w' }, (err, data) => {
            if (err) {
                res.status(500).json({
                    Status: "Failed",
                    message: err.message
                })
            } else {
                res.status(200).json({
                    status: "successful",
                    message: "Deleted Successfully"
                })
            }
        })
    } catch (err) {
        res.status(400).json({
            Status: "Failed",
            message: err.message
        })
    }

})


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;