import { ChatService } from "../services/chat.service";
import { Session } from "../interfaces/session";

export class AgentController {

    private sessions: Session[];
    private sessionContainer: HTMLElement;

    constructor(private readonly chatService: ChatService) {
        if (!document.getElementById("agent-view")) {
            return;
        }
        this.initialise();
    }

    private initialise() {
        this.sessionContainer = document.getElementById("session-container");
        // This would be slick to populate via websockets to prevent page refresh
        this.sessionContainer.innerHTML = `<p>Loading...</p>`;
        this.chatService.listSessions().then(sessions => {
            this.sessions = sessions;
            this.render();
        });
    }

    private render() {
        if (!this.sessions || this.sessions.length === 0) {
            this.sessionContainer.innerHTML = `<p>No sessions</p>`;
            return;
        }
        const template = `
            <p>
                <strong>ID:</strong> {{id}}<br />
                <strong>Name:</strong> {{name}}<br />
                <strong>Messages:</strong> {{messages}}<br />
            </p>
            <button id="send-button{{id}}">Send greeting</button>`;
        let sessionContainerHTML: string = "";
        this.sessions.forEach(x => {
            sessionContainerHTML += this.generateTemplate(template, {
                id: x.id,
                name: x.clientName,
                messages: x.messages.length
            })
        });
        this.sessionContainer.innerHTML = sessionContainerHTML;
        this.sessions.forEach(x => {
            const button = document.getElementById("send-button" + x.id);
            button.addEventListener("click", () => this.chatService.sendMessage(x.id, "Mr. Agent", "Hi, " + x.clientName));
        })
    }

    private generateTemplate(template: string, data: {[key: string]: any}) {
        const keys = Object.keys(data);
        let result = template;
        keys.forEach(x => result = result.replace(new RegExp(`{{${x}}}`, "g"), data[x]));
        return result;
    }

}
