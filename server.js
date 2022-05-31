const path = require('path');
const express = require('express');
const ACTIONS = require('./src/socket/actions');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {version, validate} = require('uuid');//для проверки версии и валидности комнаты

const PORT = process.env.PORT || 3001;

//Возвращает список существующих комнат
function getClientRooms() {
    const {rooms} = io.sockets.adapter;
    //Проверяем комнаты, чтобы не было дефолтных комнат, которые создаются, когда просто вошел новый сокет
    //Будут отображаться только намеренно созданные комнаты
    return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
}

//Показывает всем подключившимся клиентам(сокетам) существующие комнаты
function shareRoomsInfo() {
    io.emit(ACTIONS.SHARE_ROOMS, {
        rooms: getClientRooms()
    })
}

//Описание присоединения к комнате
io.on('connection', socket => {
    shareRoomsInfo()

    socket.on(ACTIONS.JOIN, config => {
        const {room: roomID} = config;
        const {rooms: joinedRooms} = socket; 
        //проверяем все комнаты, которые есть, чтобы не подключиться к одной и той же комнате

        if(Array.from(joinedRooms).includes(roomID)) {
            return console.warn(`Already joined to ${roomID}`);
        }
        
        //Если не подключены, получаем всех клиентов в этой комнате
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

        //Каждый, кто есть в комнате создает peer соединение с подключившимся
        clients.forEach(clientID => {
            io.to(clientID).emit(ACTIONS.ADD_PEER, {
                peerID: socket.id,
                createOffer: false
            });
            //Создает оффер только та сторона, которая подключается в комнату
            socket.emit(ACTIONS.ADD_PEER, {
                peerID: clientID,
                createOffer: true,
            });
        });

        //Теперь подключаемся к комнате
        socket.join(roomID);

        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomID).emit('createMessage', message)
        });

        //Делимся информацией о комнате
        shareRoomsInfo();

    });
    
    //Выход из комнаты
    function leaveRoom() {
        const {rooms} = socket;

        Array.from(rooms)
            //Выход только из созданных комнат
            .filter(roomID => validate(roomID) && version(roomID) === 4)
            .forEach(roomID => {
                const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

                //Сообщаем всем клиентам, прервать peer соединение с отключившимся
                clients.forEach(clientID => {
                    io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                        peerID: socket.id,
                    });

                    //Отключившийся прерывает соединение с другими
                    socket.emit(ACTIONS.REMOVE_PEER, {
                        peerID: clientID,
                    });
                });
                //Выходим из комнаты
                socket.leave(roomID);
            });
        //Делимся инофрмацией о комнате
        shareRoomsInfo();


    }


    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);

    //новая сессия
    socket.on(ACTIONS.RELAY_SDP, ({peerID, sessionDescription}) => {
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerID: socket.id,
            sessionDescription,
        });
    });
    //новый кандидат
    socket.on(ACTIONS.RELAY_ICE, ({peerID, iceCandidate }) => {
        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
            peerID: socket.id,
            iceCandidate,
        });
    });

});

server.listen(PORT, () => {
    console.log('Server started!')
})



