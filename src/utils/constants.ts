import { categoryTypesIcons } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;


export const categoryIcons: categoryTypesIcons = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'другое': 'card__category_other',
}


