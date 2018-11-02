import {GeneralInfo} from "./general_info";
import {
    BatteryElectric, ElectricMCycles,
    Euro1, Euro2, Euro3, Euro4, Euro5, Euro6, FourStroke, GeneratorAlternatives, HybridElectric, DieselGenerators,
    PlugInHybridElectric,
    PreEuro, SwitchElecMotor, SwitchToBEVs, SwitchToHevs, SwitchToNewTrucks, TwoStroke
} from "./fixed_classes";

export class FleetData {
    generalInfo?: GeneralInfo = new GeneralInfo();
    passengerCarsGasoline:PassengerCarsGasoline = new PassengerCarsGasoline();
    passengerCarsDiesel:PassengerCarsDiesel = new PassengerCarsDiesel();
    passengerCarsElectric:PassengerCarsElectric = new PassengerCarsElectric();
    passengerSUVsGasoline:PassengerSUVsGasoline =  new PassengerSUVsGasoline();
    passengerSUVsDiesel:PassengerSUVsDiesel =  new PassengerSUVsDiesel();
    passengerSUVsElectric:PassengerSUVsElectric =  new PassengerSUVsElectric();
    lDVsGasoline:LDVsGasoline = new LDVsGasoline();
    lDVsDiesel:LDVsDiesel = new LDVsDiesel();
    mDVsDiesel:MDVsDiesel = new MDVsDiesel();
    hDVsDiesel:HDVsDiesel = new HDVsDiesel();
    motorCycles:MotorCycles = new MotorCycles();
    generators:Generators = new Generators();
    actionsRecommended:ActionsRecommended = new ActionsRecommended();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

export class ActionsRecommended {
    switchToHevs?: SwitchToHevs = new SwitchToHevs();
    switchToBEVs?: SwitchToBEVs = new SwitchToBEVs();
    switchElecMotor?: SwitchElecMotor = new SwitchElecMotor();
    generatorAlternatives?:GeneratorAlternatives = new GeneratorAlternatives();
    switchToNewTrucks?:SwitchToNewTrucks = new SwitchToNewTrucks();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerCarsGasoline{
    preEuro:PreEuro = new PreEuro();
    euro1:Euro1 = new Euro1();
    euro2:Euro2 = new Euro2();
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerCarsDiesel{
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerCarsElectric{
    hybridElectric:HybridElectric = new HybridElectric();
    plugInHybridElectric:PlugInHybridElectric = new PlugInHybridElectric();
    batteryElectric:BatteryElectric = new BatteryElectric();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerSUVsGasoline{
    preEuro:PreEuro = new PreEuro();
    euro1:Euro1 = new Euro1();
    euro2:Euro2 = new Euro2();
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerSUVsDiesel{
    preEuro:PreEuro = new PreEuro();
    euro1:Euro1 = new Euro1();
    euro2:Euro2 = new Euro2();
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PassengerSUVsElectric{
    hybridElectric:HybridElectric = new HybridElectric();
    plugInHybridElectric:PlugInHybridElectric = new PlugInHybridElectric();
    batteryElectric:BatteryElectric = new BatteryElectric();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class LDVsGasoline{
    preEuro:PreEuro = new PreEuro();
    euro1:Euro1 = new Euro1();
    euro2:Euro2 = new Euro2();
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class LDVsDiesel{
    preEuro:PreEuro = new PreEuro();
    euro1:Euro1 = new Euro1();
    euro2:Euro2 = new Euro2();
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class MDVsDiesel{
    preEuro:PreEuro = new PreEuro();
    euro1:Euro1 = new Euro1();
    euro2:Euro2 = new Euro2();
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class HDVsDiesel{
    preEuro:PreEuro = new PreEuro();
    euro1:Euro1 = new Euro1();
    euro2:Euro2 = new Euro2();
    euro3:Euro3 = new Euro3();
    euro4:Euro4 = new Euro4();
    euro5:Euro5 = new Euro5();
    euro6:Euro6 = new Euro6();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class MotorCycles {
    fourStroke?: FourStroke = new FourStroke();
    twoStroke?: TwoStroke = new TwoStroke();
    electric?: ElectricMCycles = new ElectricMCycles();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Generators {
    diesel?: DieselGenerators = new DieselGenerators();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

