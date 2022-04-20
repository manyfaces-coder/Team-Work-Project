import {useParams} from "react-router";
import './RoomStyle.css';

export default function Room() {
    const {id: roomID} = useParams();

    console.log(roomID);

    return(
        <header>
            <div>
            <h1>ROOM</h1>
            <div>
            <span class='text'>{roomID}</span>

            </div>
            Room
        </div>
        </header>
        
    );
}