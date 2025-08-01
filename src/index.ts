import './scss/styles.scss';

import { AppApi } from './components/AppAPI';
import { EventEmitter, IEvents } from './components/base/events';
import { BasketData } from './components/Model/BasketData';
import { ProductData } from './components/Model/ProductData';
import { UserData } from './components/Model/UserData';
import { Basket } from './components/View/Basket';
import { Card } from './components/View/Card';
import { ContactsForm, IContactsForm } from './components/View/ContactsForm';
import { Modal } from './components/View/Modal';
import { IOrderForm, OrderForm } from './components/View/OrderForm';
import { Page } from './components/View/Page';
import { Success } from './components/View/Success';
import './scss/styles.scss';
import { PaymentMethod, IOrder, IProduct, IUserForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IFormCommon } from './components/View/FormCommon';

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Все темплейты
const cardCatalogueTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Экземпляры модели данных приложения
const productData = new ProductData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);

// Элементы DOM
const orderFormElement = orderFormTemplate.content.querySelector('.form') as HTMLFormElement;
const contactsFormElement = contactsFormTemplate.content.querySelector('.form') as HTMLFormElement;
const modalElement = ensureElement<HTMLElement>('#modal-container');

// Глобальные контейнеры
const page = new Page(document.querySelector('.page') as HTMLElement, events);
const modal = new Modal(modalElement, events);


// Экзмепляры объектов представления
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(orderFormElement, events);
const contactsForm = new ContactsForm(contactsFormElement, events);
const successView = new Success(cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close()
  }
});

// Получаем карточки с сервера
api.getProductList()
  .then(productData.setProducts.bind(productData))
  .catch(err => {
    console.error(err);
  });


// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on('cards:changed', () => {
  page.setCatalog(productData.getProducts().map((item) => {
    const product = new Card('card', cloneTemplate(cardCatalogueTemplate), {
      onClick: () => {
        events.emit('card:open', item)
      }
    });
    return product.renderCard(item);
  }));
});

// Открытие карточки в модальном окне, обработка кликов по кнопке в корзину, удалить из корзины
events.on('card:open', (item: IProduct) => {
  const cardElement = cloneTemplate(cardPreviewTemplate);
  const openCard = new Card('card', cardElement, {
    onClick: () => {
      if (basketData.isProductIn(item.id)) {
        basketData.removeFromBasket(item.id);
      } else {
        basketData.addToBasket(item);
      }
      // Обновляем текст кнопки после изменения
      openCard.toggleButton(basketData.isProductIn(item.id));
      page.setCounter(basketData.getTotalAmount());
    }
  });
  openCard.toggleButton(basketData.isProductIn(item.id));
  openCard.renderCard(item);
  modal.renderContent({ content: cardElement });
});

// Открытие корзины
events.on('basket:open', () => {
  const basketItems = basketData.getBasketList().map((item: IProduct) => {
    const basketElement = new Card('card', cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('basket:delete', item)
    });
    return basketElement.renderCard(item);
  });
  const basketClone = cloneTemplate(basketTemplate);
  const tempBasket = new Basket(basketClone, events);
  tempBasket.renderBasket(basketItems, basketData.getTotalPrice());
  modal.renderContent({ content: basketClone });
});

// Удаление товара из списка в корзине
events.on('basket:delete', (item: IProduct) => {
  basketData.removeFromBasket(item.id);
  events.emit('basket:open');
})

// Изменилось содержание корзины
events.on('basket:changed', (items: IProduct[]) => {
  const basketProductsList = basketData.getBasketList().map((item: IProduct) => {
    const basketProduct = new Card('card', cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('basket-item:delete', item);
      }
    });
    return basketProduct.renderCard(item);
  });
  page.setCounter(basketData.getTotalAmount());
});

// Обработка клика на кнопку Оформить
events.on('form:open', () => {
  modal.renderContent({ 
    content: orderForm.render({ 
      payment: userData.getFieldData().payment,
      address: userData.getFieldData().address,
      valid: false,
      errors: ''
    })
  });
});

// Обработка изменения способа оплаты
events.on(/^order\..*: change/, (data: { field: keyof IOrderForm, value: string }) => {
  userData.setFieldData(data.field, data.value);
  events.emit('form:change');
});

// Обработка изменения полей формы контактов
events.on(/^contacts\..*: change/, (data: { field: keyof IOrderForm, value: string }) => {
  userData.setFieldData(data.field, data.value); 
  events.emit('form:change');
});


events.on('form:change', () => {
  const formData = userData.getFieldData();
  const errors = userData.checkValidation();

  // проверяем валидность форм
  const isOrderValid = !errors.payment && !errors.address;
  const isContactsValid = !errors.email && !errors.phone;

  // обновляем форму заказа
  orderForm.render({
    payment: formData.payment,
    address: formData.address,
    valid: isOrderValid,
    errors: [errors.payment, errors.address].filter(Boolean).join('; ')
  });

  // обновляем форму контактов
  contactsForm.render({
    email: formData.email,
    phone: formData.phone,
    valid: isContactsValid,
    errors: [errors.email, errors.phone].filter(Boolean).join('; ')
  });
});

// Обработчик клика на кнопку Далее и перехода к форме с контактами
events.on('order:submit', () => {
    modal.renderContent({
    content: contactsForm.render({
      email: userData.getFieldData().email,
      phone: userData.getFieldData().phone,
      valid: false, 
      errors: '' 
    })
  });
});


// Обработка оформления товаров по кнопке Оформить в модальном окне с контактами
events.on('contacts:submit', () => {
    const formData = userData.getFieldData();
    const productsId = basketData.getBasketList().map((item) => {
        return item.id;
    })
    const orderObject = {
        ...formData,
        total: basketData.getTotalPrice(),
        items: productsId,
    };
    api.orderProducts(orderObject)
        .then((res) => {
            basketData.clearBasket();
            page.setCounter(basketData.getTotalAmount());
            successView.setTotal(orderObject.total);
            modal.renderContent({
                content: successView.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
})

// Модальное окно открыто, прокрутка страницы заблокирована
events.on('modal:open', () => {
  page.setLocked(true);
});


// закрытие модального окна, разблокировка прокрутки страницы
events.on('modal:close', () => {
  page.setLocked(false);
});