import { ToastButton } from "@ionic/react";

export abstract class Noticacao {
    abstract toastInfo: (mensagem: string, buttons: ToastButton[]) => void;
    abstract toastOk: (mensagem: string, buttons: ToastButton[]) => void;
    abstract toastErro: (mensagem: string, buttons: ToastButton[]) => void;

    constructor() {
        
    }

}