import dotenv from 'dotenv/config'
import app from './app.js'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import http from 'http'
import projectModel from './model/project.model.js'
import mongoose from 'mongoose';
import {generateResult} from './services/ai.service.js'


const port = process.env.PORT || 3000


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});




io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1]
        if (!token) {
            return next(new Error('Authorization error'))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return next(new Error('Authorization error'))
        }
        socket.user = decoded
        const projectId = socket.handshake.query.projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }
        socket.project = await projectModel.findById(projectId);

        next()
    }
    catch (err) {
        console.log(err)
        next(new Error('Authorization error'))
    }
})

io.on('connection', socket => {
     
    socket.join(socket.project._id.toString())
    console.log(socket.project._id.toString())
    console.log("user is connected")
    socket.on('project-message',async (data) => {
        const message=data.message
        const aiPresentInMessage=message.includes("@ai")
        if(aiPresentInMessage)
        {
            const prompt=message.replace("@ai","")
            const result=await generateResult(prompt)
            io.to(socket.project._id.toString()).emit('project-message',
                {sender:{
                    _id:"ai",
                    email:"AI"
                    },

                    message:result
                }
            )
            return 
        }
        console.log("server",data)
        socket.broadcast.to(socket.project._id.toString()).emit('project-message', data)
    })
    
    socket.on('disconnect', () => { 
        
        socket.leave(socket.project._id.toString())
        console.log('user disconnected'); });
});



server.listen(port, () => {
    console.log(`server is running on ${port}`)
})