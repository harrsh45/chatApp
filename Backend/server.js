import dotenv from 'dotenv/config'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import http from 'http'
import app from './app.js'

import projectModel from './model/project.model.js'
import { mongo } from 'mongoose'


const port=process.env.PORT || 3000


const server=http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});




io.use(async (socket ,  next)=>{
    try{
    const token=socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1]
    const projectId=socket.handshake.query.projectId
    if(!mongo.isValidObjectId(projectId))
    {
        return next(new Error('authorization error'))
    }
    if(!token)
    {
        return next(new Error('Authorization error'))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded)
    {
        return next(new Error('Authorization error'))
    }
    socket.project= await projectModel.findOne(projectId)
        
        socket.user=decoded
        next()
    }
    catch(err)
    {
        next(new Error('Authorization error'))
    }
})

io.on('connection', socket => {
    socket.join(socket.project._id)
    console.log("user is connected")
    socket.on('project-message',(data)=>{
        socket.broadcast.to(socket.project._id).emit('project-message',data)
    })
  socket.on('event', data => {});
  socket.on('disconnect', () => { /* … */ });
});



server.listen(port,()=>{
    console.log(`server is running on ${port}`)
})