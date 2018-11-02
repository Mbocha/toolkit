export class GeneralInfo {
    fleetName?: string;
    sulphurLevel: any;
    petrolPrice?: any;
    dieselPrice?:any;
    elecPrice?:any;
    fossilFuelElec?:any;
    localCurrency?:any;

    hEVFuelEconomy:number;
    hEVAdditionalCostPerVehicle:number;
    bevKmPerKWh?:number;
    bEVAdditionalCostPerVehicle?:number;
    elecBikeKmPerKWh?:number;
    elecBikeAdditionalCostPerMotorbike?:number;
    bevTrucksKmPerKWh?:number;
    siteElecDemand?:number;
    pvItemsCost?:number;
    pvTotalCost?:number;
    
    constructor(
        values: Object = {}
    ) {
        Object.assign(this, values);
    }
}