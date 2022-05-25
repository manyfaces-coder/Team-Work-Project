import { useState, useEffect, useRef } from "react";
import ACTIONS from "../socket/actions";
import socket from "../socket";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import '../Styles/MainStyle.css';
import logo from '../images/conference.png'
import MyButton from '../components/UI/button/MyButton.jsx'


//Логика подключения/отключения к коммнатам на клиенте
export default function Main() {
    const history = useNavigate();
    const [rooms, updateRooms] = useState([]);
    const rootNode = useRef();

    //При входе на страницу получаем все комнаты
    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
            if (rootNode.current) {
                //Обновляем спсок каждый раз когда они приходят
                updateRooms(rooms);
            }
        });
    });

    return (
        <div ref={rootNode}>
            <h1 className="text">WELCOME TO VIDEO CHAT</h1>
            <div className="main_container">
            <img className='logo_img' alt='Logo' src={logo}/>
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

                    <MyButton className='create_room' onClick={() => {
                        history(`/room/${v4()}`);
                    }}>
                        <span className="text">Create New Room</span>
                    </MyButton>
                    
                </div>
            </div>
        </div>
    );
}