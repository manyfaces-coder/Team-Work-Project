import {useEffect, useRef, useCallback} from "react";
import useStateWithCallback from "./useStateWithCallback";
import ACTIONS from "../socket/actions";
import socket from "../socket";

const LOCAL_VIDEO = 'LOCAL_VIDEO';

export default function UseWebRTC(roomID) {
    const [clients, updateClients] = useStateWithCallback([]);

    const addNewClient = useCallback((newClient, cb) => {
        if(!clients.includes(newClient)) {
            updateClients(list => [...list, newClient], cb)
        }
    }, [clients, updateClients]);

    const peerConnections = useRef({});
    const localMediaStream = useRef(null);
    const peerMediaElements = useRef({});

    useEffect(() => {
        async function startCapture() {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 1280,
                    height: 720,
                }
            });

            addNewClient(LOCAL_VIDEO, () => {

            });
        }

        startCapture()
            .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))
            .catch(e => console.error('Error getting userMedia:', e));
    },[roomID]);
}