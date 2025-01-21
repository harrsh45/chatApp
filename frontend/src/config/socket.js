import socketIOClient from 'socket.io-client'
let socketInstance=null
export const initializeSocket=(ProjectId)=>{
   
        socketInstance=socketIOClient('import.meta.env.VITE_API_URL'),{
            auth:{
                token:localStorage.getItem('token')
            },
            query:{
                projectId:ProjectId
            }
        }
        return socketInstance;
    }

    export const receiveMessage = (eventName, cb) => {
        socketInstance.on(eventName, cb);
    }
    
    export const sendMessage = (eventName, data) => {
        socketInstance.emit(eventName, data);
    }

