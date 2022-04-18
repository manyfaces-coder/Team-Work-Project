import {useState, useEffect} from "react";
import ACTIONS from "../../socket/actions";
import socket from "../../socket";
import {useNavigate} from "react-router";
import {v4} from "uuid";

export default function Main() {
    const history = useNavigate();
    const [rooms, updateRooms] = useState([]);

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
            updateRooms(rooms);
        });
    });

    return(
        <div>
            <h1>Available Rooms</h1>

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

            <button onClick={() => {
                history(`/room/${v4()}`);
            }}>Create New Room</button>
        </div>
    );
}