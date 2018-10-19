import { tap, map } from "rxjs/operators";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import axios from "axios";
import { Session } from "../interfaces/session";
import { Message } from "../interfaces/message";

export class ChatService {

	private activeSessionId: string;
	private socket: WebSocketSubject<Message>;

	private httpBasePath: string = "http://localhost:7000";
	private wsBasePath: string = "ws://localhost:7001";

	constructor() {}

	public connect(name: string) {
		this.socket = new WebSocketSubject(`${this.wsBasePath}?name=${name}`);
		this.socket.pipe(
			tap(() => console.log("Connected")),
			map(x => Object.assign({}, x, { date: new Date(x.date) }))
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

	public sendMessage(sessionId: string, sender: string, message: string) {
		return axios.post(`${this.httpBasePath}/session/message`, {
			sessionId,
			message,
			sender
		});
	}
}
