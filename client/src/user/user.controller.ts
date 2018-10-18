import { ChatService } from "../chat.service";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";

class UserController {

    private startContainer: HTMLElement;
    private nameInput: HTMLInputElement;
    private startButton: HTMLElement;

    constructor(private readonly chatService: ChatService) {
        this.startContainer = document.getElementById("start-container");
        this.nameInput = document.getElementById("name") as HTMLInputElement;
        this.startButton = document.getElementById("start-button");
        this.startButton.addEventListener("click", () => {
            this.onStartClick();
        })
    }

    public onStartClick() {
        const nameInput = this.nameInput.value;
        this.chatService.connect(nameInput).pipe(
            tap(() => {
                this.startContainer.style.display = "none"; 
            }),
            catchError(e => {
                console.error(e);
                return throwError(e);
            })
        ).subscribe();
    }

}

const chatService = new ChatService();
new UserController(chatService);