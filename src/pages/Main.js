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
        <div className="text"ref={rootNode}>
            <h1 >WELCOME TO VIDEO CHAT</h1>
            <div className="main_container wrapper">
            <img className='logo_img' alt='Logo' src={logo}/>
                <div className="modal_container">
                    <h2 >Available Rooms</h2>
                    <ul className='rectangle'>
                        {rooms.map(roomID => (
                            <li key={roomID}>
                                <a>{roomID}</a>
                                
                                <MyButton onClick={() => {
                                    history(`/room/${roomID}`);
                                }}>JOIN ROOM</MyButton>
                            </li>
                        ))}
                    </ul>

                    <MyButton id='create_room' onClick={() => {
                        history(`/room/${v4()}`);
                    }}>
                        <span>Create New Room</span>
                    </MyButton>
                    
                </div>
            </div>
        </div>
    );
}