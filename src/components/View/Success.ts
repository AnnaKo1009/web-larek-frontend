 
import { Component } from "../base/component";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
    protected furtherButton: HTMLButtonElement;
    protected total: HTMLElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this.total = container.querySelector('.order-success__description');
        this.furtherButton = container.querySelector('.order-success__close')

        if (actions?.onClick) {
            if (this.furtherButton) {
                this.furtherButton.addEventListener('click', actions.onClick);
            }
        }
    }

    setTotal(value: number): void {
        this.total.textContent = `Списано ${value.toString()} синапсов`;
    }
}