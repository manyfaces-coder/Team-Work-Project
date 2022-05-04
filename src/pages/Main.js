import { useState, useEffect } from "react";
import ACTIONS from "../socket/actions";
import socket from "../socket";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import '../Styles/MainStyle.css';
import logo from '../images/conference.png'
import MyButton from '../components/UI/button/MyButton.jsx'

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
            <h1 class="text">WELCOM TO VIDEO CHAT</h1>
            <div class="main_container">
            <img class='logo_img' alt='Logo' src={logo}/>
                <div class="modal_container">
                    <h2 class="text">Available Rooms</h2>
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

                    <MyButton class='create_room' onClick={() => {
                        history(`/room/${v4()}`);
                    }}>
                        <span class="text">Create New Room</span>
                    </MyButton>
                    
                </div>
            </div>
        </div>
    );
}