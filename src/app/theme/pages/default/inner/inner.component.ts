import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
    selector: "app-inner",
    templateUrl: "./inner.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class InnerComponent implements OnInit, AfterViewInit {
    public innerPageTitle = 'Inner Page Title';
    public parentPageTitle = 'Parent Page';

    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('app-inner',
            ['assets/app/js/dashboard.js']);
    }
}