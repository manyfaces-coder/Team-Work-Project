import { useParams } from "react-router";
import '../Styles/RoomStyle.css';
import MyButton from '../components/UI/button/MyButton.jsx'
import Micro from '../images/microphone.png'
import MuteMicro from '../images/mute-microphone.png'
import Video from '../images/video-camera.png'
import Participants from '../images/participants.png'
import Chat from '../images/chat.png'





export default function Room() {
    const { id: roomID } = useParams();

    console.log(roomID);

    return (
        // <div>
        //     <h1>ROOM</h1>
        //     <div>
        //         <span className='text'>{roomID}</span>
        //         <MyButton>ASDASDASD</MyButton>
        //     </div>
            <div className='main'>
                <div className='main__left'>
                    <div className='main__videos'>
                        <div id='video_grid'>
                            <video></video>
                        </div>
                    </div>
                    <div className='main__control_panel text'>
                        <div className='main__control_panel__block'>
                            <div className='main__control_panel__button'>
                                <img src={Micro} alt='Microphone'/>
                                <span>Mute</span>
                            </div>
                            <div className='main__control_panel__button'>
                            <img src={Video} alt='Video'/>
                                <span>Stop Video</span>
                            </div>
                        </div>
                        <div className='main__control_panel__block'>
                            <div className='main__control_panel__button'>
                                <img src={Participants} alt='Participants'/>
                                <span>Participants</span>
                            </div>
                            <div className='main__control_panel__button'>
                            <img src={Chat} alt='Chat'/>
                                <span>Chat</span>
                            </div>
                        </div>
                        <div className='main__control_panel__block'>
                            <div className='main__control_panel__button'>
                                {/* <img src={} alt='Microphone'/> */}
                                <span className='leave_meeting'>Leave Meeting</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='main__right'>
                    <div className='main__header'>
                        <h6 className='text'>Chat</h6>
                    </div>

                </div>
            </div>
            

            // </div>

    );
}