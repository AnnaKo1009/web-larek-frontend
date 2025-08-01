import { IProduct, IProductList } from "../../types";
import { IEvents } from "../base/events";

export class ProductData implements IProductList {
    protected cards: IProduct[];

    constructor(protected events: IEvents) {
    }

    // возвращаем массив карточек
    getProducts(): IProduct[] {
        return this.cards;
    }

    setProducts(products: IProduct[]) {
    this.cards = products;
    this.events.emit('cards:changed');
}

    // метод для поиска продукта по ID
    getProductById(productId: string): IProduct | undefined {
        return this.cards.find(item => item.id === productId);
    }
}