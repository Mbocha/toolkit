import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class FleetDataService {
    private currentFleet = new BehaviorSubject<Object>(null);
    private isSetCurrentFleet = new BehaviorSubject<Object>({ isSetFleet: false });


    private currentFleetTotals = new BehaviorSubject<Object>(null);
    currentTotals = this.currentFleetTotals.asObservable();

    constructor() { }

    emitCurrentFleetTotals(totals: any) {
        this.currentFleetTotals.next(totals);
    }


    setCurrentFleet(fleetName: any) {
        this.currentFleet.next({ fleetName: fleetName });
    }

    clearFleetData() {
        this.currentFleet.next(null);
    }

    getCurrentFleet(): Observable<any> {
        return this.currentFleet.asObservable();
    }

    isSetFleetClicked(isSetFleet: boolean) {
        this.isSetCurrentFleet.next({ isSetFleet: isSetFleet });
    }

    getIfSetFleetClicked(): Observable<any> {
        return this.isSetCurrentFleet.asObservable();
    }
}