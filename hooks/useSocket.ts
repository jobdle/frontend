import { useEffect, useState } from "react"
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!)

export const useSocket = (roomId : string) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [message, setMessage] = useState("");
    const [list, setList] = useState([]);

    useEffect(() => {
      socket.on('connect', () => {
        setIsConnected(true)
      })
    
      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      socket.on('receive_message', () => {

      })
 
      return () => {
          socket.off('connect')
          socket.off('disconnect')
        }
    }, [])
    
    const handleSendMessage  = (message:string ) => {
      socket.emit('sent_message', message )
    }


    return {isConnected, handleSendMessage}
}  