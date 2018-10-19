import { ChatService } from "../services/chat.service";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";

export class UserController {

    private startContainer: HTMLElement;
    private nameInput: HTMLInputElement;
    private startButton: HTMLElement;

    constructor(private readonly chatService: ChatService) {
        if (!document.getElementById("user-view")) {
            return;
        }
        this.startContainer = document.getElementById("start-container");
        this.nameInput = document.getElementById("name") as HTMLInputElement;
        this.startButton = document.getElementById("start-button");
        this.startButton.addEventListener("click", () => {
            this.onStartClick();
        });
    }

    public onStartClick() {
        const nameInput = this.nameInput.value;
        this.chatService.connect(nameInput).pipe(
            tap(message => {
                alert(message.text + " sent from " + message.sender);
            }),
            catchError(e => {
                console.error(e);
                return throwError(e);
            })
        ).subscribe();
    }

}
