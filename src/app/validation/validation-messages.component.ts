import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from './validation.service';

@Component({
    selector: 'validation-messages',
    template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`,
    styles: ['div { border-left: 3px solid red; padding-left: 5px; color: red; margin-bottom: 10px; }']
})
export class ValidationMessagesComponent {
//   errorMessage: string;
    @Input() control: FormControl;
    constructor() { }

    get errorMessage() {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
            }
        }

        return null;
    }
}