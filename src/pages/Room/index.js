import {useParams} from "react-router";
import './RoomStyle.css';
import useWebRTC from '../../hooks/useWebRTC'

export default function Room() {
    const {id: roomID} = useParams();

    useWebRTC(roomID);

    console.log(roomID);

    return(
        <header>
            <div>
                <h1>ROOM</h1>
                {/*<div>*/}
                {/*    <span className='text'>{roomID}</span>*/}
                {/*</div>*/}
                Room
            </div>
        </header>
        
    );
}