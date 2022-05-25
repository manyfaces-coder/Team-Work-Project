const ACTIONS = {
    JOIN: 'join',
    LEAVE: 'leave',
    SHARE_ROOMS: 'share-rooms',
    ADD_PEER: 'add-peer',
    REMOVE_PEER: 'remove-peer',
    RELAY_SDP: 'relay-sdp', //Передает стримы с медиаданными
    RELAY_ICE: 'relay-ice', //Передает ice-candidate - физические подключения
    ICE_CANDIDATE: 'ice-candidate',
    SESSION_DESCRIPTION: 'session-description' //Используем когда придет новая сессия
};

module.exports = ACTIONS;