import { IUserForm, IOrder, IBasket, FormErrors } from "../../types";
import { IEvents } from "../base/events";


export class UserData {
  protected formData: IUserForm =  {
      payment: '',
      address: '',
      email: '',
      phone: '',
  }; 
  
  constructor(protected events: IEvents) {}
  
    private errors: Partial<Record<keyof IUserForm, string>> = {};

    getFieldData(): IUserForm {
      return this.formData;
    }
  
    setFieldData<T extends keyof IUserForm>(field: T, value: IUserForm[T]): void {
    this.formData[field] = value;
    this.events.emit('form:change');
    }
    

    checkValidation(): FormErrors {
        const errors: FormErrors = {};
        if (!this.formData.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.formData.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        if (!this.formData.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.formData.email) {
            errors.email = 'Необходимо указать email';
        }
        
        return errors
    }
  
     getError(field: keyof IUserForm): string | undefined {
      return this.errors[field];
    }
  
     getAllErrors(): typeof this.errors {
      return { ...this.errors };
    }
  
    clearForm(): void {
      this.formData = {
        payment: '',
        address: '',
        email: '',
        phone: ''
      };
      this.errors = {};
      this.events.emit('form:change');
    }
  
    private clearError(field: keyof IUserForm): void {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    }
  
  }
    