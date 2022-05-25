// Подключение на клиенте 
import {io} from 'socket.io-client'

//Настройки для веб соккета
const options = {
    "force new connection": true, 
    reconnectionAttempts: "Infinity", //переподключение сервера
    timeout: 10000,
    transports: ["websocket"] //настройка, чтобы сокеты могли работать раздоменно
}

const socket = io('http://localhost:3001', options)

export default socket