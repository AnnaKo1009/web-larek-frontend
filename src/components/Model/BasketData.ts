import { IProduct, IBasket } from "../../types";
import { IEvents } from "../base/events";


export class BasketData implements IBasket {
    protected basketGoods: IProduct[] = [];

    constructor(protected events: IEvents) {
    }

    // возвращает массив товаров в корзине
    getBasketList(): IProduct[] {
        return [...this.basketGoods];
    }

    // добавляет товар в корзину и вызывает событие  изменения массива с товарами в корзине
    addToBasket(item: IProduct): void {
        this.basketGoods.push(item);
        this.emitChangeEvent();
    }

    // убирает товар из корзины и вызывает событие  изменения массива с товарами в корзине
    removeFromBasket(id: string): void {
        this.basketGoods = this.basketGoods.filter(item => item.id !== id);
        this.emitChangeEvent();
    }

    // проверяет пустая ли корзина
    isBasketEmpty(): boolean {
        return (this.basketGoods.length === 0);
    }

    // проверяет наличие товара в корзине
    isProductIn(productId: string): boolean {
        return this.basketGoods.some(product => product.id === productId);
    }

    // возвращает количество товаров в корзине
    getTotalAmount(): number {
        return this.basketGoods.length;
    }

    // возвращает сумму всех товаров в корзине
    getTotalPrice(): number {
        return this.basketGoods.reduce((total, item) => total + item.price, 0);
    }
    
    // очищает корзину
    clearBasket(): void {
        this.basketGoods = [];
        this.emitChangeEvent();
    }

    // метод для отправки события 
    private emitChangeEvent(): void {
        this.events.emit('basket:changed', this.getBasketList());
    }

}



