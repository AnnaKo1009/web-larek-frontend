import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { FormCommon, IFormCommon } from "./FormCommon";

export interface IContactsForm{
   phone: string;
   email: string;
}

// 
export class ContactsForm extends FormCommon<IContactsForm> {
  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events)
  }

  render(state: Partial<IContactsForm> & IFormCommon) {
    super.render(state);
    this.setValid(state.valid);
    this.setErrors(state.errors);
    return this.container;
  }
}
