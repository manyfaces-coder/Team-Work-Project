import { useParams } from "react-router";
import '../Styles/RoomStyle.css';
import MyButton from '../components/UI/button/MyButton.jsx'
import Micro from '../images/microphone.png'
import MuteMicro from '../images/mute-microphone.png'
import Video from '../images/video-camera.png'
import Participants from '../images/participants.png'
import Chat from '../images/chat.png'
import useWebRTC, {LOCAL_VIDEO} from '../hooks/useWebRTC';
import {muteUnmute, playStop} from "../buttons";

function layout(clientsNumber = 1) {
    const pairs = Array.from({length: clientsNumber})
      .reduce((acc, next, index, arr) => {
        if (index % 2 === 0) {
          acc.push(arr.slice(index, index + 2));
        }
  
        return acc;
      }, []);
  
    const rowsNumber = pairs.length;
    const height = `${100 / rowsNumber}%`;
  
    return pairs.map((row, index, arr) => {

      if (index === arr.length - 1 && row.length === 1) {
        return [{
          width: '100%',
          height,
        }];
      }
  
      return row.map(() => ({
        width: '50%',
        height,
      }));
    }).flat();
  }


export default function Room() {
    const { id: roomID } = useParams();
    const {clients, provideMediaRef} = useWebRTC(roomID);
    const videoLayout = layout(clients.length);

    console.log(clients);
    console.log(roomID);

    return (
            <div className='main'>
                <div className='main__left'>
                    <div className='main__videos'>
                        {clients.map((clientID, index) => {
                            return (
                                <div key={clientID} style={videoLayout[index]} id='video_grid'>
                                    <video
                                        width='100%'
                                        height='100%'
                                        ref={instance => {
                                            provideMediaRef(clientID, instance);
                                        }}
                                        autoPlay
                                        playsInline
                                        muted={clientID === LOCAL_VIDEO}
                                    />
                                </div>
                            )
                        })}
                        
                    </div>
                    <div className='main__control_panel text'>
                        <div className='main__control_panel__block'>
                            <div onClick={muteUnmute} className='main__control_panel__button main__mute_button'>
                                <i class="fas fa-microphone"></i>
                                    <span>Mute</span>
                            </div>
                            <div onClick={playStop} className='main__control_panel__button main__video_button'>
                                <i class="fas fa-video"></i>
                                    <span>Stop Video</span>
                            </div>
                        </div>
                        <div className='main__control_panel__block'>
                            <div className='main__control_panel__button'>
                                <i class="fas fa-user-friends"></i>
                                <span>Participants</span>
                            </div>
                            <div className='main__control_panel__button'>
                            <i class="fas fa-comment-alt"></i>
                                <span>Chat</span>
                            </div>
                        </div>
                        <div className='main__control_panel__block'>
                            <div className='main__control_panel__button'>
                                <span className='leave_meeting'>Leave Meeting</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='main__right'>
                    <div className='main__header'>
                        <h6 className='text'>Chat</h6>
                    </div>
                    < div className='main__chat_window'>
                        <ul className='messages'>

                        </ul>
                    </div>
                    <div className='main__message_container'>
                        <input id='chat_message' type='text' placeholder='Type your message here...'>
                            
                        </input>
                    </div>

                </div>
            </div>
            

            // </div>

    );
}