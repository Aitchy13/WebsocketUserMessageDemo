import { tap, map } from "rxjs/operators";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import axios from "axios";
import { Session } from "./interfaces/session";

export class ChatService {

	private activeSessionId: string;
	private socket: WebSocketSubject<string>;

	private httpBasePath: string = "http://localhost:7000";
	private wsBasePath: string = "ws://localhost:7001";

	constructor() {}

	public connect(name: string) {
		this.socket = new WebSocketSubject(`${this.wsBasePath}?name=${name}`);
		this.socket.pipe(
			tap(() => console.log("Connected")),
			map(x => {
        		return {
          			data: x
        		};
      		})
		);
		return this.socket;
	}

	public disconnect() {
		if (!this.socket) {
			return;
		}
		this.socket.unsubscribe();
		axios.delete(`${this.httpBasePath}/session/${this.activeSessionId}`);
		this.activeSessionId = undefined;
	}

	public listSessions() {
		return axios.get<Session[]>(`${this.httpBasePath}/session`).then(response => {
			return response.data;
		});
	}

	public sendMessage(text: string): void {
		this.socket.next(text);
	}
}
