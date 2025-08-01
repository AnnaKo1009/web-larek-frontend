import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected list: HTMLElement;
    protected totalPrice: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalPrice = this.container.querySelector('.basket__price');
        this.orderButton = this.container.querySelector('.basket__button');

        if (this.orderButton) {
            this.orderButton.addEventListener('click', () => {
                events.emit('form:open');
            });
        }
    }
    setList(items: HTMLElement[]) {
        if (items.length) {
            this.list.replaceChildren(...items);
        } else {
            this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.orderButton.disabled = true; // делаем кнопку неактивной при пустой корзине
        }
    }

    setTotalPrice(total: number) {
        this.setText(this.totalPrice, `${total.toString()} синапсов`);
    }


    setIndex(items: HTMLElement[]) {
        items.forEach((item, index) => {
            const indexElement = item.querySelector('.basket__item-index');
            indexElement.textContent = (index + 1).toString();
            }
        );
    }
    
    renderBasket(items:HTMLElement[], total: number) {
        this.setList(items);
        this.setTotalPrice(total);
        this.setIndex(items);
        this.orderButton.disabled = total <= 0;
        return this.container
    }

}


