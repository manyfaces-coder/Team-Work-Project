import {myVideoStream} from "./hooks/useWebRTC";

export const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
            <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
            <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  export const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }


  export const setVisibleChat = () => {
    const participantsEl = document.getElementsByClassName('main__right participants')[0];
    const chatEl = document.getElementsByClassName('main__right chat')[0];
    if(participantsEl.classList.contains('is-active'))
        participantsEl.classList.remove('is-active')

    chatEl.classList.toggle('is-active')

  }

  export const setVisibleParticipants = () => {
      const participantsEl = document.getElementsByClassName('main__right participants')[0];
      const chatEl = document.getElementsByClassName('main__right chat')[0];
      if(chatEl.classList.contains('is-active'))
          chatEl.classList.remove('is-active')

      participantsEl.classList.toggle('is-active');
  }

export const scrollToBottom = () => {
    let d = document.getElementsByClassName('main__chat_window');
    d.scrollTop = d.scrollHeight;
}

