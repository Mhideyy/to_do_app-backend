const taskModel = require("../models/task");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

const createTask = async (req, res) => {
    const { userId, ...others } = req.body;
    const { id } = req.user;
    try {
        const newTask = new taskModel({ ...others, userId:id})
        await newTask.save();
        return res
                    .status(200)
                    .json({ message: "task made successfully!!!"});
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });   
            console.log(error)
    }
};


const getAllTasks = async (req, res) => {
    const { id } = req.user;
    try {
        const tasks = await taskModel.find({ userId: id })
        tasks.forEach(task => {
            task.userId.email;
        })
        res
            .status(200)
            .json(tasks);
    } catch (error) {
        res
            .status(500)
            .json({ message: error.message })
            }
}

const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskModel.findById(id);
        if (!task) {
            return res
                .status(404)
                .json({ message: "Task not found" });
        }
        return res
                    .status(200)
                    .json(task);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });
    }
};

const updateTask = async (req, res) => {
    const { taskId, completed, ...others } = req.body;
    const { id } = req.user;
    try {
            const task = await taskModel.findById(taskId);

        if(task.userId.toString() !== id){
            return res
                        .status(404)
                        .json({ message: "not authorized"})
        };
        await taskModel.findByIdAndUpdate( taskId,{...others}, {new:true});
        return res
                    .status(200)
                    .json({ message: "task updated successfully"});
    } catch (error) {
        res
        .status(500)
        .json({ message: "Something went wrong!!!"});
    }
};

const deleteTask = async (req, res) => {
    const { taskId } = req.query;
    const { id } = req.user;
    try {
        const task = await taskModel.findById(taskId);
        if(task.userId.toString()!== id){
            return res
                        .status(404)
                        .json({ message: "not authorized"})
        };
        await taskModel.findByIdAndDelete(taskId);
        return res
        .status(200)
        .json({ message: "task deleted successfully"});
        
    } catch (error) {
    res 
        .status(500)
        .json({ message: "Something went wrong!!!"});
    }
};

async function scheduleOverDue() {
    const tasks = await taskModel.find({ completed: false });
    tasks.forEach(task => {
        const dueDate = task.dueDate;
        const currentTime = new Date();
        if (dueDate < currentTime) {
            overDueTask(task);
        }
    });

}

async function overDueTask(task) {
    const user = await userModel.findById(task.userId);
    if (!user) {
        console.error("User not found");
        return;
    }
    const transporter =
    nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
    const mailOptions = {
        from: 'noreply@to_do_App.com',
        to: user.email,
        subject: 'Task Reminder',
        html: `
        <h1>Hello!</h1>
        <p>This is a reminder to inform you about your task, <h2> "${task.title}" </h2> which as been due since  ${task.dueDate.toDateString()}.</p>
        <p>Click <a href="https://to-do-app-backend.herokuapp.com/api/auth/login/${token}">here</a> to log in and complete it.</p>
        <p> this link will expire in 1 hour time </p>
        <p>Thank you!</p>
        `
    };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Failed to send email: ", error);
            } else {
                console.log(`email successfully sent to ${user.email}` )
            }
            transporter.close();
        });
        
    }
    
schedule.scheduleJob('0 0 0 * * *', scheduleOverDue);


async function scheduleReminders() {
    const tasks = await taskModel.find({ completed: false });
    tasks.forEach(task => {
        const dueDate = task.dueDate;
        const currentTime = new Date();
        const timeDiff = dueDate.getTime() - currentTime.getTime();
        if (timeDiff <= 86400000) {
            sendReminder(task);
        } else {
            console.log(`Task ${task.title} is ${Math.floor(timeDiff / 86400000)} days away from due date.`);
        }
    });

}
async function sendReminder(task) {
    const user = await userModel.findById(task.userId);
    if (!user) {
        console.error("User not found");
        return;
    }
    const transporter =
    nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
    const mailOptions = {
        from: 'noreply@to_do_App.com',
        to: user.email,
        subject: 'Task Reminder',
        html: `
        <h1>Hello!</h1>
        <p>This is a reminder that your task, <h2> "${task.title}" </h2> will due in 24hrs time.</p>
        <p>Click <a href="https://to-do-app-backend.herokuapp.com/api/auth/login/${token}">here</a> to log in and complete it.</p>
        <p> this link will expire in 1 hour time </p>
        <p>Thank you!</p>
        `
    };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Failed to send email: ", error);
            } else {
                console.log(`email successfully sent to ${user.email}` )
            }
            taskModel.findByIdAndUpdate(task.id, {reminder: true}, {new: true});

            transporter.close();
            taskModel.findByIdAndUpdate(task.id, {reminder: true}, {new: true})
        });

    }
    

schedule.scheduleJob('0 0 0 * * *', scheduleReminders);




const taskStatusUpdate = async (req, res) => {
    try {
        const { taskId } = req.body;
        const { id } = req.user;
        const task = await taskModel.findById(taskId);
        if (!task) {
            return res
                        .status(404)
                        .json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== id) {
            return res
                        .status(400)
                        .json({ message: 'Not authorized' });
        }
           await taskModel.findByIdAndUpdate(taskId, { completed: true }, { new: true });
            res
                .status(201)
                .json({ message: 'Task completed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!!!' });
    }
};


    
module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask, taskStatusUpdate }
