import { ChatService } from "../chat.service";
import { Session } from "../interfaces/session";

class AgentController {

    private sessions: Session[];
    private sessionContainer: HTMLElement;

    constructor(private readonly chatService: ChatService) {
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
        if (!this.sessions) {
            this.sessionContainer.innerHTML = `<p>No sessions</p>`;
            return;
        }
        const template = `<p>
            <strong>ID:</strong> {{id}}<br />
            <strong>Name:</strong> {{name}}<br />
            <strong>Agent:</strong> {{agent}}<br />
            <strong>Messages:</strong> {{messages}}<br />
        </p>`;
        let sessionContainerHTML: string;
        this.sessions.forEach(x => {
            sessionContainerHTML += this.generateTemplate(template, {
                id: x.id,
                name: x.clientName,
                agent: x.agentName,
                messages: x.messages.length
            })
        });
        this.sessionContainer.innerHTML = sessionContainerHTML;
    }

    private generateTemplate(template: string, data: {[key: string]: any}) {
        const keys = Object.keys(data);
        const result = template;
        keys.forEach(x => result.replace(x, data[x]));
    }

}

const chatService = new ChatService();
var controller = new AgentController(chatService);