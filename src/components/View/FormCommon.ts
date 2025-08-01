import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";
import { Component } from "../base/component";
import { IOrderForm } from "./OrderForm";

export interface IFormCommon {
    valid: boolean;
    errors: string;
}

export class FormCommon<T> extends Component<IFormCommon> {
    protected submit: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

     protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.container.name}.${String(field)}: change`, { field, value });
         this.events.emit('form:change');
    }


    setValid(value: boolean) {
        this.submit.disabled = !value;
    }

    setErrors(value: string) {
        this.setText(this.formErrors, value);
    }

    render(state: Partial<T> & IFormCommon) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}

