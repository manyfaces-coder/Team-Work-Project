import { useState, useEffect } from "react";
import ACTIONS from "../../socket/actions";
import socket from "../../socket";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import './MainStyle.css';

export default function Main() {
    const history = useNavigate();
    const [rooms, updateRooms] = useState([]);

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
            updateRooms(rooms);
        });
    });

    return (
        <div>
            <h1>Welcome to the videochat</h1>
            <div className="fixed-overlay__modal">
                <div className="modal_container">
                    <h2 className="text">Available Rooms</h2>

                    <ul>
                        {rooms.map(roomID => (
                            <li key={roomID}>
                                {roomID}
                                <button onClick={() => {
                                    history(`/room/${roomID}`);
                                }}>JOIN ROOM</button>
                            </li>
                        ))}
                    </ul>

                    <button className="create_room" onClick={() => {
                        history(`/room/${v4()}`);
                    }}>
                        <div className="plus"/>
                    Create New Room</button>
                </div>
            </div>
        </div>
    );
}