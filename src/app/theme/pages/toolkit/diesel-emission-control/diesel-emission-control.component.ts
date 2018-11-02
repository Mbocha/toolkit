import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
    selector: "app-inner",
    templateUrl: "./diesel-emission-control.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class DieselEmissionsControlComponent implements OnInit, AfterViewInit {
    public innerPageTitle = 'Emission Control for Diesel Vehicles';

    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('app-inner',
            ['assets/cleanFleet/components/portlets/tools.js']);
    }
}