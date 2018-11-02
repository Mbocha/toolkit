import {FormControl, Validators} from "@angular/forms";

export class PreEuro {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro1 {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro2 {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro3 {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro4 {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro5 {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro6 {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class HybridElectric {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;
}

export class PlugInHybridElectric {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class BatteryElectric {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class TwoStroke {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class FourStroke {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class ElectricMCycles {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class DieselGenerators {
    numVehicles?: number;
    annualMileage?: number;
    annualFuel?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class SwitchToHevs {
    hEVFuelEconomy?: number;
    hEVAdditionalCostPerVehicle?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class SwitchToBEVs {
    bevCarsKmsPerKWh?: number;
    bevCarsAdditionalCostPerVehicle?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class SwitchElecMotor {
    elecBikesKmsPerKWh?: number;
    elecBikesAdditionalCostPerbike?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class GeneratorAlternatives {
    electricityDemand?: number;
    pvItemsCost?:number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class SwitchToNewTrucks {
    bevTrucksKmPerKWh?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}