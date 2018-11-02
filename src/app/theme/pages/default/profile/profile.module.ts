import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { ConfirmationDialog } from '../confirm-dialog/confirmation-dialog';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": ProfileComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule,ReactiveFormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        ProfileComponent,
        //ConfirmationDialog
    ]
})


export class ProfileModule {



}