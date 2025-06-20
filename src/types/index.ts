export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IUserForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IProductList {
    cards: IProduct[];
}

export interface IBasket {
    basketGoods: IProduct[];
}

export interface IOrder extends IUserForm {
    total: number;
    items: string[];
} 
 
