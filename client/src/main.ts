import { ChatService } from "./services/chat.service";

import { UserController } from "./user/user.controller";
import { AgentController } from "./agent/agent.controller";

const chatService = new ChatService();

const userController = new UserController(chatService);
const agentController = new AgentController(chatService);