import {myVideoStream} from "./hooks/useWebRTC";

export const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        //setUnmuteButton();
    } else {
        //setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}