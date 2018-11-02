export class EmissionFactors{
    petrolCO2perLtr:number = 2.35;  //2350
    dieselCO2perLtr:number = 2.60;  //2600
    passengerCarsGasoline:PassengerCarsGasoline = new PassengerCarsGasoline();
    passengerCarsDiesel:PassengerCarsDiesel = new PassengerCarsDiesel();
    passengerSUVsGasoline:PassengerSUVGasoline = new PassengerSUVGasoline();
    passengerSUVsDiesel:PassengerSUVDiesel = new PassengerSUVDiesel();
    lightDutyGasoline:LightDutyGasoline = new LightDutyGasoline();
    lightDutyDiesel:LightDutyDiesel = new LightDutyDiesel();
    mediumDutyDiesel:MediumDutyDiesel = new MediumDutyDiesel();
    heavyDutyDiesel:HeavyDutyDiesel = new HeavyDutyDiesel();
    motorcycles:Motorcycles = new Motorcycles();
    generators:Generators = new Generators();
    eV0FossilFuel:EV0FossilFuel = new EV0FossilFuel();
    eV20FossilFuel:EV20FossilFuel = new EV20FossilFuel();
    eV40FossilFuel:EV40FossilFuel = new EV40FossilFuel();
    eV60FossilFuel:EV60FossilFuel = new EV60FossilFuel();
    eV80FossilFuel:EV80FossilFuel = new EV80FossilFuel();
    eV100FossilFuel:EV100FossilFuel = new EV100FossilFuel();
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

export class PassengerCarsGasoline {
    preEuro:PreEuro = new PreEuro({carbonMonoxide: 9.25,volatileOrganic:0.96,nitrousOxide:1.37,sulphurOxide:0.03,particulateMatter:0.03});
    euro1:Euro1 = new Euro1({carbonMonoxide:8.50,volatileOrganic:0.93,nitrousOxide:1.40,sulphurOxide:0.025,particulateMatter:0.02});
    euro2:Euro2 = new Euro2({carbonMonoxide:4.34,volatileOrganic:0.46,nitrousOxide:0.76,sulphurOxide:0.02,particulateMatter:0.01});
    euro3:Euro3 = new Euro3({carbonMonoxide:3.70,volatileOrganic:0.27,nitrousOxide:0.64,sulphurOxide:0.02,particulateMatter:0.006});
    euro4:Euro4 = new Euro4({carbonMonoxide:2.63,volatileOrganic:0.14,nitrousOxide:0.12,sulphurOxide:0.009,particulateMatter:0.006});
    euro5:Euro5 = new Euro5({carbonMonoxide:1.80,volatileOrganic:0.11,nitrousOxide:0.08,sulphurOxide:0.0056,particulateMatter:0.006});
    euro6:Euro6 = new Euro6({carbonMonoxide:1.78,volatileOrganic:0.11,nitrousOxide:0.07,sulphurOxide:0.003,particulateMatter:0.006});
}

export class PassengerCarsDiesel {
    euro3:Euro3 = new Euro3({carbonMonoxide:0.19, volatileOrganic:0.10, nitrousOxide:0.57, sulphurOxide:0.03, particulateMatter:0.08});
    euro4:Euro4 = new Euro4({carbonMonoxide:0.19, volatileOrganic:0.10, nitrousOxide:1.64, sulphurOxide:0.01, particulateMatter:0.006});
    euro5:Euro5 = new Euro5({carbonMonoxide:0.24, volatileOrganic:0.02, nitrousOxide:0.28, sulphurOxide:0.003, particulateMatter:0.006});
    euro6:Euro6 = new Euro6({carbonMonoxide:1.70, volatileOrganic:0.04, nitrousOxide:0.14, sulphurOxide:0.001, particulateMatter:0.006});
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerSUVGasoline {
    preEuro:PreEuro = new PreEuro({carbonMonoxide:19.51, volatileOrganic:1.73, nitrousOxide:2.76, sulphurOxide:0.04, particulateMatter:0.04});
    euro1:Euro1 = new Euro1({carbonMonoxide:19.16, volatileOrganic:1.68, nitrousOxide:2.79, sulphurOxide:0.02, particulateMatter:0.02});
    euro2:Euro2 = new Euro2({carbonMonoxide:8.20, volatileOrganic:0.98, nitrousOxide:1.44, sulphurOxide:0.02, particulateMatter:0.02});
    euro3:Euro3 = new Euro3({carbonMonoxide:7.17, volatileOrganic:0.78, nitrousOxide:1.16, sulphurOxide:0.02, particulateMatter:0.01});
    euro4:Euro4 = new Euro4({carbonMonoxide:4.45, volatileOrganic:0.25, nitrousOxide:0.33, sulphurOxide:0.01, particulateMatter:0.01});
    euro5:Euro5 = new Euro5({carbonMonoxide:3.17, volatileOrganic:0.17, nitrousOxide:0.21, sulphurOxide:0.007, particulateMatter:0.01});
    euro6:Euro6 = new Euro6({carbonMonoxide:3.08, volatileOrganic:0.17, nitrousOxide:0.19, sulphurOxide:0.006, particulateMatter:0.01});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerSUVDiesel {
    preEuro:PreEuro = new PreEuro({carbonMonoxide:2.24, volatileOrganic:0.57, nitrousOxide:3.89, sulphurOxide:0.06, particulateMatter:0.47});
    euro1:Euro1 = new Euro1({carbonMonoxide:2.58, volatileOrganic:0.63, nitrousOxide:3.53, sulphurOxide:0.06, particulateMatter:0.27});
    euro2:Euro2 = new Euro2({carbonMonoxide:2.32, volatileOrganic:0.54, nitrousOxide:3.45, sulphurOxide:0.05, particulateMatter:0.39});
    euro3:Euro3 = new Euro3({carbonMonoxide:1.85, volatileOrganic:0.43, nitrousOxide:2.68, sulphurOxide:0.04, particulateMatter:0.17});
    euro4:Euro4 = new Euro4({carbonMonoxide:1.43, volatileOrganic:0.34, nitrousOxide:3.17, sulphurOxide:0.02, particulateMatter:0.14});
    euro5:Euro5 = new Euro5({carbonMonoxide:0.29, volatileOrganic:0.04, nitrousOxide:1.20, sulphurOxide:0.006, particulateMatter:0.01});
    euro6:Euro6 = new Euro6({carbonMonoxide:0.83, volatileOrganic:0.05, nitrousOxide:0.59, sulphurOxide:0.005, particulateMatter:0.01});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class LightDutyGasoline {
    preEuro:PreEuro = new PreEuro({carbonMonoxide:19.36, volatileOrganic:1.71, nitrousOxide:2.66, sulphurOxide:0.04, particulateMatter:0.04});
    euro1:Euro1 = new Euro1({carbonMonoxide:19.76, volatileOrganic:1.72, nitrousOxide:2.80, sulphurOxide:0.02, particulateMatter:0.02});
    euro2:Euro2 = new Euro2({carbonMonoxide:9.99, volatileOrganic:1.06, nitrousOxide:1.55, sulphurOxide:0.02, particulateMatter:0.01});
    euro3:Euro3 = new Euro3({carbonMonoxide:7.89, volatileOrganic:0.81, nitrousOxide:1.24, sulphurOxide:0.02, particulateMatter:0.01});
    euro4:Euro4 = new Euro4({carbonMonoxide:5.31, volatileOrganic:0.28, nitrousOxide:0.42, sulphurOxide:0.012, particulateMatter:0.014});
    euro5:Euro5 = new Euro5({carbonMonoxide:3.96, volatileOrganic:0.19, nitrousOxide:0.27, sulphurOxide:0.007, particulateMatter:0.013});
    euro6:Euro6 = new Euro6({carbonMonoxide:3.85, volatileOrganic:0.19, nitrousOxide:0.27, sulphurOxide:0.006, particulateMatter:0.013});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class LightDutyDiesel {
    preEuro:PreEuro = new PreEuro({carbonMonoxide:2.55, volatileOrganic:0.64, nitrousOxide:4.59, sulphurOxide:0.06, particulateMatter:0.49});
    euro1:Euro1 = new Euro1({carbonMonoxide:2.66, volatileOrganic:0.66, nitrousOxide:3.64, sulphurOxide:0.06, particulateMatter:0.30});
    euro2:Euro2 = new Euro2({carbonMonoxide:2.47, volatileOrganic:0.59, nitrousOxide:3.67, sulphurOxide:0.05, particulateMatter:0.42});
    euro3:Euro3 = new Euro3({carbonMonoxide:2.07, volatileOrganic:0.50, nitrousOxide:3.00, sulphurOxide:0.04, particulateMatter:0.18});
    euro4:Euro4 = new Euro4({carbonMonoxide:1.45, volatileOrganic:0.35, nitrousOxide:3.15, sulphurOxide:0.02, particulateMatter:0.14});
    euro5:Euro5 = new Euro5({carbonMonoxide:0.30, volatileOrganic:0.04, nitrousOxide:1.23, sulphurOxide:0.006, particulateMatter:0.01});
    euro6:Euro6 = new Euro6({carbonMonoxide:0.78, volatileOrganic:0.05, nitrousOxide:0.61, sulphurOxide:0.005, particulateMatter:0.01});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class MediumDutyDiesel {
    preEuro:PreEuro = new PreEuro({carbonMonoxide:2.91, volatileOrganic:0.75, nitrousOxide:9.35, sulphurOxide:0.12, particulateMatter:0.60});
    euro1:Euro1 = new Euro1({carbonMonoxide:3.12, volatileOrganic:0.79, nitrousOxide:8.76, sulphurOxide:0.11, particulateMatter:0.43});
    euro2:Euro2 = new Euro2({carbonMonoxide:2.71, volatileOrganic:0.76, nitrousOxide:8.74, sulphurOxide:0.11, particulateMatter:0.56});
    euro3:Euro3 = new Euro3({carbonMonoxide:2.20, volatileOrganic:0.62, nitrousOxide:4.86, sulphurOxide:0.09, particulateMatter:0.26});
    euro4:Euro4 = new Euro4({carbonMonoxide:1.94, volatileOrganic:0.47, nitrousOxide:3.89, sulphurOxide:0.03, particulateMatter:0.24});
    euro5:Euro5 = new Euro5({carbonMonoxide:0.75, volatileOrganic:0.06, nitrousOxide:1.97, sulphurOxide:0.01, particulateMatter:0.01});
    euro6:Euro6 = new Euro6({carbonMonoxide:0.63, volatileOrganic:0.05, nitrousOxide:0.58, sulphurOxide:0.007, particulateMatter:0.014});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class HeavyDutyDiesel {
    preEuro:PreEuro = new PreEuro({carbonMonoxide:3.40, volatileOrganic:1.34, nitrousOxide:21.92, sulphurOxide:0.29, particulateMatter:0.80});
    euro1:Euro1 = new Euro1({carbonMonoxide:4.86, volatileOrganic:1.12, nitrousOxide:21.77, sulphurOxide:0.23, particulateMatter:0.98});
    euro2:Euro2 = new Euro2({carbonMonoxide:4.51, volatileOrganic:1.07, nitrousOxide:21.76, sulphurOxide:0.22, particulateMatter:0.95});
    euro3:Euro3 = new Euro3({carbonMonoxide:4.05, volatileOrganic:0.99, nitrousOxide:15.41, sulphurOxide:0.19, particulateMatter:0.56});
    euro4:Euro4 = new Euro4({carbonMonoxide:2.25, volatileOrganic:0.88, nitrousOxide:8.68, sulphurOxide:0.06, particulateMatter:0.52});
    euro5:Euro5 = new Euro5({carbonMonoxide:1.12, volatileOrganic:0.26, nitrousOxide:5.18, sulphurOxide:0.01, particulateMatter:0.02});
    euro6:Euro6 = new Euro6({carbonMonoxide:1.03, volatileOrganic:0.25, nitrousOxide:2.85, sulphurOxide:0.015, particulateMatter:0.02});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PreEuro {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro1 {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro2 {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro3 {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro4 {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro5 {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Euro6 {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Motorcycles {
    fourStroke:FourStroke = new FourStroke({carbonMonoxide:16.00, volatileOrganic:5.00, nitrousOxide:0.99, sulphurOxide:0.02, particulateMatter:0.21});
    twoStroke:TwoStroke = new TwoStroke({carbonMonoxide:27.50, volatileOrganic:14.40, nitrousOxide:0.16, sulphurOxide:0.01, particulateMatter:0.35});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class FourStroke {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class TwoStroke {
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

// Generators
export class Generators{
    carbonMonoxide?: number = 14;
    volatileOrganic?: number = 1.6;
    nitrousOxide?: number = 24;
    sulphurOxide?: number = 0.03;
    particulateMatter?: number = 0.8;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

// EV0FossilFuel
export class EV0FossilFuel{
    hybridElectric?:HybridElectric = new HybridElectric({carbonMonoxide:0.001, volatileOrganic:0.31, nitrousOxide:0.20, sulphurOxide:0.37, particulateMatter:0.24, carbonDioxide:0.41});
    plugInHybridElectric?:PlugInHybridElectric = new PlugInHybridElectric({carbonMonoxide:0.75, volatileOrganic:0.84, nitrousOxide:0.8, sulphurOxide:0.84, particulateMatter:0.65, carbonDioxide:0.90});
    batteryElectric?:BatteryElectric = new BatteryElectric({carbonMonoxide:1, volatileOrganic:1, nitrousOxide:1, sulphurOxide:1, particulateMatter:1, carbonDioxide:1});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

// EV20FossilFuel
export class EV20FossilFuel{
    hybridElectric?:HybridElectric = new HybridElectric({});
    plugInHybridElectric?:PlugInHybridElectric = new PlugInHybridElectric({});
    batteryElectric?:BatteryElectric = new BatteryElectric({});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

// EV40FossilFuel
export class EV40FossilFuel{
    hybridElectric?:HybridElectric = new HybridElectric({carbonMonoxide:0.001, volatileOrganic:0.31, nitrousOxide:0.20, sulphurOxide:0.37, particulateMatter:0.24, carbonDioxide:0.41});
    plugInHybridElectric?:PlugInHybridElectric = new PlugInHybridElectric({carbonMonoxide:0.75, volatileOrganic:0.82, nitrousOxide:0.61, sulphurOxide:-0.91, particulateMatter:0.43, carbonDioxide:0.51});
    batteryElectric?:BatteryElectric = new BatteryElectric({carbonMonoxide:0.99, volatileOrganic:0.99, nitrousOxide:0.61, sulphurOxide:-0.91, particulateMatter:0.43, carbonDioxide:0.69});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

// EV60FossilFuel
export class EV60FossilFuel{
    hybridElectric?:HybridElectric = new HybridElectric({carbonMonoxide:0.001, volatileOrganic:0.31, nitrousOxide:0.20, sulphurOxide:0.37, particulateMatter:0.24, carbonDioxide:0.41});
    plugInHybridElectric?:PlugInHybridElectric = new PlugInHybridElectric({carbonMonoxide:0.75, volatileOrganic:0.82, nitrousOxide:0.52, sulphurOxide:-1.65, particulateMatter:0.34, carbonDioxide:0.34});
    batteryElectric?:BatteryElectric = new BatteryElectric({carbonMonoxide:0.99, volatileOrganic:0.99, nitrousOxide:0.52, sulphurOxide:-1.65, particulateMatter:0.34, carbonDioxide:0.55});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
// EV80FossilFuel
export class EV80FossilFuel{
    hybridElectric?:HybridElectric = new HybridElectric({carbonMonoxide:0.001, volatileOrganic:0.31, nitrousOxide:0.20, sulphurOxide:0.37, particulateMatter:0.24, carbonDioxide:0.41});
    plugInHybridElectric?:PlugInHybridElectric = new PlugInHybridElectric({carbonMonoxide:0.75, volatileOrganic:0.82, nitrousOxide:0.43, sulphurOxide:-2.48, particulateMatter:0.24, carbonDioxide:0.15});
    batteryElectric?:BatteryElectric = new BatteryElectric({carbonMonoxide:0.99, volatileOrganic:0.99, nitrousOxide:0.43, sulphurOxide:-2.48, particulateMatter:0.24, carbonDioxide:0.20});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

// EV100FossilFuel
export class EV100FossilFuel{
    hybridElectric?:HybridElectric = new HybridElectric({carbonMonoxide:0.001, volatileOrganic:0.31, nitrousOxide:0.20, sulphurOxide:0.37, particulateMatter:0.24, carbonDioxide:0.41});
    plugInHybridElectric?:PlugInHybridElectric = new PlugInHybridElectric({carbonMonoxide:0.75, volatileOrganic:0.82, nitrousOxide:0.33, sulphurOxide:-3.32, particulateMatter:0.14, carbonDioxide:-0.03});
    batteryElectric?:BatteryElectric = new BatteryElectric({carbonMonoxide:0.99, volatileOrganic:0.99, nitrousOxide:0.33, sulphurOxide:-3.32, particulateMatter:0.14, carbonDioxide:0.1});

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
// HybridElectric
export class HybridElectric{
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;
    carbonDioxide?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

// PlugInHybridElectric
export class PlugInHybridElectric{
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;
    carbonDioxide?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

// BatteryElectric
export class BatteryElectric{
    carbonMonoxide?: number;
    volatileOrganic?: number;
    nitrousOxide?: number;
    sulphurOxide?: number;
    particulateMatter?: number;
    carbonDioxide?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}