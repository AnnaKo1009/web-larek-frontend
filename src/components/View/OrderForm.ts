import { PaymentMethod } from "../../types";
import { IEvents } from "../base/events";
import { FormCommon, IFormCommon } from "./FormCommon";

export interface IOrderForm {
    payment: PaymentMethod;
    address: string;
}

export class OrderForm extends FormCommon<IOrderForm> {
    protected address: HTMLInputElement;
    protected offlinePayment: HTMLButtonElement;
    protected onlinePayment: HTMLButtonElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this.address = container.elements.namedItem('address') as HTMLInputElement;
        this.offlinePayment = container.elements.namedItem('cash') as HTMLButtonElement;
        this.onlinePayment = container.elements.namedItem('card') as HTMLButtonElement;

        if (this.offlinePayment) {
            this.offlinePayment.addEventListener('click', () => {
                this.onInputChange('payment', 'offline');
                this.togglePaymentMethodButton('offline'); 
            });
        }
        if (this.onlinePayment) {
            this.onlinePayment.addEventListener('click', () => {
                this.onInputChange('payment', 'online');
                this.togglePaymentMethodButton('online');
            });
        }
    }

    protected togglePaymentMethodButton(value: PaymentMethod): void {
        if (value === 'online') {
            this.onlinePayment.classList.add('button_alt-active');
            this.offlinePayment.classList.remove('button_alt-active');
        } else if (value === 'offline') {
            this.offlinePayment.classList.add('button_alt-active');
            this.onlinePayment.classList.remove('button_alt-active');
        } else {
            this.offlinePayment.classList.remove('button_alt-active');
            this.onlinePayment.classList.remove('button_alt-active');
        }
    }

    render(state?: Partial<IOrderForm> & IFormCommon): HTMLFormElement {
        super.render(state);

        if (state) {
            if (state.payment) {
                this.togglePaymentMethodButton(state.payment);
            }
            this.setValid(state.valid);
            this.setErrors(state.errors);
        }
        return this.container;
    }
}






