"use strict";
const operators_1 = require("rxjs/operators");
const WebSocketSubject_1 = require("rxjs/observable/dom/WebSocketSubject");
const axios_1 = require("axios");
class ChatService {
    constructor() {
        this.httpBasePath = "http://localhost:7000";
        this.wsBasePath = "ws://localhost:7001";
    }
    connect(name) {
        this.socket = new WebSocketSubject_1.WebSocketSubject(`${this.wsBasePath}?name=${name}`);
        this.socket.pipe(operators_1.tap(() => console.log("Connected")), operators_1.map(x => {
            return {
                data: x
            };
        }));
        return this.socket;
    }
    disconnect() {
        if (!this.socket) {
            return;
        }
        this.socket.unsubscribe();
        axios_1.default.delete(`${this.httpBasePath}/session/${this.activeSessionId}`);
        this.activeSessionId = undefined;
    }
    listSessions() {
        return axios_1.default.get(`${this.httpBasePath}/session`).then(response => {
            return response.data;
        });
    }
    sendMessage(text) {
        this.socket.next(text);
    }
}
exports.ChatService = ChatService;
