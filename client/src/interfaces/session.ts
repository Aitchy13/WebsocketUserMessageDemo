import { Message } from "./message";

export interface Session {
    id: string;
    messages: Message[];
    clientName: string;
}