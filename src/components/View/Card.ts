import { IEvents } from "../base/events";
import { Component } from '../base/component';
import { IProduct, ProductType } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { categoryIcons } from "../../utils/constants"


interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    setId(value: string): void;
    setDescription(value: string): void;
    setCategory(value: ProductType): void;
    setProductImage(value: string): void;
    setTitle(value: string): void;
    setPrice(value: number): void;

    getId(): string;
}

export class Card extends Component<ICard> {
    protected element: HTMLElement;
    protected title: HTMLElement;
    protected image?: HTMLImageElement;
    protected category?: HTMLElement;
    protected price: HTMLElement;
    protected description?: HTMLElement;
    protected button?: HTMLButtonElement;
    protected id: string;
    protected events: IEvents


    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {

        super(container);

        this.title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

        this.image = container.querySelector(`.${blockName}__image`);
        this.category = container.querySelector(`.${blockName}__category`);
        this.description = container.querySelector(`.${blockName}__text`);
        this.button = container.querySelector(`.${blockName}__button`);


        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Установка наименование товара
    protected setTitle(value: string): void {
        this.setText(this.title, value);
    }

    // Установка описания товара
    protected setDescription(value: string): void {
        if (this.description) {
            this.setText(this.description, value);
        }
    }

    // Установка категории товара
    protected setCategory(value: ProductType): void {
        if (this.category) {
            this.setText(this.category, value);
            const classList = this.category.classList;
        Array.from(classList).forEach(className => {
            if (className.startsWith('card__category_')) {
                classList.remove(className);
            }
        });
             this.category.classList.add(categoryIcons[value]);

        }
    }

      // Установка цены товара
    protected setPrice(value: number): void {
        if (!value) {
            this.setText(this.price, 'Бесценно');
        } else {
            this.setText(this.price, value.toString() + ' синапсов');
        }

        if (this.button) {
            this.button.disabled = !value;
        }
    }

      // Установка изображения товара
    protected setProductImage(value: string): void {
        if (this.image) {
            this.setImage(this.image, value);
        }
    }

    getId(): string {
        return this.id;
    }

    setId(value: string) {
        this.id = value;
    }

    // Переключаем текст кнопки в модальном окне карточки, когда кладем товар в корзину
    toggleButton(inBasket: boolean): void {
        if (this.button) {
            this.button.textContent = inBasket ? 'Удалить из корзины' : 'В корзину';
        }
    }

    // рендерим карточку
    renderCard(item: IProduct): HTMLElement {
        this.setId(item.id);
        this.setTitle(item.title);
        this.setCategory(item.category);
        this.setProductImage(item.image);
        this.setPrice(item.price);
        this.setDescription(item.description);
        return this.container;
    }
}
