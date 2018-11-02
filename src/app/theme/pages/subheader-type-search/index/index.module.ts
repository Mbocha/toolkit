import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IndexComponent} from "../index/index.component";
import {SubheaderTypeSearchComponent} from "../subheader-type-search.component";
import {LayoutModule} from "../../../layouts/layout.module";
import {ValidationModule} from "../../../../validation/validation.module";

import { NgStickyModule } from 'ng-sticky';
import {ChartsModule} from "ng2-charts";

const routes: Routes = [
    {
        "path": "",
        "component": SubheaderTypeSearchComponent,
        "children": [
            {
                "path": "",
                "component": IndexComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        ValidationModule,
        ChartsModule,
        NgStickyModule
    ], exports: [
        RouterModule
    ], declarations: [
        IndexComponent,
    ]
})
export class IndexModule {



}