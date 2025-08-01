import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";


interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected wrapper: HTMLElement;
    protected basket: HTMLElement;
    protected counter: HTMLElement;
    protected catalog: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.counter = ensureElement<HTMLElement>('.header__basket-counter');
        this.catalog = ensureElement<HTMLElement>('.gallery');
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basket = ensureElement<HTMLElement>('.header__basket');

        this.basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // обновляет счетчик товаров в корзине
    setCounter(value: number): void {
    this.setText(this.counter, String(value));
}

    // отображает карточки товаров на странице
    setCatalog(cards: HTMLElement[]): void {
        this.catalog.replaceChildren(...cards);
    }

    // блокирует страницу при открытии модального окна
    setLocked(value: boolean): void {
        if (value) {
            this.wrapper.classList.add('page__wrapper_locked');
        } else {
            this.wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
