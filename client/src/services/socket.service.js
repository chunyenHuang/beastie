class Socket {
    static get $inject() {
        return [];
    }
    constructor() {
        let host = window.location.origin;
        console.log('WEBSOCKET connecting to', host);
        this.socket = io.connect(host);
    }
    init() {
        this.socket.on('connect', () => {
            let sessionId = this.socket.io.engine.id;
            console.log('WEBSOCKET connected with session id', sessionId);
        });
    }
    on(key, callback) {
        this.socket.on(key, (data) => {
            callback(data);
        });
    }

}

export default Socket;
