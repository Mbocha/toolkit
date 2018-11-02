import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import {FleetDataService} from "../../../../_services/fleet.data.service";


@Component({
    selector: "app-inner",
    templateUrl: "./strategy-checklist.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class StrategyChecklistComponent implements OnInit, AfterViewInit {
    public innerPageTitle = 'Strategy Checklist';

    totals:any;

    constructor(
        private _script: ScriptLoaderService,
        private fleetDataService:FleetDataService
    ) {

    }
    ngOnInit() {
        this.fleetDataService.currentTotals.subscribe(result => {
            this.totals = result;
        });
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-inner',
            ['assets/cleanFleet/components/portlets/tools.js']);
    }
}