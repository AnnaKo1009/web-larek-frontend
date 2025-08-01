import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected content: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.content = ensureElement<HTMLElement>('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.content.addEventListener('click', (event) => event.stopPropagation());
    }


    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    setContent(value: HTMLElement): void {
            this.content.replaceChildren(value);
        }


    renderContent(data: IModalData): HTMLElement {
        this.setContent(data.content);
        this.open();
        return this.container;
    }

}


