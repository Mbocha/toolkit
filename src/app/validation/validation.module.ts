import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ValidationMessagesComponent } from "./validation-messages.component";
import { ValidationService } from "./validation.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        ValidationMessagesComponent
    ],
    providers: [
        ValidationService
    ],
    exports: [
        ValidationMessagesComponent
    ]
})
export class ValidationModule { }