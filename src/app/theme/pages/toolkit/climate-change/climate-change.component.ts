import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
    selector: "app-inner",
    templateUrl: "./climate-change.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ClimateChangeComponent implements OnInit, AfterViewInit {
    public innerPageTitle = 'Climate Change and the Greenhouse Effect';

    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('app-inner',
            ['assets/cleanFleet/components/portlets/tools.js']);
    }
}