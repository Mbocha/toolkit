import {
    AfterViewInit, ChangeDetectionStrategy, Component, Input, NgZone, OnChanges, OnInit, SimpleChange, ViewContainerRef,
    ViewEncapsulation
} from "@angular/core";
import { User } from "../../../../models/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { FleetData } from "../../../../models/fleet_data";
import {GeneralInfo} from "../../../../models/general_info";
import {FleetDataService} from "../../../../_services/fleet.data.service";
import {EmissionFactors} from "../../../../models/emission_factors";
import {ToastsManager} from "ng2-toastr";
import {Http,Response, Headers, RequestOptions } from '@angular/http';
//import { AuthenticationService } from '../_services/authentication.service';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { UserService } from '../../../../auth/_services/user.service';

@Component({
    moduleId: module.id,
    selector: "app-index",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IndexComponent implements OnInit,AfterViewInit {

    @Input() fleetData: FleetData = new FleetData();
    @Input() generalInfo: GeneralInfo = new GeneralInfo();
    @Input() emissionFactors = new EmissionFactors();
    @Input() generalInfoForm: FormGroup;
    @Input() switchToInfoForm: FormGroup;
    myStorage = window.localStorage;
    mySession = window.sessionStorage;
    currentEmail: string = "member@fleetforum.org"; //Darkhorse@gmail.com
    currentUsername:string = "demo@demo.com";
    currentUserFleets:string = "demo@demo.com_fleets";
    myFleets: any;
    fossilFuelElecOptions:any[] = [0,40,60,80,100];

    user = {
        fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
        organ: "",
        expert: "",

        phoneNum: "",
        email:   "", // this is the email input value
        imgurl: "",
        role: ""
    } as User;


    logEmail:string;
    logPassword:string;
    autosave:string;

    @Input() isFleetClicked: any = {isSetFleet:false};

    // saving the current active tabs stated
    @Input() currentActiveTabs: any = {parentTab:null,childTab:null};
    currentActiveTabsStringConst:string = "current-active-tabs";
    @Input() flag: string="Just checking...";

    // Darkhorse customized
    // url = 'https://backend.cleanfleet.fleetforum.org/fleetout';
    // jsurl='https://backend.cleanfleet.fleetforum.org/fleetin';
    // bevurl = 'https://backend.cleanfleet.fleetforum.org/bev';
    // hevurl = 'https://backend.cleanfleet.fleetforum.org/hev';
    // ElecMotorurl = 'https://backend.cleanfleet.fleetforum.org/ElecMotor';
    // ElecTruckurl = 'https://backend.cleanfleet.fleetforum.org/ElecTruck';
    // Electricityurl = 'https://backend.cleanfleet.fleetforum.org/Elec';
    // fleeturl = 'https://backend.cleanfleet.fleetforum.org/fleetRequest';


    url = 'http://localhost/fleetout';
    jsurl='http://localhost/fleetin';
    bevurl = 'http://localhost/bev';
    hevurl = 'http://localhost/hev';
    ElecMotorurl = 'http://localhost/ElecMotor';
    ElecTruckurl = 'http://localhost/ElecTruck';
    Electricityurl = 'http://localhost/Elec';
    fleeturl = 'http://localhost/fleetRequest';
    // customize end
   
    constructor(
        private http: Http,
        private _authService: AuthenticationService,
        private _userService: UserService,
        private router?: Router,
        private zone?: NgZone,
        private formBuilder?: FormBuilder,
        private fleetDataService?:FleetDataService,
        private toastr?: ToastsManager,
        vcr?: ViewContainerRef
        
    ){


        var userinfo = JSON.parse(this.myStorage.getItem("currentUser"));
        // console.log("user info profile");
        // console.log(userinfo);
        //this.user.fullName = userinfo["fullName"];

        console.log(userinfo);

        if(userinfo != null){
            this.user.fullName = userinfo.fullName;
            //this.user.email = userinfo["email"];
            this.user.email = userinfo.email;
            //this.user.organ = userinfo['organ'];
            this.user.organ = userinfo.organ;
            this.user.role = "user";
            // console.log(this.user);
            this.currentEmail = this.user.email;
            this.autosave = (window.localStorage.getItem("autosave") !==null) ? "enable":"disable";
            if(this.autosave == "enable"){
                var savebtnelement = document.getElementById("savefleetBtn");
            }

        }
        else{
            this.user.fullName = "Guest";
            this.user.email = "Guest@gmail.com";
            this.user.organ = "Default";
            this.currentEmail = this.user.email;
            this.user.role = "guest";
            //Save button Customize
            console.log("check button");

            //todo http request get userinfo

        }

        this.generalInfoForm = this.formBuilder.group({
            generalInfo : this.formBuilder.group({
                fleetName: new FormControl('', [Validators.required, Validators.minLength(3)]),
                sulphurLevel: new FormControl('', [Validators.required]),
                petrolPrice: new FormControl('', [Validators.required]),
                dieselPrice: new FormControl('', [Validators.required]),
                elecPrice: new FormControl('', [Validators.required]),
                fossilFuelElec: new FormControl('', [Validators.required]),
                localCurrency: new FormControl('', [Validators.required])
            }),
            passengerCarsGasoline : this.formBuilder.group({
                preEuro: this.initPassengerGasOnlineForm(),
                euro1: this.initPassengerGasOnlineForm(),
                euro2: this.initPassengerGasOnlineForm(),
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            passengerCarsDiesel : this.formBuilder.group({
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            passengerCarsElectric : this.formBuilder.group({
                hybridElectric: this.initPassengerGasOnlineForm(),
                plugInHybridElectric: this.initPassengerGasOnlineForm(),
                batteryElectric: this.initPassengerGasOnlineForm(),
            }),
            passengerSUVsGasoline : this.formBuilder.group({
                preEuro: this.initPassengerGasOnlineForm(),
                euro1: this.initPassengerGasOnlineForm(),
                euro2: this.initPassengerGasOnlineForm(),
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            passengerSUVsDiesel : this.formBuilder.group({
                preEuro: this.initPassengerGasOnlineForm(),
                euro1: this.initPassengerGasOnlineForm(),
                euro2: this.initPassengerGasOnlineForm(),
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            passengerSUVsElectric : this.formBuilder.group({
                hybridElectric: this.initPassengerGasOnlineForm(),
                plugInHybridElectric: this.initPassengerGasOnlineForm(),
                batteryElectric: this.initPassengerGasOnlineForm(),
            }),
            lDVsGasoline : this.formBuilder.group({
                preEuro: this.initPassengerGasOnlineForm(),
                euro1: this.initPassengerGasOnlineForm(),
                euro2: this.initPassengerGasOnlineForm(),
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            lDVsDiesel : this.formBuilder.group({
                preEuro: this.initPassengerGasOnlineForm(),
                euro1: this.initPassengerGasOnlineForm(),
                euro2: this.initPassengerGasOnlineForm(),
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            mDVsDiesel : this.formBuilder.group({
                preEuro: this.initPassengerGasOnlineForm(),
                euro1: this.initPassengerGasOnlineForm(),
                euro2: this.initPassengerGasOnlineForm(),
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            hDVsDiesel : this.formBuilder.group({
                preEuro: this.initPassengerGasOnlineForm(),
                euro1: this.initPassengerGasOnlineForm(),
                euro2: this.initPassengerGasOnlineForm(),
                euro3: this.initPassengerGasOnlineForm(),
                euro4: this.initPassengerGasOnlineForm(),
                euro5: this.initPassengerGasOnlineForm(),
                euro6: this.initPassengerGasOnlineForm()
            }),
            motorCycles : this.formBuilder.group({
                fourStroke: this.initPassengerGasOnlineForm(),
                twoStroke: this.initPassengerGasOnlineForm(),
                electric: this.initPassengerGasOnlineForm(),
            }),
            // changed
            generators : this.formBuilder.group({
                diesel: this.initPassengerGasOnlineForm()
            }),
            actionsRecommended : this.formBuilder.group({
                switchToHevs: this.initRecommendedActionsHevBevsForm(true),
                switchToBEVs:this.initRecommendedActionsHevBevsForm(false),
                switchElecMotor:this.initRecommendedActionsElecMotorCyclesForm(),
                generatorAlternatives:this.initAlternativesToGeneratorsForm(),
                switchToNewTrucks:this.initSwitchToNewTrucksForm()
            })
        });

        this.getjson();


        this.fleetData.actionsRecommended = {
            switchToHevs:{
                hEVFuelEconomy:null,
                hEVAdditionalCostPerVehicle:null
            },
            switchToBEVs:{
                bevCarsKmsPerKWh:null,
                bevCarsAdditionalCostPerVehicle:null
            },
            switchElecMotor:{
                elecBikesKmsPerKWh:null,
                elecBikesAdditionalCostPerbike:null
            },
            generatorAlternatives:{
                electricityDemand:null,
                pvItemsCost:null
            },
            switchToNewTrucks:{
                bevTrucksKmPerKWh:6.4
            }
        };

        // getting the state of active tabs
        const myTabsSessionItem = this.mySession.getItem(this.currentActiveTabsStringConst);
        if(myTabsSessionItem != null){
            this.currentActiveTabs = JSON.parse(myTabsSessionItem);
        }


        // check if there is data stored in the session
        const mySessionItem = this.mySession.getItem(this.currentEmail);
        if(mySessionItem != null){
            this.fleetData = JSON.parse(mySessionItem);
            this.refreshGraphs();
        }

        this.fleetDataService.getIfSetFleetClicked().subscribe(result => {
            this.isFleetClicked = result;
        });

        //get all the logged in users saved fleets
        this.myFleets = (this.myStorage.getItem(this.currentUserFleets)!==null) ? JSON.parse(this.myStorage.getItem(this.currentUserFleets)) : [  ];
       //show messages via toastr
        this.toastr.setRootViewContainerRef(vcr);
    }

    public barChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true,
        tooltips: {
            mode: 'point'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };


    onSamlLogin() {
        this._authService.samlLogin().subscribe(
            data => {
                window.location.href = data;
            },
            err => {
            }
        )
    }



    public barChartColors: any [] =[
        {
            backgroundColor: '#4E7CA5',
            borderWidth: 0
        },
        {
            backgroundColor: '#B9C08B',
            borderWidth: 0
        },
        {
            backgroundColor: '#5cb85c',
            borderWidth: 0
        },
        {
            backgroundColor: '#00ADEF',
            borderWidth: 0
        }
    ];


    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;

    // switchToHevBarChartData// switchToHevBarChartData// switchToBevBarChartData
    public switchToHeVBarChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true,
        tooltips: {
            mode: 'point'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    public switchToHeVPetrolDieselBarChartLabels:string[] = ['Petrol (L/yr)','Diesel (L/yr)'];
    public switchToHeVPetrolDieselBarChartData:any[] = [
        {data: [0,0], label: 'Current'},
        {data: [0,0], label: 'HEVs'},
        {data: [0,0], label: 'Savings'}
    ];

    //Fuel Cost Chart
    public switchToHeVFuelCostBarChartLabels:string[] = ['Fuel Cost'];
    public switchToHeVFuelCostBarChartData:any[] = [
        {data: [0], label: 'Current'},
        {data: [0], label: 'HEVs'},
        {data: [0], label: 'Savings'}
    ];
    
    // CO2 Emissions
    public switchToHeVCO2EmissionsBarChartLabels:string[] = ['CO2 Emissions (Kg/Yr)'];
    public switchToHeVCO2EmissionsBarChartData:any[] = [
        {data: [0], label: 'Current'},
        {data: [0], label: 'HEVs'},
        {data: [0], label: 'Savings'}
    ];

    public switchToBevBarChartData:any[] = [
        {data: [0,0,0,0], label: 'Current'},
        {data: [0,0,0,0], label: 'HEVs'},
        {data: [0,0,0,0], label: 'Savings'}
    ];

    // switchToBevBarChartData// switchToBevBarChartData// switchToBevBarChartData
    public switchToBeVBarChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true,
        tooltips: {
            mode: 'point'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    public switchToBeVPetrolDieselBarChartData:any[] = [
        {data: [0,0], label: 'Current'},
        {data: [0,0], label: 'BEVs'},
        {data: [0,0], label: 'Savings'}
    ];
    public switchToBeVPetrolDieselBarChartLabels:string[] = ['Petrol (L/yr)','Diesel (L/yr)'];
    //Fuel Cost Chart
    public switchToBeVFuelCostBarChartLabels:string[] = ['Fuel Cost'];
    public switchToBeVFuelCostBarChartData:any[] = [
        {data: [0], label: 'Current'},
        {data: [0], label: 'BEVs'},
        {data: [0], label: 'Savings'}
    ];
    // CO2 Emissions
    public switchToBeVCO2EmissionsBarChartLabels:string[] = ['CO2 Emissions (Kg/Yr)'];
    public switchToBeVCO2EmissionsBarChartData:any[] = [
        {data: [0,0], label: 'Current'},
        {data: [0,0], label: 'BEVs'},
        {data: [0,0], label: 'Savings'}
    ];

    // switchToFourStroke charts// switchToFourStroke charts// switchToFourStroke charts

    // vocs Emitted
    public switchTo4StrokeVOCsBarChartLabels:string[] = ['Total VOC Emissions (Kg/Yr)'];
    public switchTo4StrokeVOCsBarChartData:any[] = [
        {data: [0], label: '2-stroke'},
        {data: [0], label: '4-stroke'},
        {data: [0], label: 'Savings'}
    ];
    // PMs Emitted
    public switchTo4StrokePMsBarChartLabels:string[] = ['Total PM Emissions (Kg/Yr)'];
    public switchTo4StrokePMsBarChartData:any[] = [
        {data: [0], label: '2-stroke'},
        {data: [0], label: '4-stroke'},
        {data: [0], label: 'Savings'}
    ];
    // 4stroke fuel costs low and high scenario
    public switchTo4StrokeFuelCosts4StrokeLowHighBarChartLabels:string[] = ['Fuel Costs'];
    public switchTo4StrokeFuelCosts4StrokeLowHighBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];
    // Fuel Savings low and high scenario
    public switchTo4StrokeFuelSavingsLowHighBarChartLabels:string[] = ['Fuel Savings'];
    public switchTo4StrokeFuelSavingsLowHighBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];

    //Fuel Costs
    public switchTo4StrokeFuelCostsBarChartLabels:string[] = ['Fuel Costs'];
    public switchTo4StrokeFuelCostsBarChartData:any[] = [
        {data: [0], label: '2-stroke'},
        {data: [0], label: '4-stroke'},
        {data: [0], label: 'Savings'}
    ];


    public switchTo4StrokeBarChartLabels:string[] = ['VOCs (Kg/yr)','Particulate Matter (Kg/yr)'];

    public switchTo4StrokeBarChartData:any[] = [
        {data: [0,0], label: '2-stroke'},
        {data: [0,0], label: '4-stroke'}
    ];
    // Doughnut
    public doughnutChartType:string = 'doughnut';
    public pieChartType:string = 'pie';

    // switchToFourStroke charts// switchToFourStroke charts// switchToFourStroke charts

    /*
        Switch to New Trucks Charts
     */

    //CO2 Emissions
    public switchToNewTrucksPreEuroLMDVCO2EmissionsBarChartLabels:string[] = ['CO2 Emissions (Kg/Yr)'];
    public switchToNewTrucksPreEuroLMDVCO2EmissionsBarChartData:any[] = [
        {data: [0], label: 'Pre-Euro III'},
        {data: [0], label: 'HEVs'},
        {data: [0], label: 'BEV trucks'},
        {data: [0], label: 'Euro V & buses'}
    ];

    public switchToNewTrucksPreEuroHDVCO2EmissionsBarChartLabels:string[] = ['CO2 Emissions (Kg/Yr)'];
    public switchToNewTrucksPreEuroHDVCO2EmissionsBarChartData:any[] = [
        {data: [0], label: 'Pre-Euro III'},
        {data: [0], label: 'HEVs'},
        {data: [0], label: 'CNG trucks'},
        {data: [0], label: 'Euro V & buses'}
    ];
    //Petrol Fuel Consumption
    public switchToNewTrucksPreEuroLMDVPetrolBarChartLabels:string[] = ['Petrol (L/Yr)'];
    public switchToNewTrucksPreEuroLMDVPetrolBarChartData:any[] = [
        {data: [0], label: 'Pre-Euro III'},
        {data: [0], label: 'HEVs'},
        {data: [0], label: 'BEV trucks'},
        {data: [0], label: 'Euro V & buses'}
    ];
    //Diesel Fuel Consumption
    public switchToNewTrucksPreEuroHDVDieselBarChartLabels:string[] = ['Diesel (L/Yr)'];
    public switchToNewTrucksPreEuroHDVDieselBarChartData:any[] = [
        {data: [0], label: 'Pre-Euro III'},
        {data: [0], label: 'HEVs'},
        {data: [0], label: 'CNG trucks'},
        {data: [0], label: 'Euro V & buses'}
    ];

    /*
        Switch to Electric Motorcycles charts
     */

    //Petrol Consumption
    public switchToElectricMotorCyclesPetrolBarChartData:any[] = [
        {data: [0], label: 'Current'},
        {data: [0], label: 'Electric'},
        {data: [0], label: 'Savings'}
    ];
    public switchToElectricMotorCyclesPetrolBarChartLabels:string[] = ['Petrol Consumption (L/Yr)'];

    //Fuel Cost
    public switchToElectricMotorCyclesFuelCostBarChartData:any[] = [
        {data: [0], label: 'Current'},
        {data: [0], label: 'Electric'},
        {data: [0], label: 'Savings'}
    ];
    public switchToElectricMotorCyclesFuelCostBarChartLabels:string[] = ['Fuel Cost'];

    //CO2 Emissions
    public switchToElectricMotorCyclesCO2BarChartData:any[] = [
        {data: [0], label: 'Current'},
        {data: [0], label: 'Electric'},
        {data: [0], label: 'Savings'}
    ];
    public switchToElectricMotorCyclesCO2BarChartLabels:string[] = ['CO2 Emissions (Kg/Yr)'];

    public switchToElectricMotorCyclesBarChartData:any[] = [
        {data: [0,0], label: 'Current'},
        {data: [0,0], label: 'Electric'}
    ];
    public switchToElectricMotorCyclesBarChartLabels:string[] = ['Petrol consumption (L/Yr)','Fuel Cost'];


    /*
        Retrofiting Trucks charts
     */

    public retroFittingTrucksDOCBarChartData:any[] = [
        {data: [0,0], label: 'Low'},
        {data: [0,0], label: 'High'}
    ];
    public retroFittingTrucksDOCBarChartLabels:string[] = ['DOC Emissions (kg PM/yr)','DOC Savings (kg PM/yr)'];

    public retroFittingTrucksDPFBarChartData:any[] = [
        {data: [0,0], label: 'Low'},
        {data: [0,0], label: 'High'}
    ];
    public retroFittingTrucksDPFBarChartLabels:string[] = ['DPF Emissions (kg PM/yr)','DPF Savings (kg PM/yr)'];

    // Doughnut Savings
    public retroFittingTrucksDPFSavingsDoughnutChartLabels:string[] = ['DPF Low Savings (kg PM/yr)','DPF High Savings (kg PM/yr)'];
    public retroFittingTrucksDPFSavingsDoughnutChartData:number[] = [0, 0];
    public retroFittingTrucksDOCSavingsDoughnutChartLabels:string[] = ['DOC Low Savings (kg PM/yr)','DOC High Savings (kg PM/yr)'];
    public retroFittingTrucksDOCSavingsDoughnutChartData:number[] = [0, 0];


    /*
        Eco-driving, Improved Maintenance &amp; Trip Sharing
        Eco Driving Charts
     */
    public ecoDrivingCanSaveBarChartLabels:string[] = ['Fuel (Petrol + Diesel)'];
    public ecoDrivingCanSaveBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];

    public ecoDrivingYouSaveBarChartLabels:string[] = ['Fuel Budget'];
    public ecoDrivingYouSaveBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];

    public ecoDrivingC02ReductionsBarChartLabels:string[] = ['C02 Emissions'];
    public ecoDrivingC02ReductionsBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];


    /*
        Eco-driving, Improved Maintenance &amp; Trip Sharing
        Improved Maintenance Charts
     */
    // get the currency
    public improvedMaintenanceCanSaveBarChartLabels:string[] = ['Fuel (Petrol + Diesel)'];
    public improvedMaintenanceCanSaveBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];
    public improvedMaintenanceYouSaveBarChartLabels:string[] = ['Fuel Budget'];
    public improvedMaintenanceYouSaveBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];
    public improvedMaintenanceC02ReductionsBarChartLabels:string[] = ['C02 Emissions'];
    public improvedMaintenanceC02ReductionsBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];

    /*
        Eco-driving, Improved Maintenance &amp; Trip Sharing
        Air Conditioning Charts
     */
    public airConditioningCanSaveBarChartLabels:string[] = ['Fuel (Petrol + Diesel)'];
    public airConditioningCanSaveBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];
    public airConditioningYouSaveBarChartLabels:string[] = ['Fuel Budget'];
    public airConditioningYouSaveBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];
    public airConditioningC02ReductionsBarChartLabels:string[] = ['C02 Emissions'];
    public airConditioningC02ReductionsBarChartData:any[] = [
        {data: [0], label: 'Low Scenario'},
        {data: [0], label: 'High Scenario'}
    ];

    /*
        Switch To Cleaner Fuels Charts
     */
    public switchToCleanerFuelsSOxEmissionsBarChartLabels:string[] = ['SOx Emissions'];
    public switchToCleanerFuelsSOxEmissionsBarChartData:any[] = [
        {data: [0], label: '500ppm'},
        {data: [0], label: '50pm'}
    ];
    public switchToCleanerFuelsSOxSavingsBarChartLabels:string[] = ['SOx Reductions'];
    public switchToCleanerFuelsSOxSavingsBarChartData:any[] = [
        {data: [0], label: '500ppm'},
        {data: [0], label: '50pm'}
    ];
    public switchToCleanerFuelsBarChartLabels:string[] = ['SOx Emissions', 'SOx Reductions'];
    public switchToCleanerFuelsBarChartData:any[] = [
        {data: [0, 0], label: '500ppm'},
        {data: [0, 0], label: '50pm'}
    ];
    public switchToCleanerFuelsBarChartLabels1:string[] = ['Current', '500ppm','50pm'];
    public switchToCleanerFuelsBarChartData1:any[] = [
        {data: [0, 0, 0], label: 'Current'},
        {data: [0, 0, 0], label: '500ppm'},
        {data: [0, 0, 0], label: '50pm'}
    ];
    public switchToCleanerFuelsSOxEmissionsBarChartLabels1:string[] = ['SOx Emissions'];
    public switchToCleanerFuelsSOxEmissionsBarChartData1:any[] = [
        {data: [0], label: 'Current'},
        {data: [0], label: '500ppm'},
        {data: [0], label: '50pm'}
    ];

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }

    initPassengerGasOnlineForm() {
        return this.formBuilder.group({
            numVehicles: new FormControl('', [Validators.required]),
            annualMileage: new FormControl('', [Validators.required]),
            annualFuel: new FormControl('', [Validators.required])
        });
    }

    initRecommendedActionsHevBevsForm(isHev:boolean) {
        if(isHev){
            return this.formBuilder.group({
                hEVFuelEconomy: new FormControl('', [Validators.required]),
                hEVAdditionalCostPerVehicle: new FormControl('', [Validators.required])
            });
        }else{
            return this.formBuilder.group({
                bevCarsKmsPerKWh: new FormControl('', [Validators.required]),
                bevCarsAdditionalCostPerVehicle: new FormControl('', [Validators.required])
            });
        }
    }

    initRecommendedActionsElecMotorCyclesForm() {
        return this.formBuilder.group({
            elecBikesKmsPerKWh: new FormControl('', [Validators.required]),
            elecBikesAdditionalCostPerbike: new FormControl('', [Validators.required])
        });
    }

    initAlternativesToGeneratorsForm() {
        return this.formBuilder.group({
            electricityDemand: new FormControl('', [Validators.required]),
            pvItemsCost: new FormControl('', [Validators.required])
        });
    }

    initSwitchToNewTrucksForm() {
        return this.formBuilder.group({
            bevTrucksKmPerKWh: new FormControl('', [Validators.required])
        });
    }

    // save the session data
    saveSessionFleetData(model:any,saveToLocalStorage:boolean):any {
        //save the session using current usernames as the key
        // you can save the form values or the model(this.fleetData)
        this.mySession.setItem(this.currentUsername, JSON.stringify(model));
        // save this to local storage

        if(saveToLocalStorage){
            // is the form valid or not
            if(this.generalInfoForm['controls'].generalInfo['controls'].fleetName.invalid){
                this.toastr.error('Please enter a fleet name in the General Information section',
                    'Error Saving Data',
                    {
                        toastLife: 5000,
                        newestOnTop:true
                    });
                return;
            }else{
                // save the list of fleets by fleet name
                // you can retrieve again if you want

                // check if exists in array
                if(!this.myFleets.includes(model.generalInfo.fleetName)){
                    this.myFleets.push(model.generalInfo.fleetName);
                }
                this.myStorage.setItem(this.currentUserFleets, JSON.stringify(this.myFleets));
                // save the fleets data with fleet name as key
                this.myStorage.setItem(model.generalInfo.fleetName, JSON.stringify(model));
                //show data saved successfully to user
                this.toastr.success('Fleet data Saved Successfully!',
                    "Success!!!",
                    {
                        toastLife: 2000,
                        newestOnTop: true
                    });
            }
        }
    }

    ngOnInit() {

        // set the deault values for these data
        this.fleetData.actionsRecommended.generatorAlternatives.electricityDemand =
            this.fleetData.actionsRecommended.generatorAlternatives.electricityDemand ? this.fleetData.actionsRecommended.generatorAlternatives.electricityDemand : 10;
        this.fleetData.actionsRecommended.generatorAlternatives.pvItemsCost =
            this.fleetData.actionsRecommended.generatorAlternatives.pvItemsCost ? this.fleetData.actionsRecommended.generatorAlternatives.pvItemsCost : 3260;
        this.refreshGraphs();
    }

    getPassengerCarsGasolineTotals() : any {
        let numVehicles = Number(this.fleetData.passengerCarsGasoline.preEuro.numVehicles|| 0) + Number(this.fleetData.passengerCarsGasoline.euro1.numVehicles|| 0) + Number(this.fleetData.passengerCarsGasoline.euro2.numVehicles|| 0)
            + Number(this.fleetData.passengerCarsGasoline.euro3.numVehicles|| 0) + Number(this.fleetData.passengerCarsGasoline.euro4.numVehicles|| 0) + Number(this.fleetData.passengerCarsGasoline.euro5.numVehicles|| 0) + Number(this.fleetData.passengerCarsGasoline.euro6.numVehicles|| 0);

        let annualMileage = Number(this.fleetData.passengerCarsGasoline.preEuro.annualMileage|| 0) + Number(this.fleetData.passengerCarsGasoline.euro1.annualMileage|| 0) + Number(this.fleetData.passengerCarsGasoline.euro2.annualMileage|| 0)
            + Number(this.fleetData.passengerCarsGasoline.euro3.annualMileage|| 0) + Number(this.fleetData.passengerCarsGasoline.euro4.annualMileage|| 0) + Number(this.fleetData.passengerCarsGasoline.euro5.annualMileage|| 0) + Number(this.fleetData.passengerCarsGasoline.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.passengerCarsGasoline.preEuro.annualFuel|| 0) + Number(this.fleetData.passengerCarsGasoline.euro1.annualFuel|| 0) + Number(this.fleetData.passengerCarsGasoline.euro2.annualFuel|| 0)
            + Number(this.fleetData.passengerCarsGasoline.euro3.annualFuel|| 0) + Number(this.fleetData.passengerCarsGasoline.euro4.annualFuel|| 0) + Number(this.fleetData.passengerCarsGasoline.euro5.annualFuel|| 0) + Number(this.fleetData.passengerCarsGasoline.euro6.annualFuel|| 0);

        let passengerCarsGasolineEmissions = this.passengerCarsGasolineEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,passengerCarsGasolineEmissions:passengerCarsGasolineEmissions};
    }

    passengerCarsGasolineEmissions():any {
        let preEuroEmissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsGasoline.preEuro,this.fleetData.passengerCarsGasoline.preEuro,this.emissionFactors.petrolCO2perLtr);
        let euro1Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsGasoline.euro1,this.fleetData.passengerCarsGasoline.euro1,this.emissionFactors.petrolCO2perLtr);
        let euro2Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsGasoline.euro2,this.fleetData.passengerCarsGasoline.euro2,this.emissionFactors.petrolCO2perLtr);
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsGasoline.euro3,this.fleetData.passengerCarsGasoline.euro3,this.emissionFactors.petrolCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsGasoline.euro4,this.fleetData.passengerCarsGasoline.euro4,this.emissionFactors.petrolCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsGasoline.euro5,this.fleetData.passengerCarsGasoline.euro5,this.emissionFactors.petrolCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsGasoline.euro6,this.fleetData.passengerCarsGasoline.euro6,this.emissionFactors.petrolCO2perLtr);
        let sumEmissions = this.sumEmissions(preEuroEmissions,euro1Emissions,euro2Emissions,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {preEuroEmissions:preEuroEmissions,euro1Emissions:euro1Emissions,euro2Emissions:euro2Emissions,euro3Emissions:euro3Emissions,
            euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getPassengerCarsDieselTotals() : any {
        let numVehicles = (Number(this.fleetData.passengerCarsDiesel.euro3.numVehicles|| 0) + Number(this.fleetData.passengerCarsDiesel.euro4.numVehicles|| 0) + Number(this.fleetData.passengerCarsDiesel.euro5.numVehicles|| 0) + Number(this.fleetData.passengerCarsDiesel.euro6.numVehicles|| 0));

        let annualMileage = Number(this.fleetData.passengerCarsDiesel.euro3.annualMileage|| 0) + Number(this.fleetData.passengerCarsDiesel.euro4.annualMileage|| 0) + Number(this.fleetData.passengerCarsDiesel.euro5.annualMileage|| 0) + Number(this.fleetData.passengerCarsDiesel.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.passengerCarsDiesel.euro3.annualFuel|| 0) + Number(this.fleetData.passengerCarsDiesel.euro4.annualFuel|| 0) + Number(this.fleetData.passengerCarsDiesel.euro5.annualFuel|| 0) + Number(this.fleetData.passengerCarsDiesel.euro6.annualFuel|| 0);

        let passengerCarsDieselEmissions = this.passengerCarsDieselEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,passengerCarsDieselEmissions:passengerCarsDieselEmissions};
    }

    passengerCarsDieselEmissions():any {
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsDiesel.euro3,this.fleetData.passengerCarsDiesel.euro3,this.emissionFactors.dieselCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsDiesel.euro4,this.fleetData.passengerCarsDiesel.euro4,this.emissionFactors.dieselCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsDiesel.euro5,this.fleetData.passengerCarsDiesel.euro5,this.emissionFactors.dieselCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerCarsDiesel.euro6,this.fleetData.passengerCarsDiesel.euro6,this.emissionFactors.dieselCO2perLtr);
        let sumEmissions = this.sumEmissions(0,0,0,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {euro3Emissions:euro3Emissions,euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getPassengerCarsElectricTotals() : any {
        let numVehicles = Number(this.fleetData.passengerCarsElectric.hybridElectric.numVehicles|| 0) + Number(this.fleetData.passengerCarsElectric.plugInHybridElectric.numVehicles|| 0) + Number(this.fleetData.passengerCarsElectric.batteryElectric.numVehicles|| 0);
        let annualMileage = Number(this.fleetData.passengerCarsElectric.hybridElectric.annualMileage|| 0) + Number(this.fleetData.passengerCarsElectric.plugInHybridElectric.annualMileage|| 0) + Number(this.fleetData.passengerCarsElectric.batteryElectric.annualMileage|| 0);
        let annualFuel = Number(this.fleetData.passengerCarsElectric.hybridElectric.annualFuel|| 0) + Number(this.fleetData.passengerCarsElectric.plugInHybridElectric.annualFuel|| 0) + Number(this.fleetData.passengerCarsElectric.batteryElectric.annualFuel|| 0);
        let passengerCarsElectric = this.passengerCarsElectric();
        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,passengerCarsElectric:passengerCarsElectric};
    }

    passengerCarsElectric() {
        let emFactor = this.getElectricEmissionFactor(this.fleetData.generalInfo.fossilFuelElec).emFactor;
        let hybridElectricEmissions = this.getEmissions(true,true,true,emFactor.hybridElectric,this.fleetData.passengerCarsElectric.hybridElectric,emFactor.hybridElectric.carbonDioxide);
        let plugInHybridElectricEmissions = this.getEmissions(true,true,true,emFactor.plugInHybridElectric,this.fleetData.passengerCarsElectric.plugInHybridElectric,emFactor.plugInHybridElectric.carbonDioxide);
        let batteryElectricEmissions = this.getEmissions(true,true,false,emFactor.batteryElectric,this.fleetData.passengerCarsElectric.batteryElectric,emFactor.batteryElectric.carbonDioxide);
        let sumEmissions = this.sumEmissions(0,0,0,0,hybridElectricEmissions,plugInHybridElectricEmissions,batteryElectricEmissions);
        return {hybridElectricEmissions:hybridElectricEmissions,plugInHybridElectricEmissions:plugInHybridElectricEmissions,batteryElectricEmissions:batteryElectricEmissions,sumEmissions:sumEmissions};
    }


    getPassengerSUVsGasolineTotals() : any {
        let numVehicles = Number(this.fleetData.passengerSUVsGasoline.preEuro.numVehicles|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro1.numVehicles|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro2.numVehicles|| 0)
            + Number(this.fleetData.passengerSUVsGasoline.euro3.numVehicles|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro4.numVehicles|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro5.numVehicles|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro6.numVehicles|| 0);

        let annualMileage = Number(this.fleetData.passengerSUVsGasoline.preEuro.annualMileage|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro1.annualMileage|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro2.annualMileage|| 0)
            + Number(this.fleetData.passengerSUVsGasoline.euro3.annualMileage|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro4.annualMileage|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro5.annualMileage|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.passengerSUVsGasoline.preEuro.annualFuel|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro1.annualFuel|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro2.annualFuel|| 0)
            + Number(this.fleetData.passengerSUVsGasoline.euro3.annualFuel|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro4.annualFuel|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro5.annualFuel|| 0) + Number(this.fleetData.passengerSUVsGasoline.euro6.annualFuel|| 0);

        let passengerSUVsGasolineEmissions = this.passengerSUVsGasolineEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,passengerSUVsGasolineEmissions:passengerSUVsGasolineEmissions};
    }

    passengerSUVsGasolineEmissions():any {
        let preEuroEmissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsGasoline.preEuro,this.fleetData.passengerSUVsGasoline.preEuro,this.emissionFactors.petrolCO2perLtr);
        let euro1Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsGasoline.euro1,this.fleetData.passengerSUVsGasoline.euro1,this.emissionFactors.petrolCO2perLtr);
        let euro2Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsGasoline.euro2,this.fleetData.passengerSUVsGasoline.euro2,this.emissionFactors.petrolCO2perLtr);
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsGasoline.euro3,this.fleetData.passengerSUVsGasoline.euro3,this.emissionFactors.petrolCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsGasoline.euro4,this.fleetData.passengerSUVsGasoline.euro4,this.emissionFactors.petrolCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsGasoline.euro5,this.fleetData.passengerSUVsGasoline.euro5,this.emissionFactors.petrolCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsGasoline.euro6,this.fleetData.passengerSUVsGasoline.euro6,this.emissionFactors.petrolCO2perLtr);
        let sumEmissions = this.sumEmissions(preEuroEmissions,euro1Emissions,euro2Emissions,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {preEuroEmissions:preEuroEmissions,euro1Emissions:euro1Emissions,euro2Emissions:euro2Emissions,euro3Emissions:euro3Emissions,
            euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getPassengerSUVsDieselTotals() : any {
        let numVehicles = Number(this.fleetData.passengerSUVsDiesel.preEuro.numVehicles|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro1.numVehicles|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro2.numVehicles|| 0)
            + Number(this.fleetData.passengerSUVsDiesel.euro3.numVehicles|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro4.numVehicles|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro5.numVehicles|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro6.numVehicles|| 0);

        let annualMileage = Number(this.fleetData.passengerSUVsDiesel.preEuro.annualMileage|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro1.annualMileage|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro2.annualMileage|| 0)
            + Number(this.fleetData.passengerSUVsDiesel.euro3.annualMileage|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro4.annualMileage|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro5.annualMileage|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.passengerSUVsDiesel.preEuro.annualFuel|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro1.annualFuel|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro2.annualFuel|| 0)
            + Number(this.fleetData.passengerSUVsDiesel.euro3.annualFuel|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro4.annualFuel|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro5.annualFuel|| 0) + Number(this.fleetData.passengerSUVsDiesel.euro6.annualFuel|| 0);

        let passengerSUVsDieselEmissions = this.passengerSUVsDieselEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,passengerSUVsDieselEmissions:passengerSUVsDieselEmissions};
    }


    passengerSUVsDieselEmissions():any {
        let preEuroEmissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsDiesel.preEuro,this.fleetData.passengerSUVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr);
        let euro1Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsDiesel.euro1,this.fleetData.passengerSUVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr);
        let euro2Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsDiesel.euro2,this.fleetData.passengerSUVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr);
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsDiesel.euro3,this.fleetData.passengerSUVsDiesel.euro3,this.emissionFactors.dieselCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsDiesel.euro4,this.fleetData.passengerSUVsDiesel.euro4,this.emissionFactors.dieselCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsDiesel.euro5,this.fleetData.passengerSUVsDiesel.euro5,this.emissionFactors.dieselCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.passengerSUVsDiesel.euro6,this.fleetData.passengerSUVsDiesel.euro6,this.emissionFactors.dieselCO2perLtr);
        let sumEmissions = this.sumEmissions(preEuroEmissions,euro1Emissions,euro2Emissions,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {preEuroEmissions:preEuroEmissions,euro1Emissions:euro1Emissions,euro2Emissions:euro2Emissions,euro3Emissions:euro3Emissions,euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getPassengerSUVsElectricTotals() : any {
        let numVehicles = Number(this.fleetData.passengerSUVsElectric.hybridElectric.numVehicles|| 0) + Number(this.fleetData.passengerSUVsElectric.plugInHybridElectric.numVehicles|| 0) + Number(this.fleetData.passengerSUVsElectric.batteryElectric.numVehicles|| 0);
        let annualMileage = Number(this.fleetData.passengerSUVsElectric.hybridElectric.annualMileage|| 0) + Number(this.fleetData.passengerSUVsElectric.plugInHybridElectric.annualMileage|| 0) + Number(this.fleetData.passengerSUVsElectric.batteryElectric.annualMileage|| 0);
        let annualFuel = Number(this.fleetData.passengerSUVsElectric.hybridElectric.annualFuel|| 0) + Number(this.fleetData.passengerSUVsElectric.plugInHybridElectric.annualFuel|| 0) + Number(this.fleetData.passengerSUVsElectric.batteryElectric.annualFuel|| 0);
        let passengerSUVsElectricEmissions = this.passengerSUVsElectricEmissions();
        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,passengerSUVsElectricEmissions:passengerSUVsElectricEmissions};
    }

    passengerSUVsElectricEmissions() {
        let emFactor = this.getElectricEmissionFactor(this.fleetData.generalInfo.fossilFuelElec).emFactor;
        let hybridElectricEmissions = this.getEmissions(true,true,true,emFactor.hybridElectric,this.fleetData.passengerSUVsElectric.hybridElectric,emFactor.hybridElectric.carbonDioxide);
        let plugInHybridElectricEmissions = this.getEmissions(true,true,true,emFactor.plugInHybridElectric,this.fleetData.passengerSUVsElectric.plugInHybridElectric,emFactor.plugInHybridElectric.carbonDioxide);
        let batteryElectricEmissions = this.getEmissions(true,true,false,emFactor.batteryElectric,this.fleetData.passengerSUVsElectric.batteryElectric,emFactor.batteryElectric.carbonDioxide);
        let sumEmissions = this.sumEmissions(0,0,0,0,hybridElectricEmissions,plugInHybridElectricEmissions,batteryElectricEmissions);
        return {hybridElectricEmissions:hybridElectricEmissions,plugInHybridElectricEmissions:plugInHybridElectricEmissions,batteryElectricEmissions:batteryElectricEmissions,sumEmissions:sumEmissions};

    }

    getLDVsGasolineTotals() : any {
        let numVehicles = Number(this.fleetData.lDVsGasoline.preEuro.numVehicles|| 0) + Number(this.fleetData.lDVsGasoline.euro1.numVehicles|| 0) + Number(this.fleetData.lDVsGasoline.euro2.numVehicles|| 0)
            + Number(this.fleetData.lDVsGasoline.euro3.numVehicles|| 0) + Number(this.fleetData.lDVsGasoline.euro4.numVehicles|| 0) + Number(this.fleetData.lDVsGasoline.euro5.numVehicles|| 0) + Number(this.fleetData.lDVsGasoline.euro6.numVehicles|| 0);

        let annualMileage = Number(this.fleetData.lDVsGasoline.preEuro.annualMileage|| 0) + Number(this.fleetData.lDVsGasoline.euro1.annualMileage|| 0) + Number(this.fleetData.lDVsGasoline.euro2.annualMileage|| 0)
            + Number(this.fleetData.lDVsGasoline.euro3.annualMileage|| 0) + Number(this.fleetData.lDVsGasoline.euro4.annualMileage|| 0) + Number(this.fleetData.lDVsGasoline.euro5.annualMileage|| 0) + Number(this.fleetData.lDVsGasoline.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.lDVsGasoline.preEuro.annualFuel|| 0) + Number(this.fleetData.lDVsGasoline.euro1.annualFuel|| 0) + Number(this.fleetData.lDVsGasoline.euro2.annualFuel|| 0)
            + Number(this.fleetData.lDVsGasoline.euro3.annualFuel|| 0) + Number(this.fleetData.lDVsGasoline.euro4.annualFuel|| 0) + Number(this.fleetData.lDVsGasoline.euro5.annualFuel|| 0) + Number(this.fleetData.lDVsGasoline.euro6.annualFuel|| 0);

        let lDVsGasolineEmissions = this.lDVsGasolineEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,lDVsGasolineEmissions:lDVsGasolineEmissions};
    }

    lDVsGasolineEmissions():any {
        let preEuroEmissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.preEuro,this.fleetData.lDVsGasoline.preEuro,this.emissionFactors.petrolCO2perLtr);
        let euro1Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro1,this.fleetData.lDVsGasoline.euro1,this.emissionFactors.petrolCO2perLtr);
        let euro2Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro2,this.fleetData.lDVsGasoline.euro2,this.emissionFactors.petrolCO2perLtr);
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro3,this.fleetData.lDVsGasoline.euro3,this.emissionFactors.petrolCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro4,this.fleetData.lDVsGasoline.euro4,this.emissionFactors.petrolCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro5,this.fleetData.lDVsGasoline.euro5,this.emissionFactors.petrolCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro6,this.fleetData.lDVsGasoline.euro6,this.emissionFactors.petrolCO2perLtr);
        let sumEmissions = this.sumEmissions(preEuroEmissions,euro1Emissions,euro2Emissions,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {preEuroEmissions:preEuroEmissions,euro1Emissions:euro1Emissions,euro2Emissions:euro2Emissions,euro3Emissions:euro3Emissions,
            euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getLDVsDieselTotals() : any {
        let numVehicles = Number(this.fleetData.lDVsDiesel.preEuro.numVehicles|| 0) + Number(this.fleetData.lDVsDiesel.euro1.numVehicles|| 0) + Number(this.fleetData.lDVsDiesel.euro2.numVehicles|| 0)
            + Number(this.fleetData.lDVsDiesel.euro3.numVehicles|| 0) + Number(this.fleetData.lDVsDiesel.euro4.numVehicles|| 0) + Number(this.fleetData.lDVsDiesel.euro5.numVehicles|| 0) + Number(this.fleetData.lDVsDiesel.euro6.numVehicles|| 0);

        let annualMileage = Number(this.fleetData.lDVsDiesel.preEuro.annualMileage|| 0) + Number(this.fleetData.lDVsDiesel.euro1.annualMileage|| 0) + Number(this.fleetData.lDVsDiesel.euro2.annualMileage|| 0)
            + Number(this.fleetData.lDVsDiesel.euro3.annualMileage|| 0) + Number(this.fleetData.lDVsDiesel.euro4.annualMileage|| 0) + Number(this.fleetData.lDVsDiesel.euro5.annualMileage|| 0) + Number(this.fleetData.lDVsDiesel.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.lDVsDiesel.preEuro.annualFuel|| 0) + Number(this.fleetData.lDVsDiesel.euro1.annualFuel|| 0) + Number(this.fleetData.lDVsDiesel.euro2.annualFuel|| 0)
            + Number(this.fleetData.lDVsDiesel.euro3.annualFuel|| 0) + Number(this.fleetData.lDVsDiesel.euro4.annualFuel|| 0) + Number(this.fleetData.lDVsDiesel.euro5.annualFuel|| 0) + Number(this.fleetData.lDVsDiesel.euro6.annualFuel|| 0);

        let lDVsDieselEmissions = this.lDVsDieselEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,lDVsDieselEmissions:lDVsDieselEmissions};
    }


    lDVsDieselEmissions():any {
        let preEuroEmissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.preEuro,this.fleetData.lDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr);
        let euro1Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro1,this.fleetData.lDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr);
        let euro2Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro2,this.fleetData.lDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr);
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro3,this.fleetData.lDVsDiesel.euro3,this.emissionFactors.dieselCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro4,this.fleetData.lDVsDiesel.euro4,this.emissionFactors.dieselCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro5,this.fleetData.lDVsDiesel.euro5,this.emissionFactors.dieselCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro6,this.fleetData.lDVsDiesel.euro6,this.emissionFactors.dieselCO2perLtr);
        let sumEmissions = this.sumEmissions(preEuroEmissions,euro1Emissions,euro2Emissions,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {preEuroEmissions:preEuroEmissions,euro1Emissions:euro1Emissions,euro2Emissions:euro2Emissions,euro3Emissions:euro3Emissions,euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getMDVsDieselTotals() : any {
        let numVehicles = Number(this.fleetData.mDVsDiesel.preEuro.numVehicles|| 0) + Number(this.fleetData.mDVsDiesel.euro1.numVehicles|| 0) + Number(this.fleetData.mDVsDiesel.euro2.numVehicles|| 0)
            + Number(this.fleetData.mDVsDiesel.euro3.numVehicles|| 0) + Number(this.fleetData.mDVsDiesel.euro4.numVehicles|| 0) + Number(this.fleetData.mDVsDiesel.euro5.numVehicles|| 0) + Number(this.fleetData.mDVsDiesel.euro6.numVehicles|| 0);

        let annualMileage = Number(this.fleetData.mDVsDiesel.preEuro.annualMileage|| 0) + Number(this.fleetData.mDVsDiesel.euro1.annualMileage|| 0) + Number(this.fleetData.mDVsDiesel.euro2.annualMileage|| 0)
            + Number(this.fleetData.mDVsDiesel.euro3.annualMileage|| 0) + Number(this.fleetData.mDVsDiesel.euro4.annualMileage|| 0) + Number(this.fleetData.mDVsDiesel.euro5.annualMileage|| 0) + Number(this.fleetData.mDVsDiesel.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.mDVsDiesel.preEuro.annualFuel|| 0) + Number(this.fleetData.mDVsDiesel.euro1.annualFuel|| 0) + Number(this.fleetData.mDVsDiesel.euro2.annualFuel|| 0)
            + Number(this.fleetData.mDVsDiesel.euro3.annualFuel|| 0) + Number(this.fleetData.mDVsDiesel.euro4.annualFuel|| 0) + Number(this.fleetData.mDVsDiesel.euro5.annualFuel|| 0) + Number(this.fleetData.mDVsDiesel.euro6.annualFuel|| 0);

        let mDVsDieselEmissions = this.mDVsDieselEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,mDVsDieselEmissions:mDVsDieselEmissions};
    }


    mDVsDieselEmissions():any {
        let preEuroEmissions = this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.preEuro,this.fleetData.mDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr);
        let euro1Emissions = this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro1,this.fleetData.mDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr);
        let euro2Emissions = this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro2,this.fleetData.mDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr);
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro3,this.fleetData.mDVsDiesel.euro3,this.emissionFactors.dieselCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro4,this.fleetData.mDVsDiesel.euro4,this.emissionFactors.dieselCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro5,this.fleetData.mDVsDiesel.euro5,this.emissionFactors.dieselCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro6,this.fleetData.mDVsDiesel.euro6,this.emissionFactors.dieselCO2perLtr);
        let sumEmissions = this.sumEmissions(preEuroEmissions,euro1Emissions,euro2Emissions,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {preEuroEmissions:preEuroEmissions,euro1Emissions:euro1Emissions,euro2Emissions:euro2Emissions,euro3Emissions:euro3Emissions,euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getHDVsDieselTotals() : any {
        let numVehicles = Number(this.fleetData.hDVsDiesel.preEuro.numVehicles|| 0) + Number(this.fleetData.hDVsDiesel.euro1.numVehicles|| 0) + Number(this.fleetData.hDVsDiesel.euro2.numVehicles|| 0)
            + Number(this.fleetData.hDVsDiesel.euro3.numVehicles|| 0) + Number(this.fleetData.hDVsDiesel.euro4.numVehicles|| 0) + Number(this.fleetData.hDVsDiesel.euro5.numVehicles|| 0) + Number(this.fleetData.hDVsDiesel.euro6.numVehicles|| 0);

        let annualMileage = Number(this.fleetData.hDVsDiesel.preEuro.annualMileage|| 0) + Number(this.fleetData.hDVsDiesel.euro1.annualMileage|| 0) + Number(this.fleetData.hDVsDiesel.euro2.annualMileage|| 0)
            + Number(this.fleetData.hDVsDiesel.euro3.annualMileage|| 0) + Number(this.fleetData.hDVsDiesel.euro4.annualMileage|| 0) + Number(this.fleetData.hDVsDiesel.euro5.annualMileage|| 0) + Number(this.fleetData.hDVsDiesel.euro6.annualMileage|| 0);

        let annualFuel = Number(this.fleetData.hDVsDiesel.preEuro.annualFuel|| 0) + Number(this.fleetData.hDVsDiesel.euro1.annualFuel|| 0) + Number(this.fleetData.hDVsDiesel.euro2.annualFuel|| 0)
            + Number(this.fleetData.hDVsDiesel.euro3.annualFuel|| 0) + Number(this.fleetData.hDVsDiesel.euro4.annualFuel|| 0) + Number(this.fleetData.hDVsDiesel.euro5.annualFuel|| 0) + Number(this.fleetData.hDVsDiesel.euro6.annualFuel|| 0);

        let hDVsDieselEmissions = this.hDVsDieselEmissions();

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,hDVsDieselEmissions:hDVsDieselEmissions};
    }

    hDVsDieselEmissions():any {
        let preEuroEmissions = this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.preEuro,this.fleetData.hDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr);
        let euro1Emissions = this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro1,this.fleetData.hDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr);
        let euro2Emissions = this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro2,this.fleetData.hDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr);
        let euro3Emissions = this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro3,this.fleetData.hDVsDiesel.euro3,this.emissionFactors.dieselCO2perLtr);
        let euro4Emissions = this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro4,this.fleetData.hDVsDiesel.euro4,this.emissionFactors.dieselCO2perLtr);
        let euro5Emissions = this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro5,this.fleetData.hDVsDiesel.euro5,this.emissionFactors.dieselCO2perLtr);
        let euro6Emissions = this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro6,this.fleetData.hDVsDiesel.euro6,this.emissionFactors.dieselCO2perLtr);
        let sumEmissions = this.sumEmissions(preEuroEmissions,euro1Emissions,euro2Emissions,euro3Emissions,euro4Emissions,euro5Emissions,euro6Emissions);
        return {preEuroEmissions:preEuroEmissions,euro1Emissions:euro1Emissions,euro2Emissions:euro2Emissions,euro3Emissions:euro3Emissions,euro4Emissions:euro4Emissions,euro5Emissions:euro5Emissions,euro6Emissions:euro6Emissions,sumEmissions:sumEmissions};
    }

    getMotorCyclesTotals() : any {
        let numVehicles = Number(this.fleetData.motorCycles.fourStroke.numVehicles|| 0) + Number(this.fleetData.motorCycles.twoStroke.numVehicles|| 0) + Number(this.fleetData.motorCycles.electric.numVehicles|| 0);
        let annualMileage = Number(this.fleetData.motorCycles.fourStroke.annualMileage|| 0) + Number(this.fleetData.motorCycles.twoStroke.annualMileage|| 0) + Number(this.fleetData.motorCycles.electric.annualMileage|| 0);
        let annualFuel = Number(this.fleetData.motorCycles.fourStroke.annualFuel|| 0) + Number(this.fleetData.motorCycles.twoStroke.annualFuel|| 0) + Number(this.fleetData.motorCycles.electric.annualFuel|| 0);
        let motorCyclesEmissions = this.motorCyclesEmissions();
        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,motorCyclesEmissions:motorCyclesEmissions};
    }

    motorCyclesEmissions():any {
        let emFactor = this.getElectricEmissionFactor(this.fleetData.generalInfo.fossilFuelElec).emFactor;
        let fourStrokeEmissions = this.getEmissions(false,true,true,this.emissionFactors.motorcycles.fourStroke,this.fleetData.motorCycles.fourStroke,this.emissionFactors.petrolCO2perLtr);
        let twoStrokeEmissions = this.getEmissions(false,true,true,this.emissionFactors.motorcycles.twoStroke,this.fleetData.motorCycles.twoStroke,this.emissionFactors.petrolCO2perLtr);
        let electricEmissions = this.getEmissions(true,true,true,emFactor.batteryElectric,this.fleetData.motorCycles.electric,emFactor.batteryElectric.carbonDioxide);
        let sumEmissions = this.sumEmissions(0,0,0,0,fourStrokeEmissions,twoStrokeEmissions,electricEmissions);
        return {fourStrokeEmissions:fourStrokeEmissions,twoStrokeEmissions:twoStrokeEmissions,electricEmissions:electricEmissions,sumEmissions:sumEmissions};
    }

    // changed
    getGeneratorsTotals() : any {
        let numVehicles = Number(this.fleetData.generators.diesel.numVehicles|| 0);
        let annualMileage = Number(this.fleetData.generators.diesel.annualMileage|| 0);
        let annualFuel = Number(this.fleetData.generators.diesel.annualFuel|| 0);
        let generatorsEmissions = this.generatorsEmissions();
        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,generatorsEmissions:generatorsEmissions};
    }

    generatorsEmissions():any {
        let dieselEmissions = this.getEmissions(false,false,true,this.emissionFactors.generators,this.fleetData.generators.diesel,this.emissionFactors.dieselCO2perLtr);
        let sumEmissions = this.sumEmissions(0,0,0,0,0,0,dieselEmissions);
        return {dieselEmissions:dieselEmissions,sumEmissions:sumEmissions};
    }

    getElectricEmissionFactor(fossilFuelElec:number):any {
        let emFactor:any;
        if(fossilFuelElec == 0){
            emFactor = this.emissionFactors.eV0FossilFuel;
        }else if(fossilFuelElec == 20){
            emFactor = this.emissionFactors.eV20FossilFuel;
        }else if(fossilFuelElec == 40){
            emFactor = this.emissionFactors.eV40FossilFuel;
        }else if(fossilFuelElec == 60){
            emFactor = this.emissionFactors.eV60FossilFuel;
        }else if(fossilFuelElec == 80){
            emFactor = this.emissionFactors.eV80FossilFuel;
        }else if(fossilFuelElec == 100){
            emFactor = this.emissionFactors.eV100FossilFuel;
        }else{
            // we should this but this will bring up issues or errors
            // emFactor = null || undefined;
            // so set the default to eV0FossilFuel
            emFactor = this.emissionFactors.eV0FossilFuel;
        }
        return {emFactor:emFactor};
    }




    getEmissions(isElectric:boolean,hasMileage:boolean,hasFuel:boolean,emissionFactor: any, model: any,carbonPerLitre:number):any {
        let carbonMonoxide:number = this.calculateCVN(isElectric,hasMileage,emissionFactor.carbonMonoxide,model,this.emissionFactors.passengerCarsGasoline.euro4.carbonMonoxide);
        let volatileOrganic:number = this.calculateCVN(isElectric,hasMileage,emissionFactor.volatileOrganic,model,this.emissionFactors.passengerCarsGasoline.euro4.volatileOrganic);
        let nitrousOxide:number = this.calculateCVN(isElectric,hasMileage,emissionFactor.nitrousOxide,model,this.emissionFactors.passengerCarsGasoline.euro4.nitrousOxide);
        let sulphurOxide:number = this.calculateSP(isElectric,hasMileage,emissionFactor.sulphurOxide,model,this.emissionFactors.passengerCarsGasoline.euro4.sulphurOxide);
        let particulateMatter:number = this.calculateSP(isElectric,hasMileage,emissionFactor.particulateMatter,model,this.emissionFactors.passengerCarsGasoline.euro4.particulateMatter);
        let carbonDioxide:number = this.calculateCarbon(isElectric,hasFuel,model,carbonPerLitre) ;
        return {carbonMonoxide:carbonMonoxide,volatileOrganic:volatileOrganic,nitrousOxide:nitrousOxide,sulphurOxide:sulphurOxide,particulateMatter:particulateMatter,carbonDioxide:carbonDioxide};
    }

    calculateCVN(isElectric:boolean,hasMileage:boolean,emissionFactor: number, model: any,preEuroValue:number):any {
        let cVN:any = null;
        let distance = model.annualMileage;
        if(!hasMileage){
            if(model.numVehicles != undefined || model.annualFuel != undefined){
                distance = 1;
            }
        }
        if(isElectric){
            cVN = ((1-emissionFactor)*(distance/1000)*(preEuroValue));
        }else{
            cVN = emissionFactor*(distance/1000);
        }
        return cVN;
    }

    calculateSP(isElectric:boolean,hasMileage:boolean,emissionFactor:number, model: any,preEuroValue:number): number{
        let sP:any = null;
        let distance = model.annualMileage;
        if(!hasMileage){
            if(model.numVehicles != undefined || model.annualFuel != undefined){
                distance = 1;
            }
        }
        if(isElectric){
            sP = ((1-emissionFactor)*(this.fleetData.generalInfo.sulphurLevel/15)*(distance/1000)*(preEuroValue));
        }else{
            sP = emissionFactor*(this.fleetData.generalInfo.sulphurLevel/15)*(distance/1000);
        }
        return sP;
    }

    calculateCarbon(isElectric:boolean,hasFuel:boolean,model:any, carbonPerLitre:number): number{
        let annualFuelConst = model.annualFuel;
        let carbon:any = null;
        if(!hasFuel){
            if(model.numVehicles != undefined || model.annualMileage != undefined){
                annualFuelConst = 0;
            }
        }
        if(isElectric){
            carbon = ((1-carbonPerLitre)*(annualFuelConst)*(this.emissionFactors.petrolCO2perLtr));
        }else{
            carbon = annualFuelConst*carbonPerLitre;
        }
        return carbon;
    }

    sumEmissions(preEuroEmissions: any, euro1Emissions: any, euro2Emissions: any, euro3Emissions: any, euro4Emissions: any, euro5Emissions: any, euro6Emissions: any):any {
        let carbonMonoxide = (preEuroEmissions.carbonMonoxide || 0) + (euro1Emissions.carbonMonoxide || 0) + (euro2Emissions.carbonMonoxide || 0)
            + (euro3Emissions.carbonMonoxide || 0) + (euro4Emissions.carbonMonoxide || 0) + (euro5Emissions.carbonMonoxide || 0) + (euro6Emissions.carbonMonoxide || 0);
        let volatileOrganic = (preEuroEmissions.volatileOrganic || 0) + (euro1Emissions.volatileOrganic || 0) + (euro2Emissions.volatileOrganic || 0)
            + (euro3Emissions.volatileOrganic || 0) + (euro4Emissions.volatileOrganic || 0) + (euro5Emissions.volatileOrganic || 0) + (euro6Emissions.volatileOrganic || 0);
        let nitrousOxide = (preEuroEmissions.nitrousOxide || 0) + (euro1Emissions.nitrousOxide || 0) + (euro2Emissions.nitrousOxide || 0)
            + (euro3Emissions.nitrousOxide || 0) + (euro4Emissions.nitrousOxide || 0) + (euro5Emissions.nitrousOxide || 0) + (euro6Emissions.nitrousOxide || 0);
        let sulphurOxide = (preEuroEmissions.sulphurOxide || 0) + (euro1Emissions.sulphurOxide || 0) + (euro2Emissions.sulphurOxide || 0)
            + (euro3Emissions.sulphurOxide || 0) + (euro4Emissions.sulphurOxide || 0) + (euro5Emissions.sulphurOxide || 0) + (euro6Emissions.sulphurOxide || 0);
        let particulateMatter = (preEuroEmissions.particulateMatter || 0) + (euro1Emissions.particulateMatter || 0) + (euro2Emissions.particulateMatter || 0)
            + (euro3Emissions.particulateMatter || 0) + (euro4Emissions.particulateMatter || 0) + (euro5Emissions.particulateMatter || 0) + (euro6Emissions.particulateMatter || 0);
        let carbonDioxide = (preEuroEmissions.carbonDioxide || 0) + (euro1Emissions.carbonDioxide || 0) + (euro2Emissions.carbonDioxide || 0)
            + (euro3Emissions.carbonDioxide || 0) + (euro4Emissions.carbonDioxide || 0) + (euro5Emissions.carbonDioxide || 0) + (euro6Emissions.carbonDioxide || 0);

        return {carbonMonoxide:carbonMonoxide,volatileOrganic:volatileOrganic,nitrousOxide:nitrousOxide,sulphurOxide:sulphurOxide,particulateMatter:particulateMatter,carbonDioxide:carbonDioxide};
    }

    getAllTotals() : any {

        let numVehicles = Number(this.getPassengerCarsGasolineTotals().numVehicles) + Number(this.getPassengerCarsDieselTotals().numVehicles) + Number(this.getPassengerCarsElectricTotals().numVehicles) + Number(this.getPassengerSUVsGasolineTotals().numVehicles)
            + Number(this.getPassengerSUVsDieselTotals().numVehicles) + Number(this.getPassengerSUVsElectricTotals().numVehicles) + Number(this.getLDVsGasolineTotals().numVehicles) + Number(this.getLDVsDieselTotals().numVehicles) + Number(this.getMDVsDieselTotals().numVehicles)
            + Number(this.getHDVsDieselTotals().numVehicles)+ Number(this.getMotorCyclesTotals().numVehicles)+ Number(this.getGeneratorsTotals().numVehicles);

        let annualMileage = Number(this.getPassengerCarsGasolineTotals().annualMileage) + Number(this.getPassengerCarsDieselTotals().annualMileage) + Number(this.getPassengerCarsElectricTotals().annualMileage) + Number(this.getPassengerSUVsGasolineTotals().annualMileage)
            + Number(this.getPassengerSUVsDieselTotals().annualMileage) + Number(this.getPassengerSUVsElectricTotals().annualMileage) + Number(this.getLDVsGasolineTotals().annualMileage) + Number(this.getLDVsDieselTotals().annualMileage) + Number(this.getMDVsDieselTotals().annualMileage)
            + Number(this.getHDVsDieselTotals().annualMileage)+ Number(this.getMotorCyclesTotals().annualMileage)+ Number(this.getGeneratorsTotals().annualMileage);

        let annualFuel = Number(this.getPassengerCarsGasolineTotals().annualFuel) + Number(this.getPassengerCarsDieselTotals().annualFuel) + Number(this.getPassengerCarsElectricTotals().annualFuel) + Number(this.getPassengerSUVsGasolineTotals().annualFuel)
            + Number(this.getPassengerSUVsDieselTotals().annualFuel) + Number(this.getPassengerSUVsElectricTotals().annualFuel) + Number(this.getLDVsGasolineTotals().annualFuel) + Number(this.getLDVsDieselTotals().annualFuel) + Number(this.getMDVsDieselTotals().annualFuel)
            + Number(this.getHDVsDieselTotals().annualFuel)+ Number(this.getMotorCyclesTotals().annualFuel)+ Number(this.getGeneratorsTotals().annualFuel);

        let carbonMonoxide = this.passengerCarsGasolineEmissions().sumEmissions.carbonMonoxide + this.passengerCarsDieselEmissions().sumEmissions.carbonMonoxide + this.passengerCarsElectric().sumEmissions.carbonMonoxide
            + this.passengerSUVsGasolineEmissions().sumEmissions.carbonMonoxide + this.passengerSUVsDieselEmissions().sumEmissions.carbonMonoxide + this.passengerSUVsElectricEmissions().sumEmissions.carbonMonoxide
            + this.lDVsGasolineEmissions().sumEmissions.carbonMonoxide + this.lDVsDieselEmissions().sumEmissions.carbonMonoxide + this.mDVsDieselEmissions().sumEmissions.carbonMonoxide + this.hDVsDieselEmissions().sumEmissions.carbonMonoxide
            + this.motorCyclesEmissions().sumEmissions.carbonMonoxide + this.generatorsEmissions().sumEmissions.carbonMonoxide;

        let volatileOrganic = this.passengerCarsGasolineEmissions().sumEmissions.volatileOrganic + this.passengerCarsDieselEmissions().sumEmissions.volatileOrganic + this.passengerCarsElectric().sumEmissions.volatileOrganic
            + this.passengerSUVsGasolineEmissions().sumEmissions.volatileOrganic + this.passengerSUVsDieselEmissions().sumEmissions.volatileOrganic + this.passengerSUVsElectricEmissions().sumEmissions.volatileOrganic
            + this.lDVsGasolineEmissions().sumEmissions.volatileOrganic + this.lDVsDieselEmissions().sumEmissions.volatileOrganic + this.mDVsDieselEmissions().sumEmissions.volatileOrganic + this.hDVsDieselEmissions().sumEmissions.volatileOrganic
            + this.motorCyclesEmissions().sumEmissions.volatileOrganic + this.generatorsEmissions().sumEmissions.volatileOrganic;

        let nitrousOxide = this.passengerCarsGasolineEmissions().sumEmissions.nitrousOxide + this.passengerCarsDieselEmissions().sumEmissions.nitrousOxide + this.passengerCarsElectric().sumEmissions.nitrousOxide
            + this.passengerSUVsGasolineEmissions().sumEmissions.nitrousOxide + this.passengerSUVsDieselEmissions().sumEmissions.nitrousOxide + this.passengerSUVsElectricEmissions().sumEmissions.nitrousOxide
            + this.lDVsGasolineEmissions().sumEmissions.nitrousOxide + this.lDVsDieselEmissions().sumEmissions.nitrousOxide + this.mDVsDieselEmissions().sumEmissions.nitrousOxide + this.hDVsDieselEmissions().sumEmissions.nitrousOxide
            + this.motorCyclesEmissions().sumEmissions.nitrousOxide + this.generatorsEmissions().sumEmissions.nitrousOxide;

        let sulphurOxide = this.passengerCarsGasolineEmissions().sumEmissions.sulphurOxide + this.passengerCarsDieselEmissions().sumEmissions.sulphurOxide + this.passengerCarsElectric().sumEmissions.sulphurOxide
            + this.passengerSUVsGasolineEmissions().sumEmissions.sulphurOxide + this.passengerSUVsDieselEmissions().sumEmissions.sulphurOxide + this.passengerSUVsElectricEmissions().sumEmissions.sulphurOxide
            + this.lDVsGasolineEmissions().sumEmissions.sulphurOxide + this.lDVsDieselEmissions().sumEmissions.sulphurOxide + this.mDVsDieselEmissions().sumEmissions.sulphurOxide + this.hDVsDieselEmissions().sumEmissions.sulphurOxide
            + this.motorCyclesEmissions().sumEmissions.sulphurOxide + this.generatorsEmissions().sumEmissions.sulphurOxide;

        let particulateMatter = this.passengerCarsGasolineEmissions().sumEmissions.particulateMatter + this.passengerCarsDieselEmissions().sumEmissions.particulateMatter + this.passengerCarsElectric().sumEmissions.particulateMatter
            + this.passengerSUVsGasolineEmissions().sumEmissions.particulateMatter + this.passengerSUVsDieselEmissions().sumEmissions.particulateMatter + this.passengerSUVsElectricEmissions().sumEmissions.particulateMatter
            + this.lDVsGasolineEmissions().sumEmissions.particulateMatter + this.lDVsDieselEmissions().sumEmissions.particulateMatter + this.mDVsDieselEmissions().sumEmissions.particulateMatter + this.hDVsDieselEmissions().sumEmissions.particulateMatter
            + this.motorCyclesEmissions().sumEmissions.particulateMatter + this.generatorsEmissions().sumEmissions.particulateMatter;

        let carbonDioxide = this.passengerCarsGasolineEmissions().sumEmissions.carbonDioxide + this.passengerCarsDieselEmissions().sumEmissions.carbonDioxide + this.passengerCarsElectric().sumEmissions.carbonDioxide
            + this.passengerSUVsGasolineEmissions().sumEmissions.carbonDioxide + this.passengerSUVsDieselEmissions().sumEmissions.carbonDioxide + this.passengerSUVsElectricEmissions().sumEmissions.carbonDioxide
            + this.lDVsGasolineEmissions().sumEmissions.carbonDioxide + this.lDVsDieselEmissions().sumEmissions.carbonDioxide + this.mDVsDieselEmissions().sumEmissions.carbonDioxide + this.hDVsDieselEmissions().sumEmissions.carbonDioxide
            + this.motorCyclesEmissions().sumEmissions.carbonDioxide + this.generatorsEmissions().sumEmissions.carbonDioxide;

        let totalGasolineFuel = Number(this.getPassengerCarsGasolineTotals().annualFuel) + Number(this.getPassengerCarsElectricTotals().annualFuel) + Number(this.getPassengerSUVsGasolineTotals().annualFuel)
            + Number(this.getPassengerSUVsElectricTotals().annualFuel) + Number(this.getLDVsGasolineTotals().annualFuel) + Number(this.getMotorCyclesTotals().annualFuel);

        let totalDieselFuel = Number(this.getPassengerCarsDieselTotals().annualFuel) + Number(this.getPassengerSUVsDieselTotals().annualFuel) + Number(this.getLDVsDieselTotals().annualFuel) + Number(this.getMDVsDieselTotals().annualFuel)
            + Number(this.getHDVsDieselTotals().annualFuel)+ Number(this.getGeneratorsTotals().annualFuel);

        let totalGasolineCost = totalGasolineFuel * this.fleetData.generalInfo.petrolPrice;

        let totalDieselCost = totalDieselFuel * this.fleetData.generalInfo.dieselPrice;

        return {numVehicles:numVehicles,annualMileage:annualMileage,annualFuel:annualFuel,carbonMonoxide:carbonMonoxide,
            volatileOrganic:volatileOrganic,nitrousOxide:nitrousOxide,sulphurOxide:sulphurOxide,particulateMatter:particulateMatter,carbonDioxide:carbonDioxide
            ,totalGasolineFuel:totalGasolineFuel,totalDieselFuel:totalDieselFuel,totalGasolineCost:totalGasolineCost,totalDieselCost:totalDieselCost};
    }

    //Recommended Actions
    ecoDriving() : any {
        let canSaveLow = this.getAllTotals().totalGasolineFuel + this.getAllTotals().totalDieselFuel;
        let canSaveHigh = this.getAllTotals().totalGasolineFuel + this.getAllTotals().totalDieselFuel;
        let youSaveLow = this.getAllTotals().totalGasolineCost + this.getAllTotals().totalDieselCost;
        let youSaveHigh = this.getAllTotals().totalGasolineCost + this.getAllTotals().totalDieselCost;
        let CO2ReduceLow = (((this.getAllTotals().totalGasolineFuel*this.emissionFactors.petrolCO2perLtr) + (this.getAllTotals().totalDieselFuel * this.emissionFactors.dieselCO2perLtr))/1000);
        let CO2ReduceHigh = (((this.getAllTotals().totalGasolineFuel*this.emissionFactors.petrolCO2perLtr) + (this.getAllTotals().totalDieselFuel * this.emissionFactors.dieselCO2perLtr))/1000);
        let idlingWastage = 0.08 * (this.getAllTotals().totalGasolineCost + this.getAllTotals().totalDieselCost);
        return {canSaveLow:canSaveLow,canSaveHigh:canSaveHigh,youSaveLow:youSaveLow,youSaveHigh:youSaveHigh
            ,CO2ReduceLow:CO2ReduceLow,CO2ReduceHigh:CO2ReduceHigh,idlingWastage:idlingWastage};

    }

    cleanerFuels() : any {
        let sulphurL1 = null;
        let sulphurL2 = null;

        if (this.fleetData.generalInfo.sulphurLevel > 500) {
            sulphurL1 = 500;
            sulphurL2 = 50;
        } else if (this.fleetData.generalInfo.sulphurLevel <= 500 && this.fleetData.generalInfo.sulphurLevel > 50 ) {
            sulphurL1 = 50;
            sulphurL2 = 15;
        } else if (this.fleetData.generalInfo.sulphurLevel <= 50) {
            sulphurL1 = 15;
            sulphurL2 = 10;
        }

        let fleetSOxHighPPM = (this.getAllTotals().sulphurOxide * (sulphurL1/this.fleetData.generalInfo.sulphurLevel));
        let fleetSOxLowPPM = (this.getAllTotals().sulphurOxide * (sulphurL2/this.fleetData.generalInfo.sulphurLevel));
        let sulphurL1SOx = this.getAllTotals().sulphurOxide - fleetSOxHighPPM;
        let sulphurL2SOx = this.getAllTotals().sulphurOxide - fleetSOxLowPPM;
        let sulphurL1SOxReduction = ((sulphurL1SOx / this.getAllTotals().sulphurOxide)*100);
        let sulphurL2SOxReduction = ((sulphurL2SOx / this.getAllTotals().sulphurOxide)*100);

        return {fleetSOxHighPPM:fleetSOxHighPPM,fleetSOxLowPPM:fleetSOxLowPPM,sulphurL1SOx:sulphurL1SOx,sulphurL2SOx:sulphurL2SOx,
            sulphurL1SOxReduction:sulphurL1SOxReduction,sulphurL2SOxReduction:sulphurL2SOxReduction, sulphurL1:sulphurL1, sulphurL2:sulphurL2};

    }

    switchToHeVOrBev(isHev:boolean):any{
        let emFactor = this.getElectricEmissionFactor(this.fleetData.generalInfo.fossilFuelElec).emFactor;
        let hevBevFuelConst = 0;
        let hevBevAdditionalCostConst = 0;
        let priceConst = 0;
        let hevSwitchCO2 = 0;
        if(isHev){
            hevBevFuelConst = this.fleetData.actionsRecommended.switchToHevs.hEVFuelEconomy ? this.fleetData.actionsRecommended.switchToHevs.hEVFuelEconomy : 25;
            hevBevAdditionalCostConst = this.fleetData.actionsRecommended.switchToHevs.hEVAdditionalCostPerVehicle ? this.fleetData.actionsRecommended.switchToHevs.hEVAdditionalCostPerVehicle : 1500;
            priceConst = this.fleetData.generalInfo.petrolPrice;
        }else{
            hevBevFuelConst = this.fleetData.actionsRecommended.switchToBEVs.bevCarsKmsPerKWh ? this.fleetData.actionsRecommended.switchToBEVs.bevCarsKmsPerKWh : 6.4;
            hevBevAdditionalCostConst = this.fleetData.actionsRecommended.switchToBEVs.bevCarsAdditionalCostPerVehicle ? this.fleetData.actionsRecommended.switchToBEVs.bevCarsAdditionalCostPerVehicle : 15000;
            priceConst = this.fleetData.generalInfo.elecPrice;
        }
        let numPassengerVehicles = this.getPassengerCarsGasolineTotals().numVehicles + this.getPassengerCarsDieselTotals().numVehicles + this.getPassengerSUVsGasolineTotals().numVehicles
            + this.getPassengerSUVsDieselTotals().numVehicles;
        let passengerVehiclesMileage = this.getPassengerCarsGasolineTotals().annualMileage + this.getPassengerCarsDieselTotals().annualMileage + this.getPassengerSUVsGasolineTotals().annualMileage
            + this.getPassengerSUVsDieselTotals().annualMileage;
        let passengerPetrolConsumption = this.getPassengerCarsGasolineTotals().annualFuel + this.getPassengerSUVsGasolineTotals().annualFuel;

        let hEVFuelConsumption = passengerVehiclesMileage / hevBevFuelConst;
        let hEVFuelSavings = passengerPetrolConsumption - hEVFuelConsumption;

        let passengerDieselConsumption = this.getPassengerCarsDieselTotals().annualFuel + this.getPassengerSUVsDieselTotals().annualFuel;
        let hevCurrentFuelCost = (passengerPetrolConsumption * this.fleetData.generalInfo.petrolPrice) + (passengerDieselConsumption * this.fleetData.generalInfo.dieselPrice);
        let hevSwitchFuelCost = ((passengerVehiclesMileage/hevBevFuelConst) * priceConst);
        let hEVFuelCostSavingsPerYear = hevCurrentFuelCost - hevSwitchFuelCost;

        let hevCurrentCO2 = ((passengerPetrolConsumption*this.emissionFactors.petrolCO2perLtr)+ (passengerDieselConsumption*this.emissionFactors.dieselCO2perLtr))/1000;


        if(isHev){
            hevSwitchCO2 = ((passengerVehiclesMileage/hevBevFuelConst)*this.emissionFactors.petrolCO2perLtr)/1000;
        }else{
            hevSwitchCO2 = hevCurrentCO2 * (1 - emFactor.batteryElectric.carbonDioxide);
        }

        let hevCO2Saving= hevCurrentCO2 - hevSwitchCO2;

        let hevPaybackPeriod = hevBevAdditionalCostConst/((hevCurrentFuelCost - hevSwitchFuelCost)/numPassengerVehicles);
        return {numPassengerVehicles:numPassengerVehicles,passengerVehiclesMileage:passengerVehiclesMileage,passengerPetrolConsumption:passengerPetrolConsumption,hEVFuelConsumption:hEVFuelConsumption,hEVFuelSavings:hEVFuelSavings,passengerDieselConsumption:passengerDieselConsumption,
            hevCurrentFuelCost:hevCurrentFuelCost,hevSwitchFuelCost:hevSwitchFuelCost,hEVFuelCostSavingsPerYear:hEVFuelCostSavingsPerYear,hevCurrentCO2:hevCurrentCO2,hevSwitchCO2:hevSwitchCO2,hevCO2Saving:hevCO2Saving,hevPaybackPeriod:hevPaybackPeriod};
    }

    switchToFourStroke(): any {
        let switchFourStrokeBikesVOCs = (this.fleetData.motorCycles.twoStroke.annualMileage / 1000) * this.emissionFactors.motorcycles.fourStroke.volatileOrganic;

        let switchFourStrokeBikesVOCSavings = this.motorCyclesEmissions().twoStrokeEmissions.volatileOrganic - switchFourStrokeBikesVOCs;

        let switchFourStrokeBikesPM10 = (this.fleetData.motorCycles.twoStroke.annualMileage / 1000) * this.emissionFactors.motorcycles.fourStroke.particulateMatter;

        let switchFourStrokeBikesPM10Savings = this.motorCyclesEmissions().twoStrokeEmissions.particulateMatter - switchFourStrokeBikesPM10;

        let mBike2StrokeFuel = this.fleetData.motorCycles.twoStroke.annualFuel * this.fleetData.generalInfo.petrolPrice;

        return {switchFourStrokeBikesVOCs:switchFourStrokeBikesVOCs,switchFourStrokeBikesPM10:switchFourStrokeBikesPM10,switchFourStrokeBikesVOCSavings:switchFourStrokeBikesVOCSavings,switchFourStrokeBikesPM10Savings:switchFourStrokeBikesPM10Savings
            ,mBike2StrokeFuel:mBike2StrokeFuel};
    }

    switchToElectricBikes(): any {
        let eBikesKmPerKWh = this.fleetData.actionsRecommended.switchElecMotor.elecBikesKmsPerKWh ? this.fleetData.actionsRecommended.switchElecMotor.elecBikesKmsPerKWh : 12;
        let eBikesExtraCost = this.fleetData.actionsRecommended.switchElecMotor.elecBikesAdditionalCostPerbike ? this.fleetData.actionsRecommended.switchElecMotor.elecBikesAdditionalCostPerbike : 1000;
        let emFactor = this.getElectricEmissionFactor(this.fleetData.generalInfo.fossilFuelElec).emFactor;
        let twoFourStrokeSumVehicles = Number(this.fleetData.motorCycles.twoStroke.numVehicles || 0) + Number(this.fleetData.motorCycles.fourStroke.numVehicles || 0);
        let twoFourStrokeSumMileage = Number(this.fleetData.motorCycles.twoStroke.annualMileage || 0) + Number(this.fleetData.motorCycles.fourStroke.annualMileage || 0);
        let bikesPetrolConsumption = Number(this.fleetData.motorCycles.twoStroke.annualFuel || 0) + Number(this.fleetData.motorCycles.fourStroke.annualFuel || 0);
        let bikesElecConsumption = (twoFourStrokeSumMileage)/(eBikesKmPerKWh);

        let bikesPetrolCost = bikesPetrolConsumption * this.fleetData.generalInfo.petrolPrice;
        let bikesElecCost = bikesElecConsumption * this.fleetData.generalInfo.elecPrice;
        let elecBikeFuelSavings = bikesPetrolCost - bikesElecCost;

        let petrolBikeCO2Emissions = bikesPetrolConsumption * this.emissionFactors.petrolCO2perLtr;
        let elecBikeCO2Emissions = bikesElecConsumption * (1 - emFactor.batteryElectric.carbonDioxide);
        let elecBikeCo2Savings = petrolBikeCO2Emissions - elecBikeCO2Emissions;

        let eBikePaybackPeriod = eBikesExtraCost / (((bikesPetrolConsumption * this.fleetData.generalInfo.petrolPrice)
            - (bikesElecConsumption * this.fleetData.generalInfo.elecPrice)) / twoFourStrokeSumVehicles);

        return {twoFourStrokeSumVehicles:twoFourStrokeSumVehicles,twoFourStrokeSumMileage:twoFourStrokeSumMileage,bikesPetrolConsumption:bikesPetrolConsumption,bikesPetrolCost:bikesPetrolCost,bikesElecCost:bikesElecCost,
            elecBikeFuelSavings:elecBikeFuelSavings,petrolBikeCO2Emissions:petrolBikeCO2Emissions,elecBikeCo2Savings:elecBikeCo2Savings,bikesElecConsumption:bikesElecConsumption,elecBikeCO2Emissions:elecBikeCO2Emissions,eBikePaybackPeriod:eBikePaybackPeriod};
    }



    switchToNewTrucks(): any {
        let emFactor = this.getElectricEmissionFactor(this.fleetData.generalInfo.fossilFuelElec).emFactor;
        let bevTrucksKmPerKWh = this.fleetData.actionsRecommended.switchToNewTrucks.bevTrucksKmPerKWh ? this.fleetData.actionsRecommended.switchToNewTrucks.bevTrucksKmPerKWh : 6.4;
        let numPreEuro3Trucks = Number(this.fleetData.lDVsGasoline.preEuro.numVehicles|| 0) + Number(this.fleetData.lDVsGasoline.euro1.numVehicles|| 0) + Number(this.fleetData.lDVsGasoline.euro2.numVehicles|| 0) + Number(this.fleetData.lDVsDiesel.preEuro.numVehicles || 0) + Number(this.fleetData.lDVsDiesel.euro1.numVehicles || 0) + Number(this.fleetData.lDVsDiesel.euro2.numVehicles || 0) + Number(this.fleetData.mDVsDiesel.preEuro.numVehicles || 0) + Number(this.fleetData.mDVsDiesel.euro1.numVehicles || 0) + Number(this.fleetData.mDVsDiesel.euro2.numVehicles || 0);
        let preEuro3TrucksAnnualMileage = Number(this.fleetData.lDVsGasoline.preEuro.annualMileage|| 0) + Number(this.fleetData.lDVsGasoline.euro1.annualMileage|| 0) + Number(this.fleetData.lDVsGasoline.euro2.annualMileage|| 0) + Number(this.fleetData.lDVsDiesel.preEuro.annualMileage || 0) + Number(this.fleetData.lDVsDiesel.euro1.annualMileage || 0) + Number(this.fleetData.lDVsDiesel.euro2.annualMileage || 0) + Number(this.fleetData.mDVsDiesel.preEuro.annualMileage || 0) + Number(this.fleetData.mDVsDiesel.euro1.annualMileage || 0) + Number(this.fleetData.mDVsDiesel.euro2.annualMileage || 0);
        let preEuro3TrucksPetrolConsumption = Number(this.fleetData.lDVsGasoline.preEuro.annualFuel || 0) + Number(this.fleetData.lDVsGasoline.euro1.annualFuel || 0) + Number(this.fleetData.lDVsGasoline.euro2.annualFuel || 0);
        let preEuro3TrucksDieselConsumption = Number(this.fleetData.lDVsDiesel.preEuro.annualFuel || 0) + Number(this.fleetData.lDVsDiesel.euro1.annualFuel || 0) + Number(this.fleetData.lDVsDiesel.euro2.annualFuel || 0) + Number(this.fleetData.mDVsDiesel.preEuro.annualFuel || 0) + Number(this.fleetData.mDVsDiesel.euro1.annualFuel || 0) + Number(this.fleetData.mDVsDiesel.euro2.annualFuel || 0);

        let hEVtrucksFuelConsumption = 0.7 * (preEuro3TrucksPetrolConsumption + preEuro3TrucksDieselConsumption);
        let euro5trucksPetrolConsumption = 0.9 * preEuro3TrucksPetrolConsumption;

        let	preEuro3TrucksFuelCost = (preEuro3TrucksPetrolConsumption * this.fleetData.generalInfo.petrolPrice) + (preEuro3TrucksDieselConsumption * this.fleetData.generalInfo.dieselPrice);
        let hevTrucksFuelCost = (0.7 * (preEuro3TrucksPetrolConsumption + preEuro3TrucksDieselConsumption)) * this.fleetData.generalInfo.petrolPrice;
        let bevTrucksFuelCost = (preEuro3TrucksAnnualMileage * this.fleetData.generalInfo.elecPrice) / bevTrucksKmPerKWh;
        let euro5trucksFuelCost = ((0.9 * preEuro3TrucksPetrolConsumption) * this.fleetData.generalInfo.petrolPrice) + ((0.9 * preEuro3TrucksDieselConsumption) * this.fleetData.generalInfo.dieselPrice);
        let preEuro3TrucksCO2Emissions = Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.preEuro,this.fleetData.lDVsGasoline.preEuro,this.emissionFactors.petrolCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro1,this.fleetData.lDVsGasoline.euro1,this.emissionFactors.petrolCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro2,this.fleetData.lDVsGasoline.euro2,this.emissionFactors.petrolCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.preEuro,this.fleetData.lDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro1,this.fleetData.lDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro2,this.fleetData.lDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.preEuro,this.fleetData.mDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro1,this.fleetData.mDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro2,this.fleetData.mDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0);
        let bevTrucksCO2Emissions = preEuro3TrucksCO2Emissions * (1 - emFactor.batteryElectric.carbonDioxide);
        let euro5TrucksCO2Emissions = ((0.9 * preEuro3TrucksPetrolConsumption) * this.emissionFactors.petrolCO2perLtr) + ((0.9 * preEuro3TrucksDieselConsumption) * this.emissionFactors.dieselCO2perLtr);
        let numPreEuro3HDV = Number(this.fleetData.hDVsDiesel.preEuro.numVehicles || 0) + Number(this.fleetData.hDVsDiesel.euro1.numVehicles || 0) + Number(this.fleetData.hDVsDiesel.euro2.numVehicles || 0);
        let preEuro3HDVAnnualMileage = Number(this.fleetData.hDVsDiesel.preEuro.annualMileage || 0) + Number(this.fleetData.hDVsDiesel.euro1.annualMileage || 0) + Number(this.fleetData.hDVsDiesel.euro2.annualMileage || 0);
        let preEuro3HDVDieselConsumption = Number(this.fleetData.hDVsDiesel.preEuro.annualFuel || 0) + Number(this.fleetData.hDVsDiesel.euro1.annualFuel || 0) + Number(this.fleetData.hDVsDiesel.euro2.annualFuel || 0);
        let hdvPreEuro3CO2Emissions = Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.preEuro,this.fleetData.hDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro1,this.fleetData.hDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0) +Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro2,this.fleetData.hDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr).carbonDioxide || 0);
        let hdvPreEuro3FuelCost = preEuro3HDVDieselConsumption * this.fleetData.generalInfo.dieselPrice;
        let hdvHevFuelCost = (0.7 * preEuro3HDVDieselConsumption) * this.fleetData.generalInfo.dieselPrice;
        let hdvEuro5FuelCost = (0.9 * preEuro3HDVDieselConsumption) * this.fleetData.generalInfo.dieselPrice;

        return {numPreEuro3Trucks:numPreEuro3Trucks,preEuro3TrucksAnnualMileage:preEuro3TrucksAnnualMileage,preEuro3TrucksPetrolConsumption:preEuro3TrucksPetrolConsumption,preEuro3TrucksDieselConsumption:preEuro3TrucksDieselConsumption,hEVtrucksFuelConsumption:hEVtrucksFuelConsumption,euro5trucksPetrolConsumption:euro5trucksPetrolConsumption,preEuro3TrucksFuelCost:preEuro3TrucksFuelCost,hevTrucksFuelCost:hevTrucksFuelCost,
            bevTrucksFuelCost:bevTrucksFuelCost,euro5trucksFuelCost:euro5trucksFuelCost,preEuro3TrucksCO2Emissions:preEuro3TrucksCO2Emissions,bevTrucksCO2Emissions:bevTrucksCO2Emissions,euro5TrucksCO2Emissions:euro5TrucksCO2Emissions,numPreEuro3HDV:numPreEuro3HDV,preEuro3HDVAnnualMileage:preEuro3HDVAnnualMileage,
            preEuro3HDVDieselConsumption:preEuro3HDVDieselConsumption,hdvPreEuro3FuelCost:hdvPreEuro3FuelCost,hdvHevFuelCost:hdvHevFuelCost,hdvEuro5FuelCost:hdvEuro5FuelCost,hdvPreEuro3CO2Emissions:hdvPreEuro3CO2Emissions};
    }

    retrofitTrucks(): any {
        let preEuroTrucksnBusesPM10Emissions = Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.preEuro,this.fleetData.lDVsGasoline.preEuro,this.emissionFactors.petrolCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.preEuro,this.fleetData.lDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.preEuro,this.fleetData.mDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.preEuro,this.fleetData.hDVsDiesel.preEuro,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0);
        let euro1n2TrucksnBusesPM10Emissions = Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro1,this.fleetData.lDVsGasoline.euro1,this.emissionFactors.petrolCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro2,this.fleetData.lDVsGasoline.euro2,this.emissionFactors.petrolCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro1,this.fleetData.lDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro2,this.fleetData.lDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro1,this.fleetData.mDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro2,this.fleetData.mDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro1,this.fleetData.hDVsDiesel.euro1,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro2,this.fleetData.hDVsDiesel.euro2,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0);
        let euro3n4TrucksnBusesPM10Emissions = Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro3,this.fleetData.lDVsGasoline.euro3,this.emissionFactors.petrolCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro4,this.fleetData.lDVsGasoline.euro4,this.emissionFactors.petrolCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro3,this.fleetData.lDVsDiesel.euro3,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro4,this.fleetData.lDVsDiesel.euro4,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro3,this.fleetData.mDVsDiesel.euro3,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro4,this.fleetData.mDVsDiesel.euro4,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro3,this.fleetData.hDVsDiesel.euro3,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro4,this.fleetData.hDVsDiesel.euro4,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0);
        let euro5n6TrucksnBusesPM10Emissions = Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro5,this.fleetData.lDVsGasoline.euro5,this.emissionFactors.petrolCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyGasoline.euro6,this.fleetData.lDVsGasoline.euro6,this.emissionFactors.petrolCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro5,this.fleetData.lDVsDiesel.euro5,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.lightDutyDiesel.euro6,this.fleetData.lDVsDiesel.euro6,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro5,this.fleetData.mDVsDiesel.euro5,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.mediumDutyDiesel.euro6,this.fleetData.mDVsDiesel.euro6,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro5,this.fleetData.hDVsDiesel.euro5,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0) + Number(this.getEmissions(false,true,true,this.emissionFactors.heavyDutyDiesel.euro6,this.fleetData.hDVsDiesel.euro6,this.emissionFactors.dieselCO2perLtr).particulateMatter || 0);
        // this is what Steve has done
        let totalTrucksnBusesPM10Emissions = this.lDVsGasolineEmissions().sumEmissions.particulateMatter + this.lDVsDieselEmissions().sumEmissions.particulateMatter + this.mDVsDieselEmissions().sumEmissions.particulateMatter + this.hDVsDieselEmissions().sumEmissions.particulateMatter;
        // from the calculations though it is this
        // let totalTrucksnBusesPM10Emissions = preEuroTrucksnBusesPM10Emissions + euro1n2TrucksnBusesPM10Emissions + euro3n4TrucksnBusesPM10Emissions + euro5n6TrucksnBusesPM10Emissions;
        let differencePM10Emissions = totalTrucksnBusesPM10Emissions - preEuroTrucksnBusesPM10Emissions;
        let sumPM10Emissions = euro3n4TrucksnBusesPM10Emissions + euro5n6TrucksnBusesPM10Emissions;
        let textDocRecommendation = this.fleetData.generalInfo.sulphurLevel > 500 ? "not recommended" : "not a problem";
        let textDpfRecommendation = this.fleetData.generalInfo.sulphurLevel > 50 ? "not recommended" : "not a problem";
        return {preEuroTrucksnBusesPM10Emissions:preEuroTrucksnBusesPM10Emissions,euro1n2TrucksnBusesPM10Emissions:euro1n2TrucksnBusesPM10Emissions,euro3n4TrucksnBusesPM10Emissions:euro3n4TrucksnBusesPM10Emissions,euro5n6TrucksnBusesPM10Emissions:euro5n6TrucksnBusesPM10Emissions,totalTrucksnBusesPM10Emissions:totalTrucksnBusesPM10Emissions,
            differencePM10Emissions:differencePM10Emissions,sumPM10Emissions:sumPM10Emissions,textDocRecommendation:textDocRecommendation,textDpfRecommendation:textDpfRecommendation};
    }

    // changed
    generatorAlternatives(): any {
        let siteElectricityDemand = this.fleetData.actionsRecommended.generatorAlternatives.electricityDemand ? this.fleetData.actionsRecommended.generatorAlternatives.electricityDemand : 10;
        let pvItemsCost = this.fleetData.actionsRecommended.generatorAlternatives.pvItemsCost ? this.fleetData.actionsRecommended.generatorAlternatives.pvItemsCost : 3260;
        let totalSolarSystemCost = Number(siteElectricityDemand || 0) * Number(pvItemsCost || 0);
        let pvSystemPaybackPeriod = totalSolarSystemCost / (Number(this.getGeneratorsTotals().annualFuel) * this.fleetData.generalInfo.dieselPrice);
        return {siteElectricityDemand:siteElectricityDemand, pvItemsCost:pvItemsCost, totalSolarSystemCost:totalSolarSystemCost, pvSystemPaybackPeriod:pvSystemPaybackPeriod};
    }

    offsettingCO2Emissions(): any {
        let areaSidesLow = Math.sqrt((((this.getAllTotals().carbonDioxide * 1) / 1000)/1000)) / 10;
        let areaSidesHigh = Math.sqrt((((this.getAllTotals().carbonDioxide * 7) / 1000)/1000)) / 10;
        return {areaSidesLow:areaSidesLow,areaSidesHigh:areaSidesHigh};
    }

    // saving the state of active tabs
    setLastViewedTab(clickedParentTab:string,clickedChildTab:string){

        this.refreshGraphs();

        this.currentActiveTabs.parentTab = clickedParentTab;
        this.currentActiveTabs.childTab = clickedChildTab;

        this.mySession.setItem(this.currentActiveTabsStringConst, JSON.stringify(this.currentActiveTabs));
    }





    exportAndDownloadCsv() {
        // is the form valid or not
        if(this.generalInfoForm['controls'].generalInfo['controls'].fleetName.invalid){
            this.toastr.error('Please enter a fleet name in the General Information section',
                'Error Saving Data',
                {
                    toastLife: 5000,
                    newestOnTop:true
                });
            return;
        }else{
            let fleetName:string = this.fleetData.generalInfo.fleetName;
            fleetName = fleetName.replace(/\s/g, '');
            fleetName = fleetName.replace(/[^A-Za-z0-9]+ ]/g, '').toLowerCase();
            this.exportCSVFile(this.fleetData,fleetName);
            // call the exportCSVFile() function to process the JSON and trigger the download
        }


    }

    exportCSVFile(dataToExport, fileTitle) {
        const jsonObject = JSON.stringify(dataToExport);
        const csv = this.convertToCSV(jsonObject);
        const exportedFilenmae = fileTitle + '.csv' || 'export.csv';

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }




    convertToCSV(objArray) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str: any = '';

        for (let key in array) {
            let x = Object.keys(array).indexOf(key);
            let newheader: any = [];
            let newline: any = '';
            if (x === 0) {
                str += key + '\r\n';
                for (let ind in array[key]) {
                    if (newline !== '') {
                        newline += ',';
                    }
                    newheader += ind + ',';
                    newline += array[key][ind];
                }

                str += newheader + '\r\n';
                str += newline + '\r\n';
            }

            // the ones below
            // lets deal with the actionsRecommended later
            let key_2: any;
            if (x >= 1 && key !=='actionsRecommended') {
                str += key + '\r\n';
                for (key_2 in array[key]) {
                    newheader = [];
                    newline = '';
                    if (array[key].hasOwnProperty(key_2) && Object.keys(array[key][key_2]).length !== 0) {
                        str += key_2 + '\r\n';
                        for (const inner_key_2 in array[key][key_2]) {


                            if (array[key][key_2].hasOwnProperty(inner_key_2)) { // && Object.keys(array[key][key_2][inner_key_2]).length !== 0
                                // there is a special case in petrol that needs handling later
                                if(key_2 === 'petrol'){
                                    newheader += 'numVehicles' + ','+'annualMileage' + ','+'annualFuel' + ',';
                                }else{
                                    newheader += inner_key_2 + ',';
                                }
                                if (newline !== '') {
                                    newline += ',';
                                }
                                newline += array[key][key_2][inner_key_2];
                            }else{
                                newheader += 'numVehicles'+','+'annualMileage'+','+'annualFuel' + ',';
                                if (newline !== '') {
                                    newline += ',';
                                }
                                newline += '';
                            }
                        }
                        str += newheader + '\r\n';
                        str += newline + '\r\n';
                        // str += '\r\n';
                    }else{
                        str += key_2 + '\r\n';
                        str += 'numVehicles'+','+'annualMileage'+','+'annualFuel' + ',' + '\r\n';
                        //  the data
                        str += '0'+','+'0'+','+'0' + ',' + '\r\n';

                    }
                }
            }
            str += '\r\n';
        }
        return str;
    }

    ngAfterViewInit() {
        // set up all the forms with this
        // save to session storage

        this.generalInfoForm.valueChanges.subscribe(data => {
            this.saveSessionFleetData(data,false);
            this.refreshGraphs();
        });
    }

    private refreshGraphs() {
        //set the totals for the strategy checklist page
        this.fleetDataService.emitCurrentFleetTotals({
            carbonMonoxide:this.getAllTotals().carbonMonoxide,
            volatileOrganic:this.getAllTotals().volatileOrganic,
            nitrousOxide:this.getAllTotals().nitrousOxide,
            sulphurOxide:this.getAllTotals().sulphurOxide,
            particulateMatter:this.getAllTotals().particulateMatter,
            carbonDioxide:this.getAllTotals().carbonDioxide,
            totalGasolineFuel:this.getAllTotals().totalGasolineFuel,
            totalDieselFuel:this.getAllTotals().totalDieselFuel,
            fuelSulphurLevel:this.fleetData.generalInfo.sulphurLevel
        });

        // switch To Bevs BarChartData
        // petrol and diesel charts
        let switchToHeVPetrolDieselClone = JSON.parse(JSON.stringify(this.switchToHeVPetrolDieselBarChartData));

        switchToHeVPetrolDieselClone[0].data = [
            this.switchToHeVOrBev(true).passengerPetrolConsumption,
            this.switchToHeVOrBev(true).passengerDieselConsumption
        ];
        switchToHeVPetrolDieselClone[1].data = [
            Number(this.switchToHeVOrBev(true).hEVFuelConsumption || 0),
            0
        ];
        switchToHeVPetrolDieselClone[2].data = [
            Number(this.switchToHeVOrBev(true).hEVFuelSavings || 0),
            0
        ];
        this.switchToHeVPetrolDieselBarChartData = switchToHeVPetrolDieselClone;

        // fuel cost chart
        let switchToHeVFuelCostBarClone = JSON.parse(JSON.stringify(this.switchToHeVFuelCostBarChartData));
        switchToHeVFuelCostBarClone[0].data = [
            this.switchToHeVOrBev(true).hevCurrentFuelCost
        ];
        switchToHeVFuelCostBarClone[1].data = [
            this.switchToHeVOrBev(true).hevSwitchFuelCost
        ];
        switchToHeVFuelCostBarClone[2].data = [
            this.switchToHeVOrBev(true).hEVFuelCostSavingsPerYear
        ];
        // let switchToHeVFuelCostLabel = switchToHeVFuelCostBarClone[0].label;
        this.switchToHeVFuelCostBarChartLabels[0] = 'FuelCost ('+this.fleetData.generalInfo.localCurrency+'/yr)';
        this.switchToHeVFuelCostBarChartData = switchToHeVFuelCostBarClone;

        // CO2 Emissions chart
        let switchToHeVCO2EmissionsBarClone = JSON.parse(JSON.stringify(this.switchToHeVCO2EmissionsBarChartData));
        switchToHeVCO2EmissionsBarClone[0].data = [
            this.switchToHeVOrBev(true).hevCurrentCO2
        ];
        switchToHeVCO2EmissionsBarClone[1].data = [
            this.switchToHeVOrBev(true).hevSwitchCO2
        ];
        switchToHeVCO2EmissionsBarClone[2].data = [
            this.switchToHeVOrBev(true).hevCO2Saving
        ];
        this.switchToHeVCO2EmissionsBarChartData = switchToHeVCO2EmissionsBarClone;



        // switch To Hevs BarChartData
        // petrol and diesel charts
        let switchToBevPetrolDieselClone = JSON.parse(JSON.stringify(this.switchToBeVPetrolDieselBarChartData));

        switchToBevPetrolDieselClone[0].data = [
            this.switchToHeVOrBev(false).passengerPetrolConsumption,
            this.switchToHeVOrBev(false).passengerDieselConsumption
        ];
        switchToBevPetrolDieselClone[1].data = [
            Number(this.switchToHeVOrBev(false).hEVFuelConsumption || 0),
            0
        ];
        switchToBevPetrolDieselClone[2].data = [
            Number(this.switchToHeVOrBev(false).hEVFuelSavings || 0),
            0
        ];
        this.switchToBeVPetrolDieselBarChartData = switchToBevPetrolDieselClone;

        // fuel cost chart
        let switchToBeVFuelCostBarClone = JSON.parse(JSON.stringify(this.switchToBeVFuelCostBarChartData));
        switchToBeVFuelCostBarClone[0].data = [
            this.switchToHeVOrBev(false).hevCurrentFuelCost
        ];
        switchToBeVFuelCostBarClone[1].data = [
            this.switchToHeVOrBev(false).hevSwitchFuelCost
        ];
        switchToBeVFuelCostBarClone[2].data = [
            this.switchToHeVOrBev(false).hEVFuelCostSavingsPerYear
        ];
        // let switchToBeVFuelCostLabel = switchToBeVFuelCostBarClone[0].label;
        this.switchToBeVFuelCostBarChartLabels[0] = 'FuelCost ('+this.fleetData.generalInfo.localCurrency+'/yr)';
        this.switchToBeVFuelCostBarChartData = switchToBeVFuelCostBarClone;

        // CO2 Emissions chart
        let switchToBeVCO2EmissionsBarClone = JSON.parse(JSON.stringify(this.switchToBeVCO2EmissionsBarChartData));
        switchToBeVCO2EmissionsBarClone[0].data = [
            this.switchToHeVOrBev(false).hevCurrentCO2
        ];
        switchToBeVCO2EmissionsBarClone[1].data = [
            this.switchToHeVOrBev(false).hevSwitchCO2
        ];
        switchToBeVCO2EmissionsBarClone[2].data = [
            this.switchToHeVOrBev(false).hevCO2Saving
        ];
        this.switchToBeVCO2EmissionsBarChartData = switchToBeVCO2EmissionsBarClone;


        let switchToBevClone = JSON.parse(JSON.stringify(this.switchToBevBarChartData));

        switchToBevClone[0].data = [
            this.switchToHeVOrBev(false).passengerPetrolConsumption,
            this.switchToHeVOrBev(false).passengerDieselConsumption,
            this.switchToHeVOrBev(false).hevCurrentFuelCost,
            this.switchToHeVOrBev(false).hevCurrentCO2
        ];
        switchToBevClone[1].data = [
            (Number(this.switchToHeVOrBev(false).hEVFuelConsumption || 0)),
            0,
            Number(this.switchToHeVOrBev(false).hevSwitchFuelCost || 0),
            Number(this.switchToHeVOrBev(false).hevSwitchCO2 || 0)
        ];
        switchToBevClone[2].data = [
            (Number(this.switchToHeVOrBev(false).hEVFuelConsumption || 0)),
            0,
            Number(this.switchToHeVOrBev(false).hEVFuelCostSavingsPerYear || 0),
            Number(this.switchToHeVOrBev(false).hevCO2Saving || 0)
        ];

        this.switchToBevBarChartData = switchToBevClone;


        // switch To 4 Stroke Bar Chart Data
        // switchTo4StrokeBarChartData

        // VOCs Emitted
        let switchTo4StrokeVOCsClone = JSON.parse(JSON.stringify(this.switchTo4StrokeVOCsBarChartData));
        switchTo4StrokeVOCsClone[0].data = [
            this.motorCyclesEmissions().twoStrokeEmissions.volatileOrganic
        ];

        switchTo4StrokeVOCsClone[1].data = [
            this.switchToFourStroke().switchFourStrokeBikesVOCs
        ];

        switchTo4StrokeVOCsClone[2].data = [
            this.switchToFourStroke().switchFourStrokeBikesVOCSavings
        ];
        this.switchTo4StrokeVOCsBarChartData = switchTo4StrokeVOCsClone;

        // 4 stroke fuel costs low and high scenarios
        let switchTo4StrokeFuelCosts4StrokeLowHighClone = JSON.parse(JSON.stringify(this.switchTo4StrokeFuelCosts4StrokeLowHighBarChartData));
        switchTo4StrokeFuelCosts4StrokeLowHighClone[0].data = [
            Number(this.switchToFourStroke().mBike2StrokeFuel * 0.85 || 0)
        ];

        switchTo4StrokeFuelCosts4StrokeLowHighClone[1].data = [
            Number(this.switchToFourStroke().mBike2StrokeFuel * 0.6 || 0)
        ];
        this.switchTo4StrokeFuelCosts4StrokeLowHighBarChartLabels[0]='Fuel Cost ('+this.fleetData.generalInfo.localCurrency+')';
        this.switchTo4StrokeFuelCosts4StrokeLowHighBarChartData = switchTo4StrokeFuelCosts4StrokeLowHighClone;

        // 4 stroke fuel savings low and high scenarios
        let switchTo4StrokeFuelSavingsLowHighClone = JSON.parse(JSON.stringify(this.switchTo4StrokeFuelSavingsLowHighBarChartData));
        switchTo4StrokeFuelSavingsLowHighClone[0].data = [
            Number(this.switchToFourStroke().mBike2StrokeFuel * 0.15 || 0)
        ];

        switchTo4StrokeFuelSavingsLowHighClone[1].data = [
            Number(this.switchToFourStroke().mBike2StrokeFuel * 0.4 || 0)
        ];
        this.switchTo4StrokeFuelSavingsLowHighBarChartLabels[0]='Fuel Cost Savings ('+this.fleetData.generalInfo.localCurrency+')';
        this.switchTo4StrokeFuelSavingsLowHighBarChartData = switchTo4StrokeFuelSavingsLowHighClone;

        //PMs Emitted
        let switchTo4StrokePMsClone = JSON.parse(JSON.stringify(this.switchTo4StrokePMsBarChartData));
        switchTo4StrokePMsClone[0].data = [
            this.motorCyclesEmissions().twoStrokeEmissions.particulateMatter
        ];

        switchTo4StrokePMsClone[1].data = [
            this.switchToFourStroke().switchFourStrokeBikesPM10
        ];

        switchTo4StrokePMsClone[2].data = [
            this.switchToFourStroke().switchFourStrokeBikesPM10Savings
        ];
        this.switchTo4StrokePMsBarChartData = switchTo4StrokePMsClone;

        //Fuel Costs
        let switchTo4StrokeFuelCostsClone = JSON.parse(JSON.stringify(this.switchTo4StrokeFuelCostsBarChartData));
        switchTo4StrokeFuelCostsClone[0].data = [
            this.switchToFourStroke().mBike2StrokeFuel
        ];
        switchTo4StrokeFuelCostsClone[0].label = '2-Stroke ('+this.fleetData.generalInfo.localCurrency+'/yr)';

        switchTo4StrokeFuelCostsClone[1].data = [
            this.switchToFourStroke().mBike2StrokeFuel * 0.15
        ];
        switchTo4StrokeFuelCostsClone[1].label = '4-Stroke ('+this.fleetData.generalInfo.localCurrency+'/yr)';

        switchTo4StrokeFuelCostsClone[2].data = [
            this.switchToFourStroke().mBike2StrokeFuel * 0.4
        ];
        switchTo4StrokeFuelCostsClone[2].label = 'Savings ('+this.fleetData.generalInfo.localCurrency+'/yr)';
        this.switchTo4StrokeFuelCostsBarChartData = switchTo4StrokeFuelCostsClone;




        let switchTo4StrokeClone = JSON.parse(JSON.stringify(this.switchTo4StrokeBarChartData));
        switchTo4StrokeClone[0].data = [
            this.motorCyclesEmissions().twoStrokeEmissions.volatileOrganic,
            this.switchToFourStroke().switchFourStrokeBikesVOCs
        ];
        switchTo4StrokeClone[1].data = [
            this.motorCyclesEmissions().twoStrokeEmissions.particulateMatter,
            this.switchToFourStroke().switchFourStrokeBikesPM10
        ];

        this.switchTo4StrokeBarChartData = switchTo4StrokeClone;

        /*
            Switch to New Trucks Charts
        */

        //CO2 Emissions
        let switchToNewTrucksPreEuroLMDVCO2EmissionsClone = JSON.parse(JSON.stringify(this.switchToNewTrucksPreEuroLMDVCO2EmissionsBarChartData));

        switchToNewTrucksPreEuroLMDVCO2EmissionsClone[0].data = [
            Number(this.switchToNewTrucks().preEuro3TrucksCO2Emissions || 0)

        ];
        switchToNewTrucksPreEuroLMDVCO2EmissionsClone[1].data = [
            Number( (0.7 * (this.switchToNewTrucks().preEuro3TrucksPetrolConsumption + this.switchToNewTrucks().preEuro3TrucksDieselConsumption)) || 0)

        ];
        switchToNewTrucksPreEuroLMDVCO2EmissionsClone[2].data = [
            Number(this.switchToNewTrucks().bevTrucksCO2Emissions || 0)

        ];
        switchToNewTrucksPreEuroLMDVCO2EmissionsClone[3].data = [
            Number(this.switchToNewTrucks().euro5TrucksCO2Emissions || 0)
        ];
        this.switchToNewTrucksPreEuroLMDVCO2EmissionsBarChartData = switchToNewTrucksPreEuroLMDVCO2EmissionsClone;

        let switchToNewTrucksPreEuroHDVCO2EmissionsClone = JSON.parse(JSON.stringify(this.switchToNewTrucksPreEuroHDVCO2EmissionsBarChartData));

        switchToNewTrucksPreEuroHDVCO2EmissionsClone[0].data = [
            Number(this.switchToNewTrucks().hdvPreEuro3CO2Emissions || 0)

        ];
        switchToNewTrucksPreEuroHDVCO2EmissionsClone[1].data = [
            Number( ((0.7 * this.switchToNewTrucks().preEuro3HDVDieselConsumption) * this.emissionFactors.dieselCO2perLtr) || 0)

        ];
        switchToNewTrucksPreEuroHDVCO2EmissionsClone[2].data = [
            Number(this.switchToNewTrucks().hdvPreEuro3CO2Emissions * 0.95 || 0)

        ];
        switchToNewTrucksPreEuroHDVCO2EmissionsClone[3].data = [
            Number(((0.9 * this.switchToNewTrucks().preEuro3HDVDieselConsumption) * this.emissionFactors.dieselCO2perLtr) || 0)
        ];
        this.switchToNewTrucksPreEuroHDVCO2EmissionsBarChartData = switchToNewTrucksPreEuroHDVCO2EmissionsClone;

        //petrol consumption

        let switchToNewTrucksPreEuroLMDVPetrolClone = JSON.parse(JSON.stringify(this.switchToNewTrucksPreEuroLMDVPetrolBarChartData));

        switchToNewTrucksPreEuroLMDVPetrolClone[0].data = [
            Number(this.switchToNewTrucks().preEuro3TrucksPetrolConsumption || 0)

        ];
        switchToNewTrucksPreEuroLMDVPetrolClone[1].data = [
            Number(this.switchToNewTrucks().hEVtrucksFuelConsumption || 0)

        ];
        switchToNewTrucksPreEuroLMDVPetrolClone[2].data = [
            0

        ];
        switchToNewTrucksPreEuroLMDVPetrolClone[3].data = [
            Number(this.switchToNewTrucks().euro5trucksPetrolConsumption || 0)
        ];
        this.switchToNewTrucksPreEuroLMDVPetrolBarChartData = switchToNewTrucksPreEuroLMDVPetrolClone;

        //diesel consumption

        let switchToNewTrucksPreEuroHDVDieselClone = JSON.parse(JSON.stringify(this.switchToNewTrucksPreEuroHDVDieselBarChartData));

        switchToNewTrucksPreEuroHDVDieselClone[0].data = [
            Number(this.switchToNewTrucks().preEuro3HDVDieselConsumption || 0)

        ];
        switchToNewTrucksPreEuroHDVDieselClone[1].data = [
            Number(0.7 * this.switchToNewTrucks().preEuro3HDVDieselConsumption || 0)

        ];
        switchToNewTrucksPreEuroHDVDieselClone[2].data = [
            0

        ];
        switchToNewTrucksPreEuroHDVDieselClone[3].data = [
            Number(0.9 * this.switchToNewTrucks().preEuro3HDVDieselConsumption || 0)
        ];
        this.switchToNewTrucksPreEuroHDVDieselBarChartData = switchToNewTrucksPreEuroHDVDieselClone;


        /*
            Switch to Electric Motorcycles charts
         */
        //Petrol Consumption
        let switchToElectricMotorCyclesPetrolClone = JSON.parse(JSON.stringify(this.switchToElectricMotorCyclesPetrolBarChartData));

        switchToElectricMotorCyclesPetrolClone[0].data = [
            this.switchToElectricBikes().bikesPetrolConsumption

        ];
        switchToElectricMotorCyclesPetrolClone[1].data = [
            Number(this.switchToElectricBikes().bikesElecConsumption || 0)

        ];
        switchToElectricMotorCyclesPetrolClone[2].data = [
            0

        ];
        this.switchToElectricMotorCyclesPetrolBarChartData = switchToElectricMotorCyclesPetrolClone;

        //switchToElectricMotorCyclesFuelCostBarChartData
        //Fuel Cost
        let switchToElectricMotorCyclesFuelCostClone = JSON.parse(JSON.stringify(this.switchToElectricMotorCyclesFuelCostBarChartData));

        switchToElectricMotorCyclesFuelCostClone[0].data = [
            this.switchToElectricBikes().bikesPetrolCost

        ];
        switchToElectricMotorCyclesFuelCostClone[1].data = [
            Number(this.switchToElectricBikes().bikesElecCost || 0)

        ];
        switchToElectricMotorCyclesFuelCostClone[2].data = [
            Number(this.switchToElectricBikes().elecBikeFuelSavings || 0)
        ];
        this.switchToElectricMotorCyclesFuelCostBarChartLabels[0]='Fuel Cost ('+this.fleetData.generalInfo.localCurrency+')';
        this.switchToElectricMotorCyclesFuelCostBarChartData = switchToElectricMotorCyclesFuelCostClone;

        // CO2 Emissions
        let switchToElectricMotorCyclesCO2Clone = JSON.parse(JSON.stringify(this.switchToElectricMotorCyclesCO2BarChartData));

        switchToElectricMotorCyclesCO2Clone[0].data = [
            this.switchToElectricBikes().petrolBikeCO2Emissions

        ];
        switchToElectricMotorCyclesCO2Clone[1].data = [
            Number(this.switchToElectricBikes().elecBikeCO2Emissions || 0)

        ];
        switchToElectricMotorCyclesCO2Clone[2].data = [
            Number(this.switchToElectricBikes().elecBikeCo2Savings || 0)

        ];
        this.switchToElectricMotorCyclesCO2BarChartData = switchToElectricMotorCyclesCO2Clone;

        let switchToElectricMotorCyclesClone = JSON.parse(JSON.stringify(this.switchToElectricMotorCyclesBarChartData));

        switchToElectricMotorCyclesClone[0].data = [
            this.switchToElectricBikes().bikesPetrolConsumption,
            this.switchToElectricBikes().bikesPetrolCost

        ];
        switchToElectricMotorCyclesClone[1].data = [
            Number(this.switchToElectricBikes().bikesElecConsumption || 0),
            Number(this.switchToElectricBikes().bikesElecCost || 0)

        ];
        this.switchToElectricMotorCyclesBarChartLabels[1] = 'Fuel Cost ('+this.fleetData.generalInfo.localCurrency+'/yr)';
        this.switchToElectricMotorCyclesBarChartData = switchToElectricMotorCyclesClone;

        /*
            Retrofiting Trucks charts
        */
        let retroFittingTrucksDOCClone = JSON.parse(JSON.stringify(this.retroFittingTrucksDOCBarChartData));
        retroFittingTrucksDOCClone[0].data = [
            Number((0.8 * this.retrofitTrucks().differencePM10Emissions) || 0),
            Number((0.2 * this.retrofitTrucks().differencePM10Emissions) || 0)

        ];
        retroFittingTrucksDOCClone[1].data = [
            Number((0.6 * this.retrofitTrucks().differencePM10Emissions) || 0),
            Number((0.4 * this.retrofitTrucks().differencePM10Emissions) || 0)
        ];
        this.retroFittingTrucksDOCBarChartData = retroFittingTrucksDOCClone;

        let retroFittingTrucksDPFClone = JSON.parse(JSON.stringify(this.retroFittingTrucksDPFBarChartData));
        retroFittingTrucksDPFClone[0].data = [
            Number((0.4 * this.retrofitTrucks().sumPM10Emissions) || 0),
            Number((0.6 * this.retrofitTrucks().sumPM10Emissions) || 0)

        ];
        retroFittingTrucksDPFClone[1].data = [
            Number((0.1 * this.retrofitTrucks().sumPM10Emissions) || 0),
            Number((0.9 * this.retrofitTrucks().sumPM10Emissions) || 0)
        ];
        this.retroFittingTrucksDPFBarChartData = retroFittingTrucksDPFClone;

        let retroFittingTrucksDOCSavingsDoughnutClone = JSON.parse(JSON.stringify(this.retroFittingTrucksDOCSavingsDoughnutChartData));
        retroFittingTrucksDOCSavingsDoughnutClone = [
            Number(0.2 * this.retrofitTrucks().differencePM10Emissions) || 0,
            Number(0.4 * this.retrofitTrucks().differencePM10Emissions) || 0
        ];
        this.retroFittingTrucksDOCSavingsDoughnutChartData = retroFittingTrucksDOCSavingsDoughnutClone;

        let retroFittingTrucksDPFSavingsDoughnutClone = JSON.parse(JSON.stringify(this.retroFittingTrucksDPFSavingsDoughnutChartData));
        retroFittingTrucksDPFSavingsDoughnutClone = [
            Number(0.6 * this.retrofitTrucks().sumPM10Emissions) || 0,
            Number(0.9 * this.retrofitTrucks().sumPM10Emissions) || 0
        ];

        this.retroFittingTrucksDPFSavingsDoughnutChartData = retroFittingTrucksDPFSavingsDoughnutClone;

        /*
            Eco-driving, Improved Maintenance &amp; Trip Sharing
            Eco Driving Charts
        */

        let ecoDrivingCanSaveClone = JSON.parse(JSON.stringify(this.ecoDrivingCanSaveBarChartData));
        ecoDrivingCanSaveClone[0].data = [
            Number(0.05 * this.ecoDriving().canSaveLow || 0)

        ];
        ecoDrivingCanSaveClone[1].data = [
            Number(0.1 * this.ecoDriving().canSaveHigh || 0)

        ];
        this.ecoDrivingCanSaveBarChartData = ecoDrivingCanSaveClone;

        this.ecoDrivingYouSaveBarChartLabels[0] = 'Fuel Budget';
        let ecoDrivingYouSaveBarClone = JSON.parse(JSON.stringify(this.ecoDrivingYouSaveBarChartData));
        ecoDrivingYouSaveBarClone[0].data = [
            Number(0.05 * this.ecoDriving().youSaveLow || 0)

        ];
        ecoDrivingYouSaveBarClone[1].data = [
            Number(0.1 * this.ecoDriving().youSaveHigh || 0)

        ];
        this.ecoDrivingYouSaveBarChartData = ecoDrivingYouSaveBarClone;

        this.ecoDrivingC02ReductionsBarChartLabels[0] = 'C02 Emissions';
        let ecoDrivingC02ReductionsBarClone = JSON.parse(JSON.stringify(this.ecoDrivingC02ReductionsBarChartData));
        ecoDrivingC02ReductionsBarClone[0].data = [
            Number(0.05 * this.ecoDriving().CO2ReduceLow || 0)

        ];
        ecoDrivingC02ReductionsBarClone[1].data = [
            Number(0.1 * this.ecoDriving().CO2ReduceHigh || 0)

        ];
        this.ecoDrivingC02ReductionsBarChartData = ecoDrivingC02ReductionsBarClone;

        /*
            Eco-driving, Improved Maintenance &amp; Trip Sharing
            Improved Maintenance Charts
        */
        let improvedMaintenanceCanSaveClone = JSON.parse(JSON.stringify(this.improvedMaintenanceCanSaveBarChartData));
        improvedMaintenanceCanSaveClone[0].data = [
            Number(0.04 * this.ecoDriving().canSaveLow || 0)

        ];
        improvedMaintenanceCanSaveClone[1].data = [
            Number(0.07 * this.ecoDriving().canSaveHigh || 0)
        ];
        this.improvedMaintenanceCanSaveBarChartData = improvedMaintenanceCanSaveClone;

        this.improvedMaintenanceYouSaveBarChartLabels[0] = 'Fuel Budget';
        let improvedMaintenanceYouSaveClone = JSON.parse(JSON.stringify(this.improvedMaintenanceYouSaveBarChartData));
        improvedMaintenanceYouSaveClone[0].data = [
            Number(0.04 * this.ecoDriving().youSaveLow || 0)

        ];
        improvedMaintenanceYouSaveClone[1].data = [
            Number(0.07 * this.ecoDriving().youSaveHigh || 0)
        ];
        this.improvedMaintenanceYouSaveBarChartData = improvedMaintenanceYouSaveClone;

        this.improvedMaintenanceC02ReductionsBarChartLabels[0] = 'C02 Emissions';
        let improvedMaintenanceC02ReductionsClone = JSON.parse(JSON.stringify(this.improvedMaintenanceC02ReductionsBarChartData));
        improvedMaintenanceC02ReductionsClone[0].data = [
            Number(0.04 * this.ecoDriving().CO2ReduceLow || 0)

        ];
        improvedMaintenanceC02ReductionsClone[1].data = [
            Number(0.07 * this.ecoDriving().CO2ReduceHigh || 0)
        ];
        this.improvedMaintenanceC02ReductionsBarChartData = improvedMaintenanceC02ReductionsClone;

        /*
            Eco-driving, Improved Maintenance &amp; Trip Sharing
            Air Conditioning Charts
        */
        let airConditioningCanSaveClone = JSON.parse(JSON.stringify(this.airConditioningCanSaveBarChartData));
        airConditioningCanSaveClone[0].data = [
            Number(0.05 * this.ecoDriving().canSaveLow || 0)
        ];
        airConditioningCanSaveClone[1].data = [
            Number(0.2 * this.ecoDriving().canSaveHigh || 0)
        ];
        this.airConditioningCanSaveBarChartData = airConditioningCanSaveClone;

        this.airConditioningYouSaveBarChartLabels[0] = 'Fuel Budget';
        let airConditioningYouSaveClone = JSON.parse(JSON.stringify(this.airConditioningYouSaveBarChartData));
        airConditioningYouSaveClone[0].data = [
            Number(0.05 * this.ecoDriving().youSaveLow || 0)

        ];
        airConditioningYouSaveClone[1].data = [
            Number(0.2 * this.ecoDriving().youSaveHigh || 0)
        ];
        this.airConditioningYouSaveBarChartData = airConditioningYouSaveClone;

        this.airConditioningC02ReductionsBarChartLabels[0] = 'C02 Emissions';
        let airConditioningC02ReductionsClone = JSON.parse(JSON.stringify(this.airConditioningC02ReductionsBarChartData));
        airConditioningC02ReductionsClone[0].data = [
            Number(0.05 * this.ecoDriving().CO2ReduceLow || 0)

        ];
        airConditioningC02ReductionsClone[1].data = [
            Number(0.2 * this.ecoDriving().CO2ReduceHigh || 0)
        ];
        this.airConditioningC02ReductionsBarChartData = airConditioningC02ReductionsClone;

        /*
            Switch To Cleaner Fuels Charts
        */
        let switchToCleanerFuelsSOxEmissionsClone = JSON.parse(JSON.stringify(this.switchToCleanerFuelsSOxEmissionsBarChartData));
        switchToCleanerFuelsSOxEmissionsClone[0].data = [
            Number(this.cleanerFuels().fleetSOxHighPPM || 0)
        ];
        switchToCleanerFuelsSOxEmissionsClone[1].data = [
            Number(this.cleanerFuels().fleetSOxLowPPM || 0)
        ];
        switchToCleanerFuelsSOxEmissionsClone[0].label = this.cleanerFuels().sulphurL1+'ppm' || '500ppm';
        switchToCleanerFuelsSOxEmissionsClone[1].label = this.cleanerFuels().sulphurL2+'ppm' || '50ppm';
        this.switchToCleanerFuelsSOxEmissionsBarChartData = switchToCleanerFuelsSOxEmissionsClone;


        let switchToCleanerFuelsSOxSavingsClone = JSON.parse(JSON.stringify(this.switchToCleanerFuelsSOxSavingsBarChartData));
        switchToCleanerFuelsSOxSavingsClone[0].data = [
            Number(this.cleanerFuels().sulphurL1SOx || 0)
        ];
        switchToCleanerFuelsSOxSavingsClone[1].data = [
            Number(this.cleanerFuels().sulphurL2SOx || 0)
        ];
        switchToCleanerFuelsSOxSavingsClone[0].label = this.cleanerFuels().sulphurL1+'ppm' || '500ppm';
        switchToCleanerFuelsSOxSavingsClone[1].label = this.cleanerFuels().sulphurL2+'ppm' || '50ppm';
        this.switchToCleanerFuelsSOxSavingsBarChartData = switchToCleanerFuelsSOxSavingsClone;


        let switchToCleanerFuelsClone = JSON.parse(JSON.stringify(this.switchToCleanerFuelsBarChartData));
        switchToCleanerFuelsClone[0].data = [
            Number(this.cleanerFuels().fleetSOxHighPPM || 0),
            Number(this.cleanerFuels().sulphurL1SOx || 0)

        ];
        switchToCleanerFuelsClone[1].data = [
            Number(this.cleanerFuels().fleetSOxLowPPM || 0),
            Number(this.cleanerFuels().sulphurL2SOx || 0)
        ];
        switchToCleanerFuelsClone[0].label = this.cleanerFuels().sulphurL1+'ppm' || '500ppm';
        switchToCleanerFuelsClone[1].label = this.cleanerFuels().sulphurL2+'ppm' || '50ppm';
        this.switchToCleanerFuelsBarChartData = switchToCleanerFuelsClone;


        let switchToCleanerFuelsClone1 = JSON.parse(JSON.stringify(this.switchToCleanerFuelsBarChartData1));
        switchToCleanerFuelsClone1[0].data = [
            Number(this.getAllTotals().sulphurOxide || 0),
            0,
            0
        ];
        switchToCleanerFuelsClone1[1].data = [
            0,
            Number(this.cleanerFuels().fleetSOxHighPPM || 0),
            0
        ];
        switchToCleanerFuelsClone1[2].data = [
            0,
            0,
            Number(this.cleanerFuels().fleetSOxLowPPM || 0)
        ];
        this.switchToCleanerFuelsBarChartLabels1[0] = 'Current';
        this.switchToCleanerFuelsBarChartLabels1[1] = this.cleanerFuels().sulphurL1+' ppm' || '500 ppm';
        this.switchToCleanerFuelsBarChartLabels1[2] = this.cleanerFuels().sulphurL2+' ppm' || '50 ppm';
        switchToCleanerFuelsClone1[1].label = 'Current';
        switchToCleanerFuelsClone1[1].label = this.cleanerFuels().sulphurL1+' ppm' || '500 ppm';
        switchToCleanerFuelsClone1[2].label = this.cleanerFuels().sulphurL2+' ppm' || '50 ppm';
        this.switchToCleanerFuelsBarChartData1 = switchToCleanerFuelsClone1;


        let switchToCleanerFuelsSOxEmissionsClone1 = JSON.parse(JSON.stringify(this.switchToCleanerFuelsSOxEmissionsBarChartData1));
        switchToCleanerFuelsSOxEmissionsClone1[0].data = [
            Number(this.getAllTotals().sulphurOxide || 0)
        ];
        switchToCleanerFuelsSOxEmissionsClone1[1].data = [
            Number(this.cleanerFuels().fleetSOxHighPPM || 0)
        ];
        switchToCleanerFuelsSOxEmissionsClone1[2].data = [
            Number(this.cleanerFuels().fleetSOxLowPPM || 0)
        ];
        switchToCleanerFuelsSOxEmissionsClone1[0].label = 'Current';;
        switchToCleanerFuelsSOxEmissionsClone1[2].label = this.cleanerFuels().sulphurL1+'ppm' || '500ppm';
        switchToCleanerFuelsSOxEmissionsClone1[2].label = this.cleanerFuels().sulphurL2+'ppm' || '50ppm';
        this.switchToCleanerFuelsSOxEmissionsBarChartData1 = switchToCleanerFuelsSOxEmissionsClone1;
    }


    //Darkhorse Customized
  

    onSavehev(fleetData: any){
        var sendFleet = fleetData;
        if(sendFleet.actionsRecommended.switchToHevs.hEVFuelEconomy == undefined || sendFleet.actionsRecommended.switchToHevs.hEVFuelEconomy == null)
            sendFleet.actionsRecommended.switchToHevs.hEVFuelEconomy = 0;
        if(sendFleet.actionsRecommended.switchToHevs.hEVAdditionalCostPerVehicle == undefined || sendFleet.actionsRecommended.switchToHevs.hEVAdditionalCostPerVehicle == null)
            sendFleet.actionsRecommended.switchToHevs.hEVAdditionalCostPerVehicle = 0;

        let headers = new Headers({
            'Content-Type': 'application/json'
        });
    
        let options = new RequestOptions({
            headers: headers
        });

        var send = {email:this.currentEmail, item1: sendFleet.actionsRecommended.switchToHevs.hEVFuelEconomy, 
                    item2: sendFleet.actionsRecommended.switchToHevs.hEVAdditionalCostPerVehicle};
        

        var sendData = JSON.stringify(send);
        
        console.log("this is my testing");
        console.log(sendData);

        this.http.post(this.hevurl, sendData, options).subscribe(data=>{
            var loge = data.json();
            console.log(loge);
        });


        this.toastr.success('Fleet data Saved Successfully!', "Success!!!",{
            toastLife: 2000,
            newestOnTop: true
        });

    }
    
    onSaveBev(fleetData: any){
        var sendFleet = fleetData;
        if(fleetData.actionsRecommended.switchToBEVs.bevCarsKmsPerKWh == undefined || fleetData.actionsRecommended.switchToBEVs.bevCarsKmsPerKWh == null)
            fleetData.actionsRecommended.switchToBEVs.bevCarsKmsPerKWh = 0;
        if(fleetData.actionsRecommended.switchToBEVs.bevCarsAdditionalCostPerVehicle == undefined || fleetData.actionsRecommended.switchToBEVs.bevCarsAdditionalCostPerVehicle == null)
            fleetData.actionsRecommended.switchToBEVs.bevCarsAdditionalCostPerVehicle = 0;
        
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
    
        let options = new RequestOptions({
            headers: headers
        });

        var send = {email:this.currentEmail, item1: fleetData.actionsRecommended.switchToBEVs.bevCarsKmsPerKWh, 
                    item2: fleetData.actionsRecommended.switchToBEVs.bevCarsAdditionalCostPerVehicle};
        
        var sendData = JSON.stringify(send);
        
        console.log("this is my testing");
        console.log(sendData);

        this.http.post(this.bevurl, sendData, options).subscribe(data=>{
            var loge = data.json();
            console.log(loge);
        });

        this.toastr.success('Fleet data Saved Successfully!', "Success!!!",{
            toastLife: 2000,
            newestOnTop: true
        });

    }

    onSaveElecMotor(fleetData: any){
        var sendFleet = fleetData;
        if(fleetData.actionsRecommended.switchElecMotor.elecBikesKmsPerKWh == undefined || fleetData.actionsRecommended.switchElecMotor.elecBikesKmsPerKWh == null)
            fleetData.actionsRecommended.switchElecMotor.elecBikesKmsPerKWh = 0;
        if(fleetData.actionsRecommended.switchElecMotor.elecBikesAdditionalCostPerbike == undefined || fleetData.actionsRecommended.switchElecMotor.elecBikesAdditionalCostPerbike == null)
            fleetData.actionsRecommended.switchElecMotor.elecBikesAdditionalCostPerbike = 0;
        
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
    
        let options = new RequestOptions({
            headers: headers
        });

        var send = {email:this.currentEmail, item1: fleetData.actionsRecommended.switchElecMotor.elecBikesKmsPerKWh, 
                    item2: fleetData.actionsRecommended.switchElecMotor.elecBikesAdditionalCostPerbike};
        
        var sendData = JSON.stringify(send);
        console.log("this is my testing");
        console.log(sendData);

        this.http.post(this.ElecMotorurl, sendData, options).subscribe(data=>{
            var loge = data.json();
            console.log(loge);
        });


        this.toastr.success('Fleet data Saved Successfully!', "Success!!!",{
            toastLife: 2000,
            newestOnTop: true
        });

    }

    onSaveElecTruck(fleetData: any){
        var sendFleet = fleetData;
        if(fleetData.actionsRecommended.switchToNewTrucks.bevTrucksKmPerKWh == undefined || fleetData.actionsRecommended.switchToNewTrucks.bevTrucksKmPerKWh == null) fleetData.actionsRecommended.switchToNewTrucks.bevTrucksKmPerKWh = 0;
        
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
    
        let options = new RequestOptions({
            headers: headers
        });

        var send = {email:this.currentEmail, item1: fleetData.actionsRecommended.switchToNewTrucks.bevTrucksKmPerKWh};
                            
        var sendData = JSON.stringify(send);
        console.log("this is my testing");
        console.log(sendData);

        this.http.post(this.ElecTruckurl, sendData, options).subscribe(data=>{
            var loge = data.json();
            console.log(loge);
        });


        this.toastr.success('Fleet data Saved Successfully!', "Success!!!",{
            toastLife: 2000,
            newestOnTop: true
        });

    }


    
    
    onSaveElectricity(fleetData: any){
        var sendFleet = fleetData;
        if(fleetData.actionsRecommended.generatorAlternatives.electricityDemand == undefined || fleetData.actionsRecommended.generatorAlternatives.electricityDemand == null)
            fleetData.actionsRecommended.generatorAlternatives.electricityDemand = 0;
        if(fleetData.actionsRecommended.generatorAlternatives.pvItemsCost == undefined || fleetData.actionsRecommended.generatorAlternatives.pvItemsCost == null)
            fleetData.actionsRecommended.generatorAlternatives.pvItemsCost = 0;
        
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
    
        let options = new RequestOptions({
            headers: headers
        });

        var send = {email:this.currentEmail, item1: fleetData.actionsRecommended.generatorAlternatives.electricityDemand, 
                    item2: fleetData.actionsRecommended.generatorAlternatives.pvItemsCost};
    
        var sendData = JSON.stringify(send);
        console.log("this is my testing");
        console.log(sendData);

        this.http.post(this.Electricityurl, sendData, options).subscribe(data=>{
            var loge = data.json();
            console.log(loge);
        });

        this.toastr.success('Fleet data Saved Successfully!', "Success!!!",{
            toastLife: 2000,
            newestOnTop: true
        });

    }

    onSaveList(fleetData: any){

        // is the form valid or not
        if(this.generalInfoForm['controls'].generalInfo['controls'].fleetName.invalid){
            this.toastr.error('Please enter a fleet name in the General Information section',
                'Error Saving Data',
                {
                    toastLife: 5000,
                    newestOnTop:true
                });
            return;
        }
        else{
            // save the list of fleets by fleet name
            // you can retrieve again if you want

            // check if exists in array
            if(!this.myFleets.includes(fleetData.generalInfo.fleetName)){
                this.myFleets.push(fleetData.generalInfo.fleetName);
            }
            //this.myStorage.setItem(this.currentUserFleets, JSON.stringify(this.myFleets));
            // save the fleets data with fleet name as key
            this.mySession.setItem(this.currentEmail, JSON.stringify(fleetData));
            //show data saved successfully to user
            
        }


        var sendFleet = fleetData;

        //console.log(sendFleet);
        //format the structure
        if(sendFleet.generalInfo.sulphurLevel == null || sendFleet.generalInfo.sulphurLevel == undefined)sendFleet.generalInfo.sulphurLevel = 0;
        if(sendFleet.generalInfo.localCurrency == null || sendFleet.generalInfo.localCurrency == undefined)sendFleet.generalInfo.localCurrency = 0;
        if(sendFleet.generalInfo.petrolPrice == null || sendFleet.generalInfo.petrolPrice == undefined)sendFleet.generalInfo.petrolPrice = 0;
        if(sendFleet.generalInfo.dieselPrice == null || sendFleet.generalInfo.dieselPrice == undefined)sendFleet.generalInfo.dieselPrice = 0;
        if(sendFleet.generalInfo.elecPrice == null || sendFleet.generalInfo.elecPrice == undefined)sendFleet.generalInfo.elecPrice = 0;
        if(sendFleet.generalInfo.fossilFuelElec == null || sendFleet.generalInfo.fossilFuelElec == undefined)sendFleet.generalInfo.fossilFuelElec = 0;
        
        if(sendFleet.passengerCarsGasoline.preEuro.numVehicles == null || sendFleet.passengerCarsGasoline.preEuro.numVehicles == undefined)sendFleet.passengerCarsGasoline.preEuro.numVehicles = 0;
        if(sendFleet.passengerCarsGasoline.preEuro.annualMileage == null || sendFleet.passengerCarsGasoline.preEuro.annualMileage == undefined)sendFleet.passengerCarsGasoline.preEuro.annualMileage = 0;
        if(sendFleet.passengerCarsGasoline.preEuro.annualFuel == null || sendFleet.passengerCarsGasoline.preEuro.annualFuel == undefined)sendFleet.passengerCarsGasoline.preEuro.annualFuel = 0;
        
        if(sendFleet.passengerCarsGasoline.euro1.numVehicles == null || sendFleet.passengerCarsGasoline.euro1.numVehicles == undefined)sendFleet.passengerCarsGasoline.euro1.numVehicles = 0;
        if(sendFleet.passengerCarsGasoline.euro1.annualMileage == null || sendFleet.passengerCarsGasoline.euro1.annualMileage == undefined)sendFleet.passengerCarsGasoline.euro1.annualMileage = 0;
        if(sendFleet.passengerCarsGasoline.euro1.annualFuel == null || sendFleet.passengerCarsGasoline.euro1.annualFuel == undefined)sendFleet.passengerCarsGasoline.euro1.annualFuel = 0;
        
        if(sendFleet.passengerCarsGasoline.euro2.numVehicles == null || sendFleet.passengerCarsGasoline.euro2.numVehicles == undefined)sendFleet.passengerCarsGasoline.euro2.numVehicles = 0;
        if(sendFleet.passengerCarsGasoline.euro2.annualMileage == null || sendFleet.passengerCarsGasoline.euro2.annualMileage == undefined)sendFleet.passengerCarsGasoline.euro2.annualMileage = 0;
        if(sendFleet.passengerCarsGasoline.euro2.annualFuel == null || sendFleet.passengerCarsGasoline.euro2.annualFuel == undefined)sendFleet.passengerCarsGasoline.euro2.annualFuel = 0;
        
        if(sendFleet.passengerCarsGasoline.euro3.numVehicles == null || sendFleet.passengerCarsGasoline.euro3.numVehicles == undefined)sendFleet.passengerCarsGasoline.euro3.numVehicles = 0;
        if(sendFleet.passengerCarsGasoline.euro3.annualMileage == null || sendFleet.passengerCarsGasoline.euro3.annualMileage == undefined)sendFleet.passengerCarsGasoline.euro3.annualMileage = 0;
        if(sendFleet.passengerCarsGasoline.euro3.annualFuel == null || sendFleet.passengerCarsGasoline.euro3.annualFuel == undefined)sendFleet.passengerCarsGasoline.euro3.annualFuel = 0;
        
        if(sendFleet.passengerCarsGasoline.euro4.numVehicles == null || sendFleet.passengerCarsGasoline.euro4.numVehicles == undefined)sendFleet.passengerCarsGasoline.euro4.numVehicles = 0;
        if(sendFleet.passengerCarsGasoline.euro4.annualMileage == null || sendFleet.passengerCarsGasoline.euro4.annualMileage == undefined)sendFleet.passengerCarsGasoline.euro4.annualMileage = 0;
        if(sendFleet.passengerCarsGasoline.euro4.annualFuel == null || sendFleet.passengerCarsGasoline.euro4.annualFuel == undefined)sendFleet.passengerCarsGasoline.euro4.annualFuel = 0;

        if(sendFleet.passengerCarsGasoline.euro5.numVehicles == null || sendFleet.passengerCarsGasoline.euro5.numVehicles == undefined)sendFleet.passengerCarsGasoline.euro5.numVehicles = 0;
        if(sendFleet.passengerCarsGasoline.euro5.annualMileage == null || sendFleet.passengerCarsGasoline.euro5.annualMileage == undefined)sendFleet.passengerCarsGasoline.euro5.annualMileage = 0;
        if(sendFleet.passengerCarsGasoline.euro5.annualFuel == null || sendFleet.passengerCarsGasoline.euro5.annualFuel == undefined)sendFleet.passengerCarsGasoline.euro5.annualFuel = 0;

        if(sendFleet.passengerCarsGasoline.euro6.numVehicles == null || sendFleet.passengerCarsGasoline.euro6.numVehicles == undefined)sendFleet.passengerCarsGasoline.euro6.numVehicles = 0;
        if(sendFleet.passengerCarsGasoline.euro6.annualMileage == null || sendFleet.passengerCarsGasoline.euro6.annualMileage == undefined)sendFleet.passengerCarsGasoline.euro6.annualMileage = 0;
        if(sendFleet.passengerCarsGasoline.euro6.annualFuel == null || sendFleet.passengerCarsGasoline.euro6.annualFuel == undefined)sendFleet.passengerCarsGasoline.euro6.annualFuel = 0;

        if(sendFleet.passengerCarsDiesel.euro3.numVehicles == null || sendFleet.passengerCarsDiesel.euro3.numVehicles == undefined)sendFleet.passengerCarsDiesel.euro3.numVehicles = 0;
        if(sendFleet.passengerCarsDiesel.euro3.annualMileage == null || sendFleet.passengerCarsDiesel.euro3.annualMileage == undefined)sendFleet.passengerCarsDiesel.euro3.annualMileage = 0;
        if(sendFleet.passengerCarsDiesel.euro3.annualFuel == null || sendFleet.passengerCarsDiesel.euro3.annualFuel == undefined)sendFleet.passengerCarsDiesel.euro3.annualFuel = 0;

        if(sendFleet.passengerCarsDiesel.euro4.numVehicles == null || sendFleet.passengerCarsDiesel.euro4.numVehicles == undefined)sendFleet.passengerCarsDiesel.euro4.numVehicles = 0;
        if(sendFleet.passengerCarsDiesel.euro4.annualMileage == null || sendFleet.passengerCarsDiesel.euro4.annualMileage == undefined)sendFleet.passengerCarsDiesel.euro4.annualMileage = 0;
        if(sendFleet.passengerCarsDiesel.euro4.annualFuel == null || sendFleet.passengerCarsDiesel.euro4.annualFuel == undefined)sendFleet.passengerCarsDiesel.euro4.annualFuel = 0;

        if(sendFleet.passengerCarsDiesel.euro5.numVehicles == null || sendFleet.passengerCarsDiesel.euro5.numVehicles == undefined)sendFleet.passengerCarsDiesel.euro5.numVehicles = 0;
        if(sendFleet.passengerCarsDiesel.euro5.annualMileage == null || sendFleet.passengerCarsDiesel.euro5.annualMileage == undefined)sendFleet.passengerCarsDiesel.euro5.annualMileage = 0;
        if(sendFleet.passengerCarsDiesel.euro5.annualFuel == null || sendFleet.passengerCarsDiesel.euro5.annualFuel == undefined)sendFleet.passengerCarsDiesel.euro5.annualFuel = 0;

        if(sendFleet.passengerCarsDiesel.euro6.numVehicles == null || sendFleet.passengerCarsDiesel.euro6.numVehicles == undefined)sendFleet.passengerCarsDiesel.euro6.numVehicles = 0;
        if(sendFleet.passengerCarsDiesel.euro6.annualMileage == null || sendFleet.passengerCarsDiesel.euro6.annualMileage == undefined)sendFleet.passengerCarsDiesel.euro6.annualMileage = 0;
        if(sendFleet.passengerCarsDiesel.euro6.annualFuel == null || sendFleet.passengerCarsDiesel.euro6.annualFuel == undefined)sendFleet.passengerCarsDiesel.euro6.annualFuel = 0;

        if(sendFleet.passengerCarsElectric.hybridElectric.numVehicles == null || sendFleet.passengerCarsElectric.hybridElectric.numVehicles == undefined)sendFleet.passengerCarsElectric.hybridElectric.numVehicles = 0;
        if(sendFleet.passengerCarsElectric.hybridElectric.annualMileage == null || sendFleet.passengerCarsElectric.hybridElectric.annualMileage == undefined)sendFleet.passengerCarsElectric.hybridElectric.annualMileage = 0;
        if(sendFleet.passengerCarsElectric.hybridElectric.annualFuel == null || sendFleet.passengerCarsElectric.hybridElectric.annualFuel == undefined)sendFleet.passengerCarsElectric.hybridElectric.annualFuel = 0;
        
        if(sendFleet.passengerCarsElectric.plugInHybridElectric.numVehicles == null || sendFleet.passengerCarsElectric.plugInHybridElectric.numVehicles == undefined)sendFleet.passengerCarsElectric.plugInHybridElectric.numVehicles = 0;
        if(sendFleet.passengerCarsElectric.plugInHybridElectric.annualMileage == null || sendFleet.passengerCarsElectric.plugInHybridElectric.annualMileage == undefined)sendFleet.passengerCarsElectric.plugInHybridElectric.annualMileage = 0;
        if(sendFleet.passengerCarsElectric.plugInHybridElectric.annualFuel == null || sendFleet.passengerCarsElectric.plugInHybridElectric.annualFuel == undefined)sendFleet.passengerCarsElectric.plugInHybridElectric.annualFuel = 0;
           
        if(sendFleet.passengerCarsElectric.batteryElectric.numVehicles == null || sendFleet.passengerCarsElectric.batteryElectric.numVehicles == undefined)sendFleet.passengerCarsElectric.batteryElectric.numVehicles = 0;
        if(sendFleet.passengerCarsElectric.batteryElectric.annualMileage == null || sendFleet.passengerCarsElectric.batteryElectric.annualMileage == undefined)sendFleet.passengerCarsElectric.batteryElectric.annualMileage = 0;
        if(sendFleet.passengerCarsElectric.batteryElectric.annualFuel == null || sendFleet.passengerCarsElectric.batteryElectric.annualFuel == undefined)sendFleet.passengerCarsElectric.batteryElectric.annualFuel = 0;
        


       
        if(sendFleet.passengerSUVsGasoline.preEuro.numVehicles == null || sendFleet.passengerSUVsGasoline.preEuro.numVehicles == undefined)sendFleet.passengerSUVsGasoline.preEuro.numVehicles = 0;
        if(sendFleet.passengerSUVsGasoline.preEuro.annualMileage == null || sendFleet.passengerSUVsGasoline.preEuro.annualMileage == undefined)sendFleet.passengerSUVsGasoline.preEuro.annualMileage = 0;
        if(sendFleet.passengerSUVsGasoline.preEuro.annualFuel == null || sendFleet.passengerSUVsGasoline.preEuro.annualFuel == undefined)sendFleet.passengerSUVsGasoline.preEuro.annualFuel = 0;
        
        if(sendFleet.passengerSUVsGasoline.euro1.numVehicles == null || sendFleet.passengerSUVsGasoline.euro1.numVehicles == undefined)sendFleet.passengerSUVsGasoline.euro1.numVehicles = 0;
        if(sendFleet.passengerSUVsGasoline.euro1.annualMileage == null || sendFleet.passengerSUVsGasoline.euro1.annualMileage == undefined)sendFleet.passengerSUVsGasoline.euro1.annualMileage = 0;
        if(sendFleet.passengerSUVsGasoline.euro1.annualFuel == null || sendFleet.passengerSUVsGasoline.euro1.annualFuel == undefined)sendFleet.passengerSUVsGasoline.euro1.annualFuel = 0;
        
        if(sendFleet.passengerSUVsGasoline.euro2.numVehicles == null || sendFleet.passengerSUVsGasoline.euro2.numVehicles == undefined)sendFleet.passengerSUVsGasoline.euro2.numVehicles = 0;
        if(sendFleet.passengerSUVsGasoline.euro2.annualMileage == null || sendFleet.passengerSUVsGasoline.euro2.annualMileage == undefined)sendFleet.passengerSUVsGasoline.euro2.annualMileage = 0;
        if(sendFleet.passengerSUVsGasoline.euro2.annualFuel == null || sendFleet.passengerSUVsGasoline.euro2.annualFuel == undefined)sendFleet.passengerSUVsGasoline.euro2.annualFuel = 0;
        
        if(sendFleet.passengerSUVsGasoline.euro3.numVehicles == null || sendFleet.passengerSUVsGasoline.euro3.numVehicles == undefined)sendFleet.passengerSUVsGasoline.euro3.numVehicles = 0;
        if(sendFleet.passengerSUVsGasoline.euro3.annualMileage == null || sendFleet.passengerSUVsGasoline.euro3.annualMileage == undefined)sendFleet.passengerSUVsGasoline.euro3.annualMileage = 0;
        if(sendFleet.passengerSUVsGasoline.euro3.annualFuel == null || sendFleet.passengerSUVsGasoline.euro3.annualFuel == undefined)sendFleet.passengerSUVsGasoline.euro3.annualFuel = 0;
        
        if(sendFleet.passengerSUVsGasoline.euro4.numVehicles == null || sendFleet.passengerSUVsGasoline.euro4.numVehicles == undefined)sendFleet.passengerSUVsGasoline.euro4.numVehicles = 0;
        if(sendFleet.passengerSUVsGasoline.euro4.annualMileage == null || sendFleet.passengerSUVsGasoline.euro4.annualMileage == undefined)sendFleet.passengerSUVsGasoline.euro4.annualMileage = 0;
        if(sendFleet.passengerSUVsGasoline.euro4.annualFuel == null || sendFleet.passengerSUVsGasoline.euro4.annualFuel == undefined)sendFleet.passengerSUVsGasoline.euro4.annualFuel = 0;

        if(sendFleet.passengerSUVsGasoline.euro5.numVehicles == null || sendFleet.passengerSUVsGasoline.euro5.numVehicles == undefined)sendFleet.passengerSUVsGasoline.euro5.numVehicles = 0;
        if(sendFleet.passengerSUVsGasoline.euro5.annualMileage == null || sendFleet.passengerSUVsGasoline.euro5.annualMileage == undefined)sendFleet.passengerSUVsGasoline.euro5.annualMileage = 0;
        if(sendFleet.passengerSUVsGasoline.euro5.annualFuel == null || sendFleet.passengerSUVsGasoline.euro5.annualFuel == undefined)sendFleet.passengerSUVsGasoline.euro5.annualFuel = 0;

        if(sendFleet.passengerSUVsGasoline.euro6.numVehicles == null || sendFleet.passengerSUVsGasoline.euro6.numVehicles == undefined)sendFleet.passengerSUVsGasoline.euro6.numVehicles = 0;
        if(sendFleet.passengerSUVsGasoline.euro6.annualMileage == null || sendFleet.passengerSUVsGasoline.euro6.annualMileage == undefined)sendFleet.passengerSUVsGasoline.euro6.annualMileage = 0;
        if(sendFleet.passengerSUVsGasoline.euro6.annualFuel == null || sendFleet.passengerSUVsGasoline.euro6.annualFuel == undefined)sendFleet.passengerSUVsGasoline.euro6.annualFuel = 0;



        if(sendFleet.passengerSUVsDiesel.preEuro.numVehicles == null || sendFleet.passengerSUVsDiesel.preEuro.numVehicles == undefined)sendFleet.passengerSUVsDiesel.preEuro.numVehicles = 0;
        if(sendFleet.passengerSUVsDiesel.preEuro.annualMileage == null || sendFleet.passengerSUVsDiesel.preEuro.annualMileage == undefined)sendFleet.passengerSUVsDiesel.preEuro.annualMileage = 0;
        if(sendFleet.passengerSUVsDiesel.preEuro.annualFuel == null || sendFleet.passengerSUVsDiesel.preEuro.annualFuel == undefined)sendFleet.passengerSUVsDiesel.preEuro.annualFuel = 0;
        
        if(sendFleet.passengerSUVsDiesel.euro1.numVehicles == null || sendFleet.passengerSUVsDiesel.euro1.numVehicles == undefined)sendFleet.passengerSUVsDiesel.euro1.numVehicles = 0;
        if(sendFleet.passengerSUVsDiesel.euro1.annualMileage == null || sendFleet.passengerSUVsDiesel.euro1.annualMileage == undefined)sendFleet.passengerSUVsDiesel.euro1.annualMileage = 0;
        if(sendFleet.passengerSUVsDiesel.euro1.annualFuel == null || sendFleet.passengerSUVsDiesel.euro1.annualFuel == undefined)sendFleet.passengerSUVsDiesel.euro1.annualFuel = 0;
        
        if(sendFleet.passengerSUVsDiesel.euro2.numVehicles == null || sendFleet.passengerSUVsDiesel.euro2.numVehicles == undefined)sendFleet.passengerSUVsDiesel.euro2.numVehicles = 0;
        if(sendFleet.passengerSUVsDiesel.euro2.annualMileage == null || sendFleet.passengerSUVsDiesel.euro2.annualMileage == undefined)sendFleet.passengerSUVsDiesel.euro2.annualMileage = 0;
        if(sendFleet.passengerSUVsDiesel.euro2.annualFuel == null || sendFleet.passengerSUVsDiesel.euro2.annualFuel == undefined)sendFleet.passengerSUVsDiesel.euro2.annualFuel = 0;
        
        if(sendFleet.passengerSUVsDiesel.euro3.numVehicles == null || sendFleet.passengerSUVsDiesel.euro3.numVehicles == undefined)sendFleet.passengerSUVsDiesel.euro3.numVehicles = 0;
        if(sendFleet.passengerSUVsDiesel.euro3.annualMileage == null || sendFleet.passengerSUVsDiesel.euro3.annualMileage == undefined)sendFleet.passengerSUVsDiesel.euro3.annualMileage = 0;
        if(sendFleet.passengerSUVsDiesel.euro3.annualFuel == null || sendFleet.passengerSUVsDiesel.euro3.annualFuel == undefined)sendFleet.passengerSUVsDiesel.euro3.annualFuel = 0;
        
        if(sendFleet.passengerSUVsDiesel.euro4.numVehicles == null || sendFleet.passengerSUVsDiesel.euro4.numVehicles == undefined)sendFleet.passengerSUVsDiesel.euro4.numVehicles = 0;
        if(sendFleet.passengerSUVsDiesel.euro4.annualMileage == null || sendFleet.passengerSUVsDiesel.euro4.annualMileage == undefined)sendFleet.passengerSUVsDiesel.euro4.annualMileage = 0;
        if(sendFleet.passengerSUVsDiesel.euro4.annualFuel == null || sendFleet.passengerSUVsDiesel.euro4.annualFuel == undefined)sendFleet.passengerSUVsDiesel.euro4.annualFuel = 0;

        if(sendFleet.passengerSUVsDiesel.euro5.numVehicles == null || sendFleet.passengerSUVsDiesel.euro5.numVehicles == undefined)sendFleet.passengerSUVsDiesel.euro5.numVehicles = 0;
        if(sendFleet.passengerSUVsDiesel.euro5.annualMileage == null || sendFleet.passengerSUVsDiesel.euro5.annualMileage == undefined)sendFleet.passengerSUVsDiesel.euro5.annualMileage = 0;
        if(sendFleet.passengerSUVsDiesel.euro5.annualFuel == null || sendFleet.passengerSUVsDiesel.euro5.annualFuel == undefined)sendFleet.passengerSUVsDiesel.euro5.annualFuel = 0;

        if(sendFleet.passengerSUVsDiesel.euro6.numVehicles == null || sendFleet.passengerSUVsDiesel.euro6.numVehicles == undefined)sendFleet.passengerSUVsDiesel.euro6.numVehicles = 0;
        if(sendFleet.passengerSUVsDiesel.euro6.annualMileage == null || sendFleet.passengerSUVsDiesel.euro6.annualMileage == undefined)sendFleet.passengerSUVsDiesel.euro6.annualMileage = 0;
        if(sendFleet.passengerSUVsDiesel.euro6.annualFuel == null || sendFleet.passengerSUVsDiesel.euro6.annualFuel == undefined)sendFleet.passengerSUVsDiesel.euro6.annualFuel = 0;



        if(sendFleet.passengerSUVsElectric.hybridElectric.numVehicles == null || sendFleet.passengerSUVsElectric.hybridElectric.numVehicles == undefined)sendFleet.passengerSUVsElectric.hybridElectric.numVehicles = 0;
        if(sendFleet.passengerSUVsElectric.hybridElectric.annualMileage == null || sendFleet.passengerSUVsElectric.hybridElectric.annualMileage == undefined)sendFleet.passengerSUVsElectric.hybridElectric.annualMileage = 0;
        if(sendFleet.passengerSUVsElectric.hybridElectric.annualFuel == null || sendFleet.passengerSUVsElectric.hybridElectric.annualFuel == undefined)sendFleet.passengerSUVsElectric.hybridElectric.annualFuel = 0;
        
        if(sendFleet.passengerSUVsElectric.plugInHybridElectric.numVehicles == null || sendFleet.passengerSUVsElectric.plugInHybridElectric.numVehicles == undefined)sendFleet.passengerSUVsElectric.plugInHybridElectric.numVehicles = 0;
        if(sendFleet.passengerSUVsElectric.plugInHybridElectric.annualMileage == null || sendFleet.passengerSUVsElectric.plugInHybridElectric.annualMileage == undefined)sendFleet.passengerSUVsElectric.plugInHybridElectric.annualMileage = 0;
        if(sendFleet.passengerSUVsElectric.plugInHybridElectric.annualFuel == null || sendFleet.passengerSUVsElectric.plugInHybridElectric.annualFuel == undefined)sendFleet.passengerSUVsElectric.plugInHybridElectric.annualFuel = 0;
           
        if(sendFleet.passengerSUVsElectric.batteryElectric.numVehicles == null || sendFleet.passengerSUVsElectric.batteryElectric.numVehicles == undefined)sendFleet.passengerSUVsElectric.batteryElectric.numVehicles = 0;
        if(sendFleet.passengerSUVsElectric.batteryElectric.annualMileage == null || sendFleet.passengerSUVsElectric.batteryElectric.annualMileage == undefined)sendFleet.passengerSUVsElectric.batteryElectric.annualMileage = 0;
        if(sendFleet.passengerSUVsElectric.batteryElectric.annualFuel == null || sendFleet.passengerSUVsElectric.batteryElectric.annualFuel == undefined)sendFleet.passengerSUVsElectric.batteryElectric.annualFuel = 0;
        


        if(sendFleet.lDVsGasoline.preEuro.numVehicles == null || sendFleet.lDVsGasoline.preEuro.numVehicles == undefined)sendFleet.lDVsGasoline.preEuro.numVehicles = 0;
        if(sendFleet.lDVsGasoline.preEuro.annualMileage == null || sendFleet.lDVsGasoline.preEuro.annualMileage == undefined)sendFleet.lDVsGasoline.preEuro.annualMileage = 0;
        if(sendFleet.lDVsGasoline.preEuro.annualFuel == null || sendFleet.lDVsGasoline.preEuro.annualFuel == undefined)sendFleet.lDVsGasoline.preEuro.annualFuel = 0;
        
        if(sendFleet.lDVsGasoline.euro1.numVehicles == null || sendFleet.lDVsGasoline.euro1.numVehicles == undefined)sendFleet.lDVsGasoline.euro1.numVehicles = 0;
        if(sendFleet.lDVsGasoline.euro1.annualMileage == null || sendFleet.lDVsGasoline.euro1.annualMileage == undefined)sendFleet.lDVsGasoline.euro1.annualMileage = 0;
        if(sendFleet.lDVsGasoline.euro1.annualFuel == null || sendFleet.lDVsGasoline.euro1.annualFuel == undefined)sendFleet.lDVsGasoline.euro1.annualFuel = 0;
        
        if(sendFleet.lDVsGasoline.euro2.numVehicles == null || sendFleet.lDVsGasoline.euro2.numVehicles == undefined)sendFleet.lDVsGasoline.euro2.numVehicles = 0;
        if(sendFleet.lDVsGasoline.euro2.annualMileage == null || sendFleet.lDVsGasoline.euro2.annualMileage == undefined)sendFleet.lDVsGasoline.euro2.annualMileage = 0;
        if(sendFleet.lDVsGasoline.euro2.annualFuel == null || sendFleet.lDVsGasoline.euro2.annualFuel == undefined)sendFleet.lDVsGasoline.euro2.annualFuel = 0;
        
        if(sendFleet.lDVsGasoline.euro3.numVehicles == null || sendFleet.lDVsGasoline.euro3.numVehicles == undefined)sendFleet.lDVsGasoline.euro3.numVehicles = 0;
        if(sendFleet.lDVsGasoline.euro3.annualMileage == null || sendFleet.lDVsGasoline.euro3.annualMileage == undefined)sendFleet.lDVsGasoline.euro3.annualMileage = 0;
        if(sendFleet.lDVsGasoline.euro3.annualFuel == null || sendFleet.lDVsGasoline.euro3.annualFuel == undefined)sendFleet.lDVsGasoline.euro3.annualFuel = 0;
        
        if(sendFleet.lDVsGasoline.euro4.numVehicles == null || sendFleet.lDVsGasoline.euro4.numVehicles == undefined)sendFleet.lDVsGasoline.euro4.numVehicles = 0;
        if(sendFleet.lDVsGasoline.euro4.annualMileage == null || sendFleet.lDVsGasoline.euro4.annualMileage == undefined)sendFleet.lDVsGasoline.euro4.annualMileage = 0;
        if(sendFleet.lDVsGasoline.euro4.annualFuel == null || sendFleet.lDVsGasoline.euro4.annualFuel == undefined)sendFleet.lDVsGasoline.euro4.annualFuel = 0;

        if(sendFleet.lDVsGasoline.euro5.numVehicles == null || sendFleet.lDVsGasoline.euro5.numVehicles == undefined)sendFleet.lDVsGasoline.euro5.numVehicles = 0;
        if(sendFleet.lDVsGasoline.euro5.annualMileage == null || sendFleet.lDVsGasoline.euro5.annualMileage == undefined)sendFleet.lDVsGasoline.euro5.annualMileage = 0;
        if(sendFleet.lDVsGasoline.euro5.annualFuel == null || sendFleet.lDVsGasoline.euro5.annualFuel == undefined)sendFleet.lDVsGasoline.euro5.annualFuel = 0;

        if(sendFleet.lDVsGasoline.euro6.numVehicles == null || sendFleet.lDVsGasoline.euro6.numVehicles == undefined)sendFleet.lDVsGasoline.euro6.numVehicles = 0;
        if(sendFleet.lDVsGasoline.euro6.annualMileage == null || sendFleet.lDVsGasoline.euro6.annualMileage == undefined)sendFleet.lDVsGasoline.euro6.annualMileage = 0;
        if(sendFleet.lDVsGasoline.euro6.annualFuel == null || sendFleet.lDVsGasoline.euro6.annualFuel == undefined)sendFleet.lDVsGasoline.euro6.annualFuel = 0;

        

        if(sendFleet.lDVsDiesel.preEuro.numVehicles == null || sendFleet.lDVsDiesel.preEuro.numVehicles == undefined)sendFleet.lDVsDiesel.preEuro.numVehicles = 0;
        if(sendFleet.lDVsDiesel.preEuro.annualMileage == null || sendFleet.lDVsDiesel.preEuro.annualMileage == undefined)sendFleet.lDVsDiesel.preEuro.annualMileage = 0;
        if(sendFleet.lDVsDiesel.preEuro.annualFuel == null || sendFleet.lDVsDiesel.preEuro.annualFuel == undefined)sendFleet.lDVsDiesel.preEuro.annualFuel = 0;
        
        if(sendFleet.lDVsDiesel.euro1.numVehicles == null || sendFleet.lDVsDiesel.euro1.numVehicles == undefined)sendFleet.lDVsDiesel.euro1.numVehicles = 0;
        if(sendFleet.lDVsDiesel.euro1.annualMileage == null || sendFleet.lDVsDiesel.euro1.annualMileage == undefined)sendFleet.lDVsDiesel.euro1.annualMileage = 0;
        if(sendFleet.lDVsDiesel.euro1.annualFuel == null || sendFleet.lDVsDiesel.euro1.annualFuel == undefined)sendFleet.lDVsDiesel.euro1.annualFuel = 0;
        
        if(sendFleet.lDVsDiesel.euro2.numVehicles == null || sendFleet.lDVsDiesel.euro2.numVehicles == undefined)sendFleet.lDVsDiesel.euro2.numVehicles = 0;
        if(sendFleet.lDVsDiesel.euro2.annualMileage == null || sendFleet.lDVsDiesel.euro2.annualMileage == undefined)sendFleet.lDVsDiesel.euro2.annualMileage = 0;
        if(sendFleet.lDVsDiesel.euro2.annualFuel == null || sendFleet.lDVsDiesel.euro2.annualFuel == undefined)sendFleet.lDVsDiesel.euro2.annualFuel = 0;
        
        if(sendFleet.lDVsDiesel.euro3.numVehicles == null || sendFleet.lDVsDiesel.euro3.numVehicles == undefined)sendFleet.lDVsDiesel.euro3.numVehicles = 0;
        if(sendFleet.lDVsDiesel.euro3.annualMileage == null || sendFleet.lDVsDiesel.euro3.annualMileage == undefined)sendFleet.lDVsDiesel.euro3.annualMileage = 0;
        if(sendFleet.lDVsDiesel.euro3.annualFuel == null || sendFleet.lDVsDiesel.euro3.annualFuel == undefined)sendFleet.lDVsDiesel.euro3.annualFuel = 0;
        
        if(sendFleet.lDVsDiesel.euro4.numVehicles == null || sendFleet.lDVsDiesel.euro4.numVehicles == undefined)sendFleet.lDVsDiesel.euro4.numVehicles = 0;
        if(sendFleet.lDVsDiesel.euro4.annualMileage == null || sendFleet.lDVsDiesel.euro4.annualMileage == undefined)sendFleet.lDVsDiesel.euro4.annualMileage = 0;
        if(sendFleet.lDVsDiesel.euro4.annualFuel == null || sendFleet.lDVsDiesel.euro4.annualFuel == undefined)sendFleet.lDVsDiesel.euro4.annualFuel = 0;

        if(sendFleet.lDVsDiesel.euro5.numVehicles == null || sendFleet.lDVsDiesel.euro5.numVehicles == undefined)sendFleet.lDVsDiesel.euro5.numVehicles = 0;
        if(sendFleet.lDVsDiesel.euro5.annualMileage == null || sendFleet.lDVsDiesel.euro5.annualMileage == undefined)sendFleet.lDVsDiesel.euro5.annualMileage = 0;
        if(sendFleet.lDVsDiesel.euro5.annualFuel == null || sendFleet.lDVsDiesel.euro5.annualFuel == undefined)sendFleet.lDVsDiesel.euro5.annualFuel = 0;

        if(sendFleet.lDVsDiesel.euro6.numVehicles == null || sendFleet.lDVsDiesel.euro6.numVehicles == undefined)sendFleet.lDVsDiesel.euro6.numVehicles = 0;
        if(sendFleet.lDVsDiesel.euro6.annualMileage == null || sendFleet.lDVsDiesel.euro6.annualMileage == undefined)sendFleet.lDVsDiesel.euro6.annualMileage = 0;
        if(sendFleet.lDVsDiesel.euro6.annualFuel == null || sendFleet.lDVsDiesel.euro6.annualFuel == undefined)sendFleet.lDVsDiesel.euro6.annualFuel = 0;
        


        if(sendFleet.mDVsDiesel.preEuro.numVehicles == null || sendFleet.mDVsDiesel.preEuro.numVehicles == undefined)sendFleet.mDVsDiesel.preEuro.numVehicles = 0;
        if(sendFleet.mDVsDiesel.preEuro.annualMileage == null || sendFleet.mDVsDiesel.preEuro.annualMileage == undefined)sendFleet.mDVsDiesel.preEuro.annualMileage = 0;
        if(sendFleet.mDVsDiesel.preEuro.annualFuel == null || sendFleet.mDVsDiesel.preEuro.annualFuel == undefined)sendFleet.mDVsDiesel.preEuro.annualFuel = 0;
        
        if(sendFleet.mDVsDiesel.euro1.numVehicles == null || sendFleet.mDVsDiesel.euro1.numVehicles == undefined)sendFleet.mDVsDiesel.euro1.numVehicles = 0;
        if(sendFleet.mDVsDiesel.euro1.annualMileage == null || sendFleet.mDVsDiesel.euro1.annualMileage == undefined)sendFleet.mDVsDiesel.euro1.annualMileage = 0;
        if(sendFleet.mDVsDiesel.euro1.annualFuel == null || sendFleet.mDVsDiesel.euro1.annualFuel == undefined)sendFleet.mDVsDiesel.euro1.annualFuel = 0;
        
        if(sendFleet.mDVsDiesel.euro2.numVehicles == null || sendFleet.mDVsDiesel.euro2.numVehicles == undefined)sendFleet.mDVsDiesel.euro2.numVehicles = 0;
        if(sendFleet.mDVsDiesel.euro2.annualMileage == null || sendFleet.mDVsDiesel.euro2.annualMileage == undefined)sendFleet.mDVsDiesel.euro2.annualMileage = 0;
        if(sendFleet.mDVsDiesel.euro2.annualFuel == null || sendFleet.mDVsDiesel.euro2.annualFuel == undefined)sendFleet.mDVsDiesel.euro2.annualFuel = 0;
        
        if(sendFleet.mDVsDiesel.euro3.numVehicles == null || sendFleet.mDVsDiesel.euro3.numVehicles == undefined)sendFleet.mDVsDiesel.euro3.numVehicles = 0;
        if(sendFleet.mDVsDiesel.euro3.annualMileage == null || sendFleet.mDVsDiesel.euro3.annualMileage == undefined)sendFleet.mDVsDiesel.euro3.annualMileage = 0;
        if(sendFleet.mDVsDiesel.euro3.annualFuel == null || sendFleet.mDVsDiesel.euro3.annualFuel == undefined)sendFleet.mDVsDiesel.euro3.annualFuel = 0;
        
        if(sendFleet.mDVsDiesel.euro4.numVehicles == null || sendFleet.mDVsDiesel.euro4.numVehicles == undefined)sendFleet.mDVsDiesel.euro4.numVehicles = 0;
        if(sendFleet.mDVsDiesel.euro4.annualMileage == null || sendFleet.mDVsDiesel.euro4.annualMileage == undefined)sendFleet.mDVsDiesel.euro4.annualMileage = 0;
        if(sendFleet.mDVsDiesel.euro4.annualFuel == null || sendFleet.mDVsDiesel.euro4.annualFuel == undefined)sendFleet.mDVsDiesel.euro4.annualFuel = 0;

        if(sendFleet.mDVsDiesel.euro5.numVehicles == null || sendFleet.mDVsDiesel.euro5.numVehicles == undefined)sendFleet.mDVsDiesel.euro5.numVehicles = 0;
        if(sendFleet.mDVsDiesel.euro5.annualMileage == null || sendFleet.mDVsDiesel.euro5.annualMileage == undefined)sendFleet.mDVsDiesel.euro5.annualMileage = 0;
        if(sendFleet.mDVsDiesel.euro5.annualFuel == null || sendFleet.mDVsDiesel.euro5.annualFuel == undefined)sendFleet.mDVsDiesel.euro5.annualFuel = 0;

        if(sendFleet.mDVsDiesel.euro6.numVehicles == null || sendFleet.mDVsDiesel.euro6.numVehicles == undefined)sendFleet.mDVsDiesel.euro6.numVehicles = 0;
        if(sendFleet.mDVsDiesel.euro6.annualMileage == null || sendFleet.mDVsDiesel.euro6.annualMileage == undefined)sendFleet.mDVsDiesel.euro6.annualMileage = 0;
        if(sendFleet.mDVsDiesel.euro6.annualFuel == null || sendFleet.mDVsDiesel.euro6.annualFuel == undefined)sendFleet.mDVsDiesel.euro6.annualFuel = 0;

        

        if(sendFleet.hDVsDiesel.preEuro.numVehicles == null || sendFleet.hDVsDiesel.preEuro.numVehicles == undefined)sendFleet.hDVsDiesel.preEuro.numVehicles = 0;
        if(sendFleet.hDVsDiesel.preEuro.annualMileage == null || sendFleet.hDVsDiesel.preEuro.annualMileage == undefined)sendFleet.hDVsDiesel.preEuro.annualMileage = 0;
        if(sendFleet.hDVsDiesel.preEuro.annualFuel == null || sendFleet.hDVsDiesel.preEuro.annualFuel == undefined)sendFleet.hDVsDiesel.preEuro.annualFuel = 0;
        
        if(sendFleet.hDVsDiesel.euro1.numVehicles == null || sendFleet.hDVsDiesel.euro1.numVehicles == undefined)sendFleet.hDVsDiesel.euro1.numVehicles = 0;
        if(sendFleet.hDVsDiesel.euro1.annualMileage == null || sendFleet.hDVsDiesel.euro1.annualMileage == undefined)sendFleet.hDVsDiesel.euro1.annualMileage = 0;
        if(sendFleet.hDVsDiesel.euro1.annualFuel == null || sendFleet.hDVsDiesel.euro1.annualFuel == undefined)sendFleet.hDVsDiesel.euro1.annualFuel = 0;
        
        if(sendFleet.hDVsDiesel.euro2.numVehicles == null || sendFleet.hDVsDiesel.euro2.numVehicles == undefined)sendFleet.hDVsDiesel.euro2.numVehicles = 0;
        if(sendFleet.hDVsDiesel.euro2.annualMileage == null || sendFleet.hDVsDiesel.euro2.annualMileage == undefined)sendFleet.hDVsDiesel.euro2.annualMileage = 0;
        if(sendFleet.hDVsDiesel.euro2.annualFuel == null || sendFleet.hDVsDiesel.euro2.annualFuel == undefined)sendFleet.hDVsDiesel.euro2.annualFuel = 0;
        
        if(sendFleet.hDVsDiesel.euro3.numVehicles == null || sendFleet.hDVsDiesel.euro3.numVehicles == undefined)sendFleet.hDVsDiesel.euro3.numVehicles = 0;
        if(sendFleet.hDVsDiesel.euro3.annualMileage == null || sendFleet.hDVsDiesel.euro3.annualMileage == undefined)sendFleet.hDVsDiesel.euro3.annualMileage = 0;
        if(sendFleet.hDVsDiesel.euro3.annualFuel == null || sendFleet.hDVsDiesel.euro3.annualFuel == undefined)sendFleet.hDVsDiesel.euro3.annualFuel = 0;
        
        if(sendFleet.hDVsDiesel.euro4.numVehicles == null || sendFleet.hDVsDiesel.euro4.numVehicles == undefined)sendFleet.hDVsDiesel.euro4.numVehicles = 0;
        if(sendFleet.hDVsDiesel.euro4.annualMileage == null || sendFleet.hDVsDiesel.euro4.annualMileage == undefined)sendFleet.hDVsDiesel.euro4.annualMileage = 0;
        if(sendFleet.hDVsDiesel.euro4.annualFuel == null || sendFleet.hDVsDiesel.euro4.annualFuel == undefined)sendFleet.hDVsDiesel.euro4.annualFuel = 0;

        if(sendFleet.hDVsDiesel.euro5.numVehicles == null || sendFleet.hDVsDiesel.euro5.numVehicles == undefined)sendFleet.hDVsDiesel.euro5.numVehicles = 0;
        if(sendFleet.hDVsDiesel.euro5.annualMileage == null || sendFleet.hDVsDiesel.euro5.annualMileage == undefined)sendFleet.hDVsDiesel.euro5.annualMileage = 0;
        if(sendFleet.hDVsDiesel.euro5.annualFuel == null || sendFleet.hDVsDiesel.euro5.annualFuel == undefined)sendFleet.hDVsDiesel.euro5.annualFuel = 0;

        if(sendFleet.hDVsDiesel.euro6.numVehicles == null || sendFleet.hDVsDiesel.euro6.numVehicles == undefined)sendFleet.hDVsDiesel.euro6.numVehicles = 0;
        if(sendFleet.hDVsDiesel.euro6.annualMileage == null || sendFleet.hDVsDiesel.euro6.annualMileage == undefined)sendFleet.hDVsDiesel.euro6.annualMileage = 0;
        if(sendFleet.hDVsDiesel.euro6.annualFuel == null || sendFleet.hDVsDiesel.euro6.annualFuel == undefined)sendFleet.hDVsDiesel.euro6.annualFuel = 0;



        if(sendFleet.motorCycles.fourStroke.numVehicles == null || sendFleet.motorCycles.fourStroke.numVehicles == undefined)sendFleet.motorCycles.fourStroke.numVehicles = 0;
        if(sendFleet.motorCycles.fourStroke.annualMileage == null || sendFleet.motorCycles.fourStroke.annualMileage == undefined)sendFleet.motorCycles.fourStroke.annualMileage = 0;
        if(sendFleet.motorCycles.fourStroke.annualFuel == null || sendFleet.motorCycles.fourStroke.annualFuel == undefined)sendFleet.motorCycles.fourStroke.annualFuel = 0;
        

        if(sendFleet.motorCycles.twoStroke.numVehicles == null || sendFleet.motorCycles.twoStroke.numVehicles == undefined)sendFleet.motorCycles.twoStroke.numVehicles = 0;
        if(sendFleet.motorCycles.twoStroke.annualMileage == null || sendFleet.motorCycles.twoStroke.annualMileage == undefined)sendFleet.motorCycles.twoStroke.annualMileage = 0;
        if(sendFleet.motorCycles.twoStroke.annualFuel == null || sendFleet.motorCycles.twoStroke.annualFuel == undefined)sendFleet.motorCycles.twoStroke.annualFuel = 0;


        if(sendFleet.motorCycles.electric.numVehicles == null || sendFleet.motorCycles.electric.numVehicles == undefined)sendFleet.motorCycles.electric.numVehicles = 0;
        if(sendFleet.motorCycles.electric.annualMileage == null || sendFleet.motorCycles.electric.annualMileage == undefined)sendFleet.motorCycles.electric.annualMileage = 0;
        if(sendFleet.motorCycles.electric.annualFuel == null || sendFleet.motorCycles.electric.annualFuel == undefined)sendFleet.motorCycles.electric.annualFuel = 0;

        
        if(sendFleet.generators.diesel.numVehicles == null || sendFleet.generators.diesel.numVehicles == undefined)sendFleet.generators.diesel.numVehicles = 0;
        if(sendFleet.generators.diesel.annualFuel == null || sendFleet.generators.diesel.annualFuel == undefined)sendFleet.generators.diesel.annualFuel = 0;
        //end
        
        var send ={email:this.currentEmail, 
            sendFleet_generalInfo_fleetName: sendFleet.generalInfo.fleetName, sendFleet_generalInfo_sulphurLevel: sendFleet.generalInfo.sulphurLevel,
            sendFleet_generalInfo_localCurrency:sendFleet.generalInfo.localCurrency, sendFleet_generalInfo_petrolPrice:sendFleet.generalInfo.petrolPrice,
            sendFleet_generalInfo_dieselPrice:sendFleet.generalInfo.dieselPrice, sendFleet_generalInfo_elecPrice:sendFleet.generalInfo.elecPrice,
            sendFleet_generalInfo_fossilFuelElec:sendFleet.generalInfo.fossilFuelElec,

            sendFleet_passengerCarsGasoline_preEuro_numVehicles: sendFleet.passengerCarsGasoline.preEuro.numVehicles, sendFleet_passengerCarsGasoline_preEuro_annualMileage:sendFleet.passengerCarsGasoline.preEuro.annualMileage, sendFleet_passengerCarsGasoline_preEuro_annualFuel: sendFleet.passengerCarsGasoline.preEuro.annualFuel, 
            sendFleet_passengerCarsGasoline_euro1_numVehicles:sendFleet.passengerCarsGasoline.euro1.numVehicles, sendFleet_passengerCarsGasoline_euro1_annualMileage:sendFleet.passengerCarsGasoline.euro1.annualMileage, sendFleet_passengerCarsGasoline_euro1_annualFuel:sendFleet.passengerCarsGasoline.euro1.annualFuel, 
            sendFleet_passengerCarsGasoline_euro2_numVehicles:sendFleet.passengerCarsGasoline.euro2.numVehicles, sendFleet_passengerCarsGasoline_euro2_annualMileage:sendFleet.passengerCarsGasoline.euro2.annualMileage, sendFleet_passengerCarsGasoline_euro2_annualFuel:sendFleet.passengerCarsGasoline.euro2.annualFuel, 
            sendFleet_passengerCarsGasoline_euro3_numVehicles:sendFleet.passengerCarsGasoline.euro3.numVehicles, sendFleet_passengerCarsGasoline_euro3_annualMileage:sendFleet.passengerCarsGasoline.euro3.annualMileage, sendFleet_passengerCarsGasoline_euro3_annualFuel:sendFleet.passengerCarsGasoline.euro3.annualFuel, 
            sendFleet_passengerCarsGasoline_euro4_numVehicles:sendFleet.passengerCarsGasoline.euro4.numVehicles, sendFleet_passengerCarsGasoline_euro4_annualMileage:sendFleet.passengerCarsGasoline.euro4.annualMileage, sendFleet_passengerCarsGasoline_euro4_annualFuel:sendFleet.passengerCarsGasoline.euro4.annualFuel, 
            sendFleet_passengerCarsGasoline_euro5_numVehicles:sendFleet.passengerCarsGasoline.euro5.numVehicles, sendFleet_passengerCarsGasoline_euro5_annualMileage:sendFleet.passengerCarsGasoline.euro5.annualMileage, sendFleet_passengerCarsGasoline_euro5_annualFuel:sendFleet.passengerCarsGasoline.euro5.annualFuel, 
            sendFleet_passengerCarsGasoline_euro6_numVehicles:sendFleet.passengerCarsGasoline.euro6.numVehicles, sendFleet_passengerCarsGasoline_euro6_annualMileage:sendFleet.passengerCarsGasoline.euro6.annualMileage, sendFleet_passengerCarsGasoline_euro6_annualFuel:sendFleet.passengerCarsGasoline.euro6.annualFuel, 

            sendFleet_passengerCarsDiesel_euro3_numVehicles:sendFleet.passengerCarsDiesel.euro3.numVehicles, sendFleet_passengerCarsDiesel_euro3_annualMileage:sendFleet.passengerCarsDiesel.euro3.annualMileage, sendFleet_passengerCarsDiesel_euro3_annualFuel:sendFleet.passengerCarsDiesel.euro3.annualFuel,
            sendFleet_passengerCarsDiesel_euro4_numVehicles:sendFleet.passengerCarsDiesel.euro4.numVehicles, sendFleet_passengerCarsDiesel_euro4_annualMileage:sendFleet.passengerCarsDiesel.euro4.annualMileage, sendFleet_passengerCarsDiesel_euro4_annualFuel:sendFleet.passengerCarsDiesel.euro4.annualFuel,
            sendFleet_passengerCarsDiesel_euro5_numVehicles:sendFleet.passengerCarsDiesel.euro5.numVehicles, sendFleet_passengerCarsDiesel_euro5_annualMileage:sendFleet.passengerCarsDiesel.euro5.annualMileage, sendFleet_passengerCarsDiesel_euro5_annualFuel:sendFleet.passengerCarsDiesel.euro5.annualFuel,
            sendFleet_passengerCarsDiesel_euro6_numVehicles:sendFleet.passengerCarsDiesel.euro6.numVehicles, sendFleet_passengerCarsDiesel_euro6_annualMileage:sendFleet.passengerCarsDiesel.euro6.annualMileage, sendFleet_passengerCarsDiesel_euro6_annualFuel:sendFleet.passengerCarsDiesel.euro6.annualFuel,
            
            sendFleet_passengerCarsElectric_hybridElectric_numVehicles:sendFleet.passengerCarsElectric.hybridElectric.numVehicles, sendFleet_passengerCarsElectric_hybridElectric_annualMileage:sendFleet.passengerCarsElectric.hybridElectric.annualMileage, sendFleet_passengerCarsElectric_hybridElectric_annualFuel:sendFleet.passengerCarsElectric.hybridElectric.annualFuel,
            sendFleet_passengerCarsElectric_plugInHybridElectric_numVehicles:sendFleet.passengerCarsElectric.plugInHybridElectric.numVehicles, sendFleet_passengerCarsElectric_plugInHybridElectric_annualMileage:sendFleet.passengerCarsElectric.plugInHybridElectric.annualMileage, sendFleet_passengerCarsElectric_plugInHybridElectric_annualFuel:sendFleet.passengerCarsElectric.plugInHybridElectric.annualFuel,
            sendFleet_passengerCarsElectric_batteryElectric_numVehicles:sendFleet.passengerCarsElectric.batteryElectric.numVehicles, sendFleet_passengerCarsElectric_batteryElectric_annualMileage:sendFleet.passengerCarsElectric.batteryElectric.annualMileage, sendFleet_passengerCarsElectric_batteryElectric_annualFuel:sendFleet.passengerCarsElectric.batteryElectric.annualFuel,//important,
            
            sendFleet_passengerSUVsGasoline_preEuro_numVehicles:sendFleet.passengerSUVsGasoline.preEuro.numVehicles, sendFleet_passengerSUVsGasoline_preEuro_annualMileage:sendFleet.passengerSUVsGasoline.preEuro.annualMileage, sendFleet_passengerSUVsGasoline_preEuro_annualFuel:sendFleet.passengerSUVsGasoline.preEuro.annualFuel,
            sendFleet_passengerSUVsGasoline_euro1_numVehicles:sendFleet.passengerSUVsGasoline.euro1.numVehicles, sendFleet_passengerSUVsGasoline_euro1_annualMileage:sendFleet.passengerSUVsGasoline.euro1.annualMileage, sendFleet_passengerSUVsGasoline_euro1_annualFuel:sendFleet.passengerSUVsGasoline.euro1.annualFuel,
            sendFleet_passengerSUVsGasoline_euro2_numVehicles:sendFleet.passengerSUVsGasoline.euro2.numVehicles, sendFleet_passengerSUVsGasoline_euro2_annualMileage:sendFleet.passengerSUVsGasoline.euro2.annualMileage, sendFleet_passengerSUVsGasoline_euro2_annualFuel:sendFleet.passengerSUVsGasoline.euro2.annualFuel,
            sendFleet_passengerSUVsGasoline_euro3_numVehicles:sendFleet.passengerSUVsGasoline.euro3.numVehicles, sendFleet_passengerSUVsGasoline_euro3_annualMileage:sendFleet.passengerSUVsGasoline.euro3.annualMileage, sendFleet_passengerSUVsGasoline_euro3_annualFuel:sendFleet.passengerSUVsGasoline.euro3.annualFuel,
            sendFleet_passengerSUVsGasoline_euro4_numVehicles:sendFleet.passengerSUVsGasoline.euro4.numVehicles, sendFleet_passengerSUVsGasoline_euro4_annualMileage:sendFleet.passengerSUVsGasoline.euro4.annualMileage, sendFleet_passengerSUVsGasoline_euro4_annualFuel:sendFleet.passengerSUVsGasoline.euro4.annualFuel,
            sendFleet_passengerSUVsGasoline_euro5_numVehicles:sendFleet.passengerSUVsGasoline.euro5.numVehicles, sendFleet_passengerSUVsGasoline_euro5_annualMileage:sendFleet.passengerSUVsGasoline.euro5.annualMileage, sendFleet_passengerSUVsGasoline_euro5_annualFuel:sendFleet.passengerSUVsGasoline.euro5.annualFuel,
            sendFleet_passengerSUVsGasoline_euro6_numVehicles:sendFleet.passengerSUVsGasoline.euro6.numVehicles, sendFleet_passengerSUVsGasoline_euro6_annualMileage:sendFleet.passengerSUVsGasoline.euro6.annualMileage, sendFleet_passengerSUVsGasoline_euro6_annualFuel:sendFleet.passengerSUVsGasoline.euro6.annualFuel,
            
            sendFleet_passengerSUVsDiesel_preEuro_numVehicles:sendFleet.passengerSUVsDiesel.preEuro.numVehicles, sendFleet_passengerSUVsDiesel_preEuro_annualMileage:sendFleet.passengerSUVsDiesel.preEuro.annualMileage, sendFleet_passengerSUVsDiesel_preEuro_annualFuel:sendFleet.passengerSUVsDiesel.preEuro.annualFuel,
            sendFleet_passengerSUVsDiesel_euro1_numVehicles:sendFleet.passengerSUVsDiesel.euro1.numVehicles, sendFleet_passengerSUVsDiesel_euro1_annualMileage:sendFleet.passengerSUVsDiesel.euro1.annualMileage, sendFleet_passengerSUVsDiesel_euro1_annualFuel:sendFleet.passengerSUVsDiesel.euro1.annualFuel,
            sendFleet_passengerSUVsDiesel_euro2_numVehicles:sendFleet.passengerSUVsDiesel.euro2.numVehicles, sendFleet_passengerSUVsDiesel_euro2_annualMileage:sendFleet.passengerSUVsDiesel.euro2.annualMileage, sendFleet_passengerSUVsDiesel_euro2_annualFuel:sendFleet.passengerSUVsDiesel.euro2.annualFuel,
            sendFleet_passengerSUVsDiesel_euro3_numVehicles:sendFleet.passengerSUVsDiesel.euro3.numVehicles, sendFleet_passengerSUVsDiesel_euro3_annualMileage:sendFleet.passengerSUVsDiesel.euro3.annualMileage, sendFleet_passengerSUVsDiesel_euro3_annualFuel:sendFleet.passengerSUVsDiesel.euro3.annualFuel,
            sendFleet_passengerSUVsDiesel_euro4_numVehicles:sendFleet.passengerSUVsDiesel.euro4.numVehicles, sendFleet_passengerSUVsDiesel_euro4_annualMileage:sendFleet.passengerSUVsDiesel.euro4.annualMileage, sendFleet_passengerSUVsDiesel_euro4_annualFuel:sendFleet.passengerSUVsDiesel.euro4.annualFuel,
            sendFleet_passengerSUVsDiesel_euro5_numVehicles:sendFleet.passengerSUVsDiesel.euro5.numVehicles, sendFleet_passengerSUVsDiesel_euro5_annualMileage:sendFleet.passengerSUVsDiesel.euro5.annualMileage, sendFleet_passengerSUVsDiesel_euro5_annualFuel:sendFleet.passengerSUVsDiesel.euro5.annualFuel,
            sendFleet_passengerSUVsDiesel_euro6_numVehicles:sendFleet.passengerSUVsDiesel.euro6.numVehicles, sendFleet_passengerSUVsDiesel_euro6_annualMileage:sendFleet.passengerSUVsDiesel.euro6.annualMileage, sendFleet_passengerSUVsDiesel_euro6_annualFuel:sendFleet.passengerSUVsDiesel.euro6.annualFuel,

            sendFleet_passengerSUVsElectric_hybridElectric_numVehicles:sendFleet.passengerSUVsElectric.hybridElectric.numVehicles, sendFleet_passengerSUVsElectric_hybridElectric_annualMileage:sendFleet.passengerSUVsElectric.hybridElectric.annualMileage, sendFleet_passengerSUVsElectric_hybridElectric_annualFuel:sendFleet.passengerSUVsElectric.hybridElectric.annualFuel,
            sendFleet_passengerSUVsElectric_plugInHybridElectric_numVehicles:sendFleet.passengerSUVsElectric.plugInHybridElectric.numVehicles, sendFleet_passengerSUVsElectric_plugInHybridElectric_annualMileage:sendFleet.passengerSUVsElectric.plugInHybridElectric.annualMileage, sendFleet_passengerSUVsElectric_plugInHybridElectric_annualFuel:sendFleet.passengerSUVsElectric.plugInHybridElectric.annualFuel,
            sendFleet_passengerSUVsElectric_batteryElectric_numVehicles:sendFleet.passengerSUVsElectric.batteryElectric.numVehicles, sendFleet_passengerSUVsElectric_batteryElectric_annualMileage:sendFleet.passengerSUVsElectric.batteryElectric.annualMileage, sendFleet_passengerSUVsElectric_batteryElectric_annualFuel:sendFleet.passengerSUVsElectric.batteryElectric.annualFuel,//important,
            
            sendFleet_lDVsGasoline_preEuro_numVehicles:sendFleet.lDVsGasoline.preEuro.numVehicles, sendFleet_lDVsGasoline_preEuro_annualMileage:sendFleet.lDVsGasoline.preEuro.annualMileage, sendFleet_lDVsGasoline_preEuro_annualFuel:sendFleet.lDVsGasoline.preEuro.annualFuel,
            sendFleet_lDVsGasoline_euro1_numVehicles:sendFleet.lDVsGasoline.euro1.numVehicles, sendFleet_lDVsGasoline_euro1_annualMileage:sendFleet.lDVsGasoline.euro1.annualMileage, sendFleet_lDVsGasoline_euro1_annualFuel:sendFleet.lDVsGasoline.euro1.annualFuel,
            sendFleet_lDVsGasoline_euro2_numVehicles:sendFleet.lDVsGasoline.euro2.numVehicles, sendFleet_lDVsGasoline_euro2_annualMileage:sendFleet.lDVsGasoline.euro2.annualMileage, sendFleet_lDVsGasoline_euro2_annualFuel:sendFleet.lDVsGasoline.euro2.annualFuel,
            sendFleet_lDVsGasoline_euro3_numVehicles:sendFleet.lDVsGasoline.euro3.numVehicles, sendFleet_lDVsGasoline_euro3_annualMileage:sendFleet.lDVsGasoline.euro3.annualMileage, sendFleet_lDVsGasoline_euro3_annualFuel:sendFleet.lDVsGasoline.euro3.annualFuel,
            sendFleet_lDVsGasoline_euro4_numVehicles:sendFleet.lDVsGasoline.euro4.numVehicles, sendFleet_lDVsGasoline_euro4_annualMileage:sendFleet.lDVsGasoline.euro4.annualMileage, sendFleet_lDVsGasoline_euro4_annualFuel:sendFleet.lDVsGasoline.euro4.annualFuel,
            sendFleet_lDVsGasoline_euro5_numVehicles:sendFleet.lDVsGasoline.euro5.numVehicles, sendFleet_lDVsGasoline_euro5_annualMileage:sendFleet.lDVsGasoline.euro5.annualMileage, sendFleet_lDVsGasoline_euro5_annualFuel:sendFleet.lDVsGasoline.euro5.annualFuel,
            sendFleet_lDVsGasoline_euro6_numVehicles:sendFleet.lDVsGasoline.euro6.numVehicles, sendFleet_lDVsGasoline_euro6_annualMileage:sendFleet.lDVsGasoline.euro6.annualMileage, sendFleet_lDVsGasoline_euro6_annualFuel:sendFleet.passengerSUVsGasoline.euro6.annualFuel,
            
            sendFleet_lDVsDiesel_preEuro_numVehicles:sendFleet.lDVsDiesel.preEuro.numVehicles, sendFleet_lDVsDiesel_preEuro_annualMileage:sendFleet.lDVsDiesel.preEuro.annualMileage, sendFleet_lDVsDiesel_preEuro_annualFuel:sendFleet.lDVsDiesel.preEuro.annualFuel,
            sendFleet_lDVsDiesel_euro1_numVehicles:sendFleet.lDVsDiesel.euro1.numVehicles, sendFleet_lDVsDiesel_euro1_annualMileage:sendFleet.lDVsDiesel.euro1.annualMileage, sendFleet_lDVsDiesel_euro1_annualFuel:sendFleet.lDVsDiesel.euro1.annualFuel,
            sendFleet_lDVsDiesel_euro2_numVehicles:sendFleet.lDVsDiesel.euro2.numVehicles, sendFleet_lDVsDiesel_euro2_annualMileage:sendFleet.lDVsDiesel.euro2.annualMileage, sendFleet_lDVsDiesel_euro2_annualFuel:sendFleet.lDVsDiesel.euro2.annualFuel,
            sendFleet_lDVsDiesel_euro3_numVehicles:sendFleet.lDVsDiesel.euro3.numVehicles, sendFleet_lDVsDiesel_euro3_annualMileage:sendFleet.lDVsDiesel.euro3.annualMileage, sendFleet_lDVsDiesel_euro3_annualFuel:sendFleet.lDVsDiesel.euro3.annualFuel,
            sendFleet_lDVsDiesel_euro4_numVehicles:sendFleet.lDVsDiesel.euro4.numVehicles, sendFleet_lDVsDiesel_euro4_annualMileage:sendFleet.lDVsDiesel.euro4.annualMileage, sendFleet_lDVsDiesel_euro4_annualFuel:sendFleet.lDVsDiesel.euro4.annualFuel,
            sendFleet_lDVsDiesel_euro5_numVehicles:sendFleet.lDVsDiesel.euro5.numVehicles, sendFleet_lDVsDiesel_euro5_annualMileage:sendFleet.lDVsDiesel.euro5.annualMileage, sendFleet_lDVsDiesel_euro5_annualFuel:sendFleet.lDVsDiesel.euro5.annualFuel,
            sendFleet_lDVsDiesel_euro6_numVehicles:sendFleet.lDVsDiesel.euro6.numVehicles, sendFleet_lDVsDiesel_euro6_annualMileage:sendFleet.lDVsDiesel.euro6.annualMileage, sendFleet_lDVsDiesel_euro6_annualFuel:sendFleet.passengerSUVsGasoline.euro6.annualFuel,
            
            sendFleet_mDVsDiesel_preEuro_numVehicles:sendFleet.mDVsDiesel.preEuro.numVehicles, sendFleet_mDVsDiesel_preEuro_annualMileage:sendFleet.mDVsDiesel.preEuro.annualMileage, sendFleet_mDVsDiesel_preEuro_annualFuel:sendFleet.mDVsDiesel.preEuro.annualFuel,
            sendFleet_mDVsDiesel_euro1_numVehicles:sendFleet.mDVsDiesel.euro1.numVehicles, sendFleet_mDVsDiesel_euro1_annualMileage:sendFleet.mDVsDiesel.euro1.annualMileage, sendFleet_mDVsDiesel_euro1_annualFuel:sendFleet.mDVsDiesel.euro1.annualFuel,
            sendFleet_mDVsDiesel_euro2_numVehicles:sendFleet.mDVsDiesel.euro2.numVehicles, sendFleet_mDVsDiesel_euro2_annualMileage:sendFleet.mDVsDiesel.euro2.annualMileage, sendFleet_mDVsDiesel_euro2_annualFuel:sendFleet.mDVsDiesel.euro2.annualFuel,
            sendFleet_mDVsDiesel_euro3_numVehicles:sendFleet.mDVsDiesel.euro3.numVehicles, sendFleet_mDVsDiesel_euro3_annualMileage:sendFleet.mDVsDiesel.euro3.annualMileage, sendFleet_mDVsDiesel_euro3_annualFuel:sendFleet.mDVsDiesel.euro3.annualFuel,
            sendFleet_mDVsDiesel_euro4_numVehicles:sendFleet.mDVsDiesel.euro4.numVehicles, sendFleet_mDVsDiesel_euro4_annualMileage:sendFleet.mDVsDiesel.euro4.annualMileage, sendFleet_mDVsDiesel_euro4_annualFuel:sendFleet.mDVsDiesel.euro4.annualFuel,
            sendFleet_mDVsDiesel_euro5_numVehicles:sendFleet.mDVsDiesel.euro5.numVehicles, sendFleet_mDVsDiesel_euro5_annualMileage:sendFleet.mDVsDiesel.euro5.annualMileage, sendFleet_mDVsDiesel_euro5_annualFuel:sendFleet.mDVsDiesel.euro5.annualFuel,
            sendFleet_mDVsDiesel_euro6_numVehicles:sendFleet.mDVsDiesel.euro6.numVehicles, sendFleet_mDVsDiesel_euro6_annualMileage:sendFleet.mDVsDiesel.euro6.annualMileage, sendFleet_mDVsDiesel_euro6_annualFuel:sendFleet.passengerSUVsGasoline.euro6.annualFuel,
            
            sendFleet_hDVsDiesel_preEuro_numVehicles:sendFleet.hDVsDiesel.preEuro.numVehicles, sendFleet_hDVsDiesel_preEuro_annualMileage:sendFleet.hDVsDiesel.preEuro.annualMileage, sendFleet_hDVsDiesel_preEuro_annualFuel:sendFleet.hDVsDiesel.preEuro.annualFuel,
            sendFleet_hDVsDiesel_euro1_numVehicles:sendFleet.hDVsDiesel.euro1.numVehicles, sendFleet_hDVsDiesel_euro1_annualMileage:sendFleet.hDVsDiesel.euro1.annualMileage, sendFleet_hDVsDiesel_euro1_annualFuel:sendFleet.hDVsDiesel.euro1.annualFuel,
            sendFleet_hDVsDiesel_euro2_numVehicles:sendFleet.hDVsDiesel.euro2.numVehicles, sendFleet_hDVsDiesel_euro2_annualMileage:sendFleet.hDVsDiesel.euro2.annualMileage, sendFleet_hDVsDiesel_euro2_annualFuel:sendFleet.hDVsDiesel.euro2.annualFuel,
            sendFleet_hDVsDiesel_euro3_numVehicles:sendFleet.hDVsDiesel.euro3.numVehicles, sendFleet_hDVsDiesel_euro3_annualMileage:sendFleet.hDVsDiesel.euro3.annualMileage, sendFleet_hDVsDiesel_euro3_annualFuel:sendFleet.hDVsDiesel.euro3.annualFuel,
            sendFleet_hDVsDiesel_euro4_numVehicles:sendFleet.hDVsDiesel.euro4.numVehicles, sendFleet_hDVsDiesel_euro4_annualMileage:sendFleet.hDVsDiesel.euro4.annualMileage, sendFleet_hDVsDiesel_euro4_annualFuel:sendFleet.hDVsDiesel.euro4.annualFuel,
            sendFleet_hDVsDiesel_euro5_numVehicles:sendFleet.hDVsDiesel.euro5.numVehicles, sendFleet_hDVsDiesel_euro5_annualMileage:sendFleet.hDVsDiesel.euro5.annualMileage, sendFleet_hDVsDiesel_euro5_annualFuel:sendFleet.hDVsDiesel.euro5.annualFuel,
            sendFleet_hDVsDiesel_euro6_numVehicles:sendFleet.hDVsDiesel.euro6.numVehicles, sendFleet_hDVsDiesel_euro6_annualMileage:sendFleet.hDVsDiesel.euro6.annualMileage, sendFleet_hDVsDiesel_euro6_annualFuel:sendFleet.passengerSUVsGasoline.euro6.annualFuel,
            
            sendFleet_motorCycles_fourStroke_numVehicles:sendFleet.motorCycles.fourStroke.numVehicles, sendFleet_motorCycles_fourStroke_annualMileage:sendFleet.motorCycles.fourStroke.annualMileage, sendFleet_motorCycles_fourStroke_annualFuel:sendFleet.motorCycles.fourStroke.annualFuel,
            sendFleet_motorCycles_5_numVehicles:sendFleet.motorCycles.twoStroke.numVehicles, sendFleet_motorCycles_twoStroke_annualMileage:sendFleet.motorCycles.twoStroke.annualMileage, sendFleet_motorCycles_twoStroke_annualFuel:sendFleet.motorCycles.twoStroke.annualFuel,
            sendFleet_motorCycles_electric_numVehicles:sendFleet.motorCycles.electric.numVehicles, sendFleet_motorCycles_electric_annualMileage:sendFleet.motorCycles.electric.annualMileage, sendFleet_motorCycles_electric_annualFuel:sendFleet.motorCycles.electric.annualFuel,

            sendFleet_generators_diesel_numVehicles:sendFleet.generators.diesel.numVehicles, sendFleet_generators_diesel_annualFuel:sendFleet.generators.diesel.annualFuel
        }

        //console.log(JSON.stringify(sendFleet));
        //console.log(JSON.stringify(fleetData));
        var sendData = JSON.stringify(send);
        //var sendData = JSON.stringify({email:this.currentEmail, fleet:fleetData});
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
  
        let options = new RequestOptions({
            headers: headers
        });

        this.http.post(this.jsurl, sendData, options).subscribe(data=>{
            var loge = data.json();
          
        });

        this.toastr.success('Fleet data Saved Successfully!', "Success!!!",{
            toastLife: 2000,
            newestOnTop: true
        });
        
      
    }



    getjson(){
    }


    //user login modal

    signin() {
        console.log("login Request");
        // console.log("first");
        this._authService.login(this.logEmail, this.logPassword).subscribe(
            data => {
                window.localStorage.setItem('autosave', "enable");

                console.log("Login Success");
                var userinfo = JSON.parse(this.myStorage.getItem("currentUser"));

                this.user.fullName = userinfo.fullName;
                this.user.email = userinfo.email;
                this.user.organ = userinfo.organ;
                this.user.role = "user";
                this.currentEmail = this.user.email;
                this.autosave = (window.localStorage.getItem("autosave") !==null) ? "enable":"disable";

                if(this.autosave == "enable"){
                    var savebtnelement = document.getElementById("savefleetBtn");
                }

                console.log("Login Success");
                this.user.role = "user";
                console.log(this.user.role);
            },
            error => {
                alert("Retype Again");
        });
        // console.log("fourth");
    }


}