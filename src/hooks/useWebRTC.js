import {useEffect, useRef, useCallback} from "react";
import freeice from 'freeice';
import useStateWithCallback from "./useStateWithCallback";
import ACTIONS from "../socket/actions";
import socket from "../socket";

export const LOCAL_VIDEO = 'LOCAL_VIDEO';
export let myVideoStream;

export default function UseWebRTC(roomID) {
    const [clients, updateClients] = useStateWithCallback([]);

    const addNewClient = useCallback((newClient, cb) => {//добавляем только нового клиента, не даем одному и тому же подключиться дважды
        updateClients(list => {
            if (!list.includes(newClient)) {
              return [...list, newClient]
            }
      
            return list;
          }, cb);
    }, [clients, updateClients]);

    const peerConnections = useRef({}); //хранит все peer соединение, которые связывают пользователя с другими пользователями
    const localMediaStream = useRef(null); //ссылка на видео и аудио элементы пользователя, который будет транслироваться с веб-камеры
    const peerMediaElements = useRef({
        [LOCAL_VIDEO]: null,
    }); //ссылка на все видео и аудиоэлементы других участников

    useEffect(() => {//добавление нового пира
        async function handlerNewPeer({peerID, createOffer}) {
            if (peerID in peerConnections.current) {
                return console.warn('Already connected to peer ${peerID}');
            }
            //если не подключены к пиру - создаем новый peerConnections
            peerConnections.current[peerID] = new RTCPeerConnection({
                iceServers: freeice(),//предоставляет набор адресов бесплатеых stun серверов
            });
            //когда создаем офер или ответ срабатывает автоматически
            peerConnections.current[peerID].onicecandidate = event => {
                if (event.candidate) { //пересылаем другим клиентам 
                    socket.emit(ACTIONS.RELAY_ICE, { //транслируем ice candidate 
                        peerID,
                        iceCandidate: event.candidate,
                    })//отправляет на сервер, что желает подключиться новый кандидат 
                }
            }

            let tracksNumber = 0;
            //когда получаем новый track -> извлекаем стримы, которые получаем 
            peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}) => {
                tracksNumber++ 
                if (tracksNumber === 2 ) {//если получили видео и аудио = 2, тогда соединяемся с клиентом
                    
                    addNewClient(peerID, () => {
                        //начинаем транслировать в видеоэлементе, который создался для этого peerID, который нарисовался на странице
                        //этот remoteStream
                        if (peerMediaElements.current[peerID]) {
                            peerMediaElements.current[peerID].srcObject = remoteStream;
                          } else {
                            // FIX LONG RENDER IN CASE OF MANY CLIENTS
                            let settled = false;
                            const interval = setInterval(() => {
                              if (peerMediaElements.current[peerID]) {
                                peerMediaElements.current[peerID].srcObject = remoteStream;
                                settled = true;
                              }
              
                              if (settled) {
                                clearInterval(interval);
                              }
                            }, 1000);
                          }
                        });
                      }
                    }
            //из локального стрима получаем треки которые сейчас транслируются и добавляем их к нашему peerConnections
            localMediaStream.current.getTracks().forEach(track => {
                peerConnections.current[peerID].addTrack(track, localMediaStream.current);
            });

            if (createOffer) {//создаем оффер, если мы сторона, которая подключилась
                const offer = await peerConnections.current[peerID].createOffer();
                 //указываем, что этот peerConnections будет высылать оффер
                await peerConnections.current[peerID].setLocalDescription(offer);

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: offer,
                })
            }
        }

        socket.on(ACTIONS.ADD_PEER, handlerNewPeer);

    return () => {
      socket.off(ACTIONS.ADD_PEER);
    }
    }, []);

    useEffect(() => {//реакция на появление новой сессии на клиенте
        async function setRemoteMedia({peerID, sessionDescription : remoteDescription}) {
            // await peerConnections.current[peerID].setRemoteDescription(
            await peerConnections.current[peerID]?.setRemoteDescription(
                new RTCSessionDescription(remoteDescription)//обернут в конструктор, т.к. не во всех браузерах работает напрямую
            );

            if (remoteDescription.type === 'offer') {//если оффер то создаем ответ
                const answer = await peerConnections.current[peerID].createAnswer();

                await peerConnections.current[peerID].setLocalDescription(answer);

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: answer,
                });
            }
        }

        socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)
        return () => {
            socket.off(ACTIONS.SESSION_DESCRIPTION);
          }
    }, []);

    useEffect(() => {//реакция на появление нового ice кандидата на клиенте
        socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
            // peerConnections.current[peerID].addIceCandidate(
            peerConnections.current[peerID]?.addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            );
        });

        return () => {
        socket.off(ACTIONS.ICE_CANDIDATE);
      }
    }, []);

    useEffect(() => {//реакция на выход из комнаты
        const handleRemovePeer = ({peerID}) => {
            if (peerConnections.current[peerID]) {
                peerConnections.current[peerID].close();
            }

            delete peerConnections.current[peerID];
            delete peerMediaElements.current[peerID];

            updateClients(list => list.filter(c => c !== peerID));
        };

        socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.off(ACTIONS.REMOVE_PEER);
          }
    }, []);

    useEffect(() => {
        async function startCapture() {//начинаем захват аудио и видео при входе на страницу
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 1280, 
                    height: 720,
                }
            }).then(stream => myVideoStream = stream);;
            //если захват контента произошел успешно 
            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

                if (localVideoElement) {
                    localVideoElement.volume = 0;
                    localVideoElement.srcObject = localMediaStream.current;
                }
            });
        }

        startCapture()
            .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))//присоединяемся к комнате 
            .catch(e => console.error('Error getting userMedia:', e));//присоединяем к комнате только если пользователь разрешает 
            //использовать свои видео и аудио

        return () => {//когда меняется ID комнаты останавливаем захват медиаконтента пользователя
            localMediaStream.current.getTracks().forEach(track => track.stop());
            socket.emit(ACTIONS.LEAVE);
        };
    },[roomID]);

    const provideMediaRef = useCallback( (id, node) => {
        peerMediaElements.current[id] = node;
    }, []);
    return {
        clients,
        provideMediaRef
    };
}