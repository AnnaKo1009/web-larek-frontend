import { ApiPostMethods } from "../components/base/api";
export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type PaymentMethod = 'online' | 'offline' | '';
export type ProductType = 'софт-скил'| 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое'; 
export type categoryTypesIcons = {
  [Key in ProductType]: string;
};


export interface ApiResponse {
    total: number;
    items: IProduct[],
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: ProductType;
    price: number;
}

export interface IUserForm {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

export interface IProductList {
    getProducts(): IProduct[]; 
    setProducts(value: IProduct[]): void;
}

export interface IBasket {
    getBasketList(): IProduct[];
    addToBasket(item: IProduct): void;
    removeFromBasket(id: string): void;
    getTotalAmount(): number;
    getTotalPrice(): number;
}


export interface IOrder extends IUserForm {
    total: number;
    items: string[];
} 
 

export interface IOrderResult {
    id: string;
    total: number;
}