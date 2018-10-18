import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
export declare class ChatService {
    private activeSessionId;
    private socket;
    private httpBasePath;
    private wsBasePath;
    constructor();
    connect(name: string): WebSocketSubject<string>;
    disconnect(): void;
    listSessions(): any;
    sendMessage(text: string): void;
}
