const client = require('socket.io-client');
const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"]
}

const socket = client.io('http://localhost:3006', options)


export default socket