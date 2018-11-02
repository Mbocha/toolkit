import { NgModule } from '@angular/core';
import {
    AfterViewInit, ChangeDetectionStrategy, Input, NgZone, OnChanges, SimpleChange, ViewContainerRef,
} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../helpers';
import {FleetDataService} from "../../../../_services/fleet.data.service";
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {Http,Response, Headers, RequestOptions } from '@angular/http'; 
import { User } from "../../../../models/user";
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';  
import { ActivatedRoute } from '@angular/router';
import { ApplicationRef } from '@angular/core';


//import { MatDialog, MatDialogRef } from '@angular/material';
//import { ConfirmationDialog } from '../confirm-dialog/confirmation-dialog';

import {FleetData} from "../../../../models/fleet_data";
import {FleetSet} from "../../../../models/fleetset";
@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class ProfileComponent implements OnInit {
    //dialogRef: MatDialogRef<ConfirmationDialog>;

    myStorage = window.localStorage;
    mySession = window.sessionStorage;
    currentUsername:string = "demo@demo.com";
    currentUserFleets:string = "demo@demo.com_fleets";
    currentEmail = "member@fleetforum.org";
    myFleets: any;
    
    public FLEETSET = [];
    
    fleetData = new FleetData();
    exportFleetData = new FleetData;
    
    url = 'https://backend.cleanfleet.fleetforum.org/profileout';
    jsurl='https://backend.cleanfleet.fleetforum.org/profilein';
    fleeturl = 'https://backend.cleanfleet.fleetforum.org/fleetRequest';
    delurl = 'https://backend.cleanfleet.fleetforum.org/del';
    
    // url = 'https://localhost/profileout';
    // jsurl='https://localhost/profilein';
    // fleeturl = 'https://localhost/fleetRequest';
    // delurl = 'https://localhost/del';
    
    username:string;
    useremail:string;
    userpic:string = "./assets/app/media/img/users/default.png";
    basepath:string = "https://knowledge.fleetforum.org/public/avatars/";

    user = {
        fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
        organ: "",
        expert: "",

        phoneNum: "",
        email:   "", // this is the email input value
        imgurl: ""
    } as User;
    //customized end

    constructor(
                private router: Router, 
                private fleetDataService:FleetDataService,
                private http: Http,
                public appRef: ApplicationRef, 
                private httpClient : HttpClient,
                private toastr?: ToastsManager,                
                vcr?: ViewContainerRef,
                private formBuilder?: FormBuilder) {

        this.myFleets = (this.myStorage.getItem(this.currentUserFleets)!==null) ? JSON.parse(this.myStorage.getItem(this.currentUserFleets)) : [];
        var userinfo = JSON.parse(this.myStorage.getItem("currentUser"));
        
        this.username = userinfo.fullName;
        this.useremail = userinfo.email;
        if(userinfo.img != "" && userinfo.img != null)this.userpic = this.basepath + userinfo.img;


        //this.user.fullName = userinfo["fullName"];
        this.user.fullName = userinfo.fullName;
        //this.user.email = userinfo["email"];
        this.user.email = userinfo.email;
        //this.user.organ = userinfo['organ'];
        this.user.organ = userinfo.organ;
        
        console.log(this.user);
        this.currentEmail = this.user.email;
        this.toastr.setRootViewContainerRef(vcr);
        
    }

   
    ngOnInit() {
        // we are just testing sharing data using services
        this.getjson();
    }


    exportAndDownloadCsv(event:Event,clickedFleetKey:any) {
        // is the form valid or not
        
        event.preventDefault();
        
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let options = new RequestOptions({
            headers: headers
        });  

        ///console.log(clickedFleetKey);

        var fleetRequest = JSON.stringify({email:this.currentEmail, fleetname:clickedFleetKey});
        // var fleetRequest = JSON.stringify({email:this.user.email, fleetname:clickedFleetKey});

        console.log(fleetRequest);
        this.http.post(this.fleeturl, fleetRequest, options).subscribe(data=>{
            
            var log = data.json();
            
            console.log("Click Packet");
            console.log(log);

            var tbl1 = log.tbl1;
            this.exportFleetData.generalInfo.fleetName = tbl1.item1;
            this.exportFleetData.generalInfo.localCurrency = tbl1.item2;
            this.exportFleetData.generalInfo.petrolPrice = tbl1.item3;
            this.exportFleetData.generalInfo.dieselPrice = tbl1.item4;
            this.exportFleetData.generalInfo.elecPrice = tbl1.item5;            
            this.exportFleetData.generalInfo.fossilFuelElec = tbl1.item6;
            this.exportFleetData.generalInfo.sulphurLevel = tbl1.item7;
            
            
            var tbl2 = log.tbl2;
            this.exportFleetData.passengerCarsGasoline.preEuro.numVehicles = tbl2.item1;
            this.exportFleetData.passengerCarsGasoline.preEuro.annualMileage = tbl2.item2;
            this.exportFleetData.passengerCarsGasoline.preEuro.annualFuel = tbl2.item3;

            this.exportFleetData.passengerCarsGasoline.euro1.numVehicles = tbl2.item4;
            this.exportFleetData.passengerCarsGasoline.euro1.annualMileage = tbl2.item5;
            this.exportFleetData.passengerCarsGasoline.euro1.annualFuel = tbl2.item6;

            this.exportFleetData.passengerCarsGasoline.euro2.numVehicles = tbl2.item7;
            this.exportFleetData.passengerCarsGasoline.euro2.annualMileage = tbl2.item8;
            this.exportFleetData.passengerCarsGasoline.euro2.annualFuel = tbl2.item9;

            this.exportFleetData.passengerCarsGasoline.euro3.numVehicles = tbl2.item10;
            this.exportFleetData.passengerCarsGasoline.euro3.annualMileage = tbl2.item11;
            this.exportFleetData.passengerCarsGasoline.euro3.annualFuel = tbl2.item12;

            this.exportFleetData.passengerCarsGasoline.euro4.numVehicles = tbl2.item13;
            this.exportFleetData.passengerCarsGasoline.euro4.annualMileage = tbl2.item14;
            this.exportFleetData.passengerCarsGasoline.euro4.annualFuel = tbl2.item15;

            this.exportFleetData.passengerCarsGasoline.euro5.numVehicles = tbl2.item16;
            this.exportFleetData.passengerCarsGasoline.euro5.annualMileage = tbl2.item17;
            this.exportFleetData.passengerCarsGasoline.euro5.annualFuel = tbl2.item18;

            this.exportFleetData.passengerCarsGasoline.euro6.numVehicles = tbl2.item19;
            this.exportFleetData.passengerCarsGasoline.euro6.annualMileage = tbl2.item20;
            this.exportFleetData.passengerCarsGasoline.euro6.annualFuel = tbl2.item21;

            
            var tbl3 = log.tbl3;
            this.exportFleetData.passengerCarsDiesel.euro3.numVehicles = tbl3.item1;
            this.exportFleetData.passengerCarsDiesel.euro3.annualMileage = tbl3.item2;
            this.exportFleetData.passengerCarsDiesel.euro3.annualFuel = tbl3.item3;

            this.exportFleetData.passengerCarsDiesel.euro4.numVehicles = tbl3.item4;
            this.exportFleetData.passengerCarsDiesel.euro4.annualMileage = tbl3.item5;
            this.exportFleetData.passengerCarsDiesel.euro4.annualFuel = tbl3.item6;

            this.exportFleetData.passengerCarsDiesel.euro5.numVehicles = tbl3.item7;
            this.exportFleetData.passengerCarsDiesel.euro5.annualMileage = tbl3.item8;
            this.exportFleetData.passengerCarsDiesel.euro5.annualFuel = tbl3.item9;

            this.exportFleetData.passengerCarsDiesel.euro6.numVehicles = tbl3.item10;
            this.exportFleetData.passengerCarsDiesel.euro6.annualMileage = tbl3.item11;
            this.exportFleetData.passengerCarsDiesel.euro6.annualFuel = tbl3.item12;

            
            var tbl4 = log.tbl4;
            this.exportFleetData.passengerCarsElectric.hybridElectric.numVehicles = tbl4.item1;
            this.exportFleetData.passengerCarsElectric.hybridElectric.annualMileage = tbl4.item2;
            this.exportFleetData.passengerCarsElectric.hybridElectric.annualFuel = tbl4.item3;

            this.exportFleetData.passengerCarsElectric.plugInHybridElectric.numVehicles = tbl4.item4;
            this.exportFleetData.passengerCarsElectric.plugInHybridElectric.annualMileage = tbl4.item5;
            this.exportFleetData.passengerCarsElectric.plugInHybridElectric.annualFuel = tbl4.item6;

            this.exportFleetData.passengerCarsElectric.batteryElectric.numVehicles = tbl4.item7;
            this.exportFleetData.passengerCarsElectric.batteryElectric.annualMileage = tbl4.item8;
            this.exportFleetData.passengerCarsElectric.batteryElectric.annualFuel = tbl4.item9;


            var tbl5 = log.tbl5;
            this.exportFleetData.passengerSUVsGasoline.preEuro.numVehicles = tbl5.item1;
            this.exportFleetData.passengerSUVsGasoline.preEuro.annualMileage = tbl5.item2;
            this.exportFleetData.passengerSUVsGasoline.preEuro.annualFuel = tbl5.item3;

            this.exportFleetData.passengerSUVsGasoline.euro1.numVehicles = tbl5.item4;
            this.exportFleetData.passengerSUVsGasoline.euro1.annualMileage = tbl5.item5;
            this.exportFleetData.passengerSUVsGasoline.euro1.annualFuel = tbl5.item6;

            this.exportFleetData.passengerSUVsGasoline.euro2.numVehicles = tbl5.item7;
            this.exportFleetData.passengerSUVsGasoline.euro2.annualMileage = tbl5.item8;
            this.exportFleetData.passengerSUVsGasoline.euro2.annualFuel = tbl5.item9;

            this.exportFleetData.passengerSUVsGasoline.euro3.numVehicles = tbl5.item10;
            this.exportFleetData.passengerSUVsGasoline.euro3.annualMileage = tbl5.item11;
            this.exportFleetData.passengerSUVsGasoline.euro3.annualFuel = tbl5.item12;

            this.exportFleetData.passengerSUVsGasoline.euro4.numVehicles = tbl5.item13;
            this.exportFleetData.passengerSUVsGasoline.euro4.annualMileage = tbl5.item14;
            this.exportFleetData.passengerSUVsGasoline.euro4.annualFuel = tbl5.item15;

            this.exportFleetData.passengerSUVsGasoline.euro5.numVehicles = tbl5.item16;
            this.exportFleetData.passengerSUVsGasoline.euro5.annualMileage = tbl5.item17;
            this.exportFleetData.passengerSUVsGasoline.euro5.annualFuel = tbl5.item18;

            this.exportFleetData.passengerSUVsGasoline.euro6.numVehicles = tbl5.item19;
            this.exportFleetData.passengerSUVsGasoline.euro6.annualMileage = tbl5.item20;
            this.exportFleetData.passengerSUVsGasoline.euro6.annualFuel = tbl5.item21;


            var tbl6 = log.tbl6;
            this.exportFleetData.passengerSUVsDiesel.preEuro.numVehicles = tbl6.item1;
            this.exportFleetData.passengerSUVsDiesel.preEuro.annualMileage = tbl6.item2;
            this.exportFleetData.passengerSUVsDiesel.preEuro.annualFuel = tbl6.item3;

            this.exportFleetData.passengerSUVsDiesel.euro1.numVehicles = tbl6.item4;
            this.exportFleetData.passengerSUVsDiesel.euro1.annualMileage = tbl6.item5;
            this.exportFleetData.passengerSUVsDiesel.euro1.annualFuel = tbl6.item6;

            this.exportFleetData.passengerSUVsDiesel.euro2.numVehicles = tbl6.item7;
            this.exportFleetData.passengerSUVsDiesel.euro2.annualMileage = tbl6.item8;
            this.exportFleetData.passengerSUVsDiesel.euro2.annualFuel = tbl6.item9;

            this.exportFleetData.passengerSUVsDiesel.euro3.numVehicles = tbl6.item10;
            this.exportFleetData.passengerSUVsDiesel.euro3.annualMileage = tbl6.item11;
            this.exportFleetData.passengerSUVsDiesel.euro3.annualFuel = tbl6.item12;

            this.exportFleetData.passengerSUVsDiesel.euro4.numVehicles = tbl6.item13;
            this.exportFleetData.passengerSUVsDiesel.euro4.annualMileage = tbl6.item14;
            this.exportFleetData.passengerSUVsDiesel.euro4.annualFuel = tbl6.item15;

            this.exportFleetData.passengerSUVsDiesel.euro5.numVehicles = tbl6.item16;
            this.exportFleetData.passengerSUVsDiesel.euro5.annualMileage = tbl6.item17;
            this.exportFleetData.passengerSUVsDiesel.euro5.annualFuel = tbl6.item18;

            this.exportFleetData.passengerSUVsDiesel.euro6.numVehicles = tbl6.item19;
            this.exportFleetData.passengerSUVsDiesel.euro6.annualMileage = tbl6.item20;
            this.exportFleetData.passengerSUVsDiesel.euro6.annualFuel = tbl6.item21;


            var tbl7 = log.tbl7;
            this.exportFleetData.passengerSUVsElectric.hybridElectric.numVehicles = tbl7.item1;
            this.exportFleetData.passengerSUVsElectric.hybridElectric.annualMileage = tbl7.item2;
            this.exportFleetData.passengerSUVsElectric.hybridElectric.annualFuel = tbl7.item3;

            this.exportFleetData.passengerSUVsElectric.plugInHybridElectric.numVehicles = tbl7.item4;
            this.exportFleetData.passengerSUVsElectric.plugInHybridElectric.annualMileage = tbl7.item5;
            this.exportFleetData.passengerSUVsElectric.plugInHybridElectric.annualFuel = tbl7.item6;

            this.exportFleetData.passengerSUVsElectric.batteryElectric.numVehicles = tbl7.item7;
            this.exportFleetData.passengerSUVsElectric.batteryElectric.annualMileage = tbl7.item8;
            this.exportFleetData.passengerSUVsElectric.batteryElectric.annualFuel = tbl7.item9;


            var tbl8 = log.tbl8;
            this.exportFleetData.lDVsGasoline.preEuro.numVehicles = tbl8.item1;
            this.exportFleetData.lDVsGasoline.preEuro.annualMileage = tbl8.item2;
            this.exportFleetData.lDVsGasoline.preEuro.annualFuel = tbl8.item3;

            this.exportFleetData.lDVsGasoline.euro1.numVehicles = tbl8.item4;
            this.exportFleetData.lDVsGasoline.euro1.annualMileage = tbl8.item5;
            this.exportFleetData.lDVsGasoline.euro1.annualFuel = tbl8.item6;

            this.exportFleetData.lDVsGasoline.euro2.numVehicles = tbl8.item7;
            this.exportFleetData.lDVsGasoline.euro2.annualMileage = tbl8.item8;
            this.exportFleetData.lDVsGasoline.euro2.annualFuel = tbl8.item9;

            this.exportFleetData.lDVsGasoline.euro3.numVehicles = tbl8.item10;
            this.exportFleetData.lDVsGasoline.euro3.annualMileage = tbl8.item11;
            this.exportFleetData.lDVsGasoline.euro3.annualFuel = tbl8.item12;

            this.exportFleetData.lDVsGasoline.euro4.numVehicles = tbl8.item13;
            this.exportFleetData.lDVsGasoline.euro4.annualMileage = tbl8.item14;
            this.exportFleetData.lDVsGasoline.euro4.annualFuel = tbl8.item15;

            this.exportFleetData.lDVsGasoline.euro5.numVehicles = tbl8.item16;
            this.exportFleetData.lDVsGasoline.euro5.annualMileage = tbl8.item17;
            this.exportFleetData.lDVsGasoline.euro5.annualFuel = tbl8.item18;

            this.exportFleetData.lDVsGasoline.euro6.numVehicles = tbl8.item19;
            this.exportFleetData.lDVsGasoline.euro6.annualMileage = tbl8.item20;
            this.exportFleetData.lDVsGasoline.euro6.annualFuel = tbl8.item21;


            var tbl9 = log.tbl9;
            this.exportFleetData.lDVsDiesel.preEuro.numVehicles = tbl9.item1;
            this.exportFleetData.lDVsDiesel.preEuro.annualMileage = tbl9.item2;
            this.exportFleetData.lDVsDiesel.preEuro.annualFuel = tbl9.item3;

            this.exportFleetData.lDVsDiesel.euro1.numVehicles = tbl9.item4;
            this.exportFleetData.lDVsDiesel.euro1.annualMileage = tbl9.item5;
            this.exportFleetData.lDVsDiesel.euro1.annualFuel = tbl9.item6;

            this.exportFleetData.lDVsDiesel.euro2.numVehicles = tbl9.item7;
            this.exportFleetData.lDVsDiesel.euro2.annualMileage = tbl9.item8;
            this.exportFleetData.lDVsDiesel.euro2.annualFuel = tbl9.item9;

            this.exportFleetData.lDVsDiesel.euro3.numVehicles = tbl9.item10;
            this.exportFleetData.lDVsDiesel.euro3.annualMileage = tbl9.item11;
            this.exportFleetData.lDVsDiesel.euro3.annualFuel = tbl9.item12;

            this.exportFleetData.lDVsDiesel.euro4.numVehicles = tbl9.item13;
            this.exportFleetData.lDVsDiesel.euro4.annualMileage = tbl9.item14;
            this.exportFleetData.lDVsDiesel.euro4.annualFuel = tbl9.item15;

            this.exportFleetData.lDVsDiesel.euro5.numVehicles = tbl9.item16;
            this.exportFleetData.lDVsDiesel.euro5.annualMileage = tbl9.item17;
            this.exportFleetData.lDVsDiesel.euro5.annualFuel = tbl9.item18;

            this.exportFleetData.lDVsDiesel.euro6.numVehicles = tbl9.item19;
            this.exportFleetData.lDVsDiesel.euro6.annualMileage = tbl9.item20;
            this.exportFleetData.lDVsDiesel.euro6.annualFuel = tbl9.item21;


            var tbl10 = log.tbl10;
            this.exportFleetData.mDVsDiesel.preEuro.numVehicles = tbl10.item1;
            this.exportFleetData.mDVsDiesel.preEuro.annualMileage = tbl10.item2;
            this.exportFleetData.mDVsDiesel.preEuro.annualFuel = tbl10.item3;

            this.exportFleetData.mDVsDiesel.euro1.numVehicles = tbl10.item4;
            this.exportFleetData.mDVsDiesel.euro1.annualMileage = tbl10.item5;
            this.exportFleetData.mDVsDiesel.euro1.annualFuel = tbl10.item6;

            this.exportFleetData.mDVsDiesel.euro2.numVehicles = tbl10.item7;
            this.exportFleetData.mDVsDiesel.euro2.annualMileage = tbl10.item8;
            this.exportFleetData.mDVsDiesel.euro2.annualFuel = tbl10.item9;

            this.exportFleetData.mDVsDiesel.euro3.numVehicles = tbl10.item10;
            this.exportFleetData.mDVsDiesel.euro3.annualMileage = tbl10.item11;
            this.exportFleetData.mDVsDiesel.euro3.annualFuel = tbl10.item12;

            this.exportFleetData.mDVsDiesel.euro4.numVehicles = tbl10.item13;
            this.exportFleetData.mDVsDiesel.euro4.annualMileage = tbl10.item14;
            this.exportFleetData.mDVsDiesel.euro4.annualFuel = tbl10.item15;

            this.exportFleetData.mDVsDiesel.euro5.numVehicles = tbl10.item16;
            this.exportFleetData.mDVsDiesel.euro5.annualMileage = tbl10.item17;
            this.exportFleetData.mDVsDiesel.euro5.annualFuel = tbl10.item18;

            this.exportFleetData.mDVsDiesel.euro6.numVehicles = tbl10.item19;
            this.exportFleetData.mDVsDiesel.euro6.annualMileage = tbl10.item20;
            this.exportFleetData.mDVsDiesel.euro6.annualFuel = tbl10.item21;


            var tbl11 = log.tbl11;
            this.exportFleetData.hDVsDiesel.preEuro.numVehicles = tbl11.item1;
            this.exportFleetData.hDVsDiesel.preEuro.annualMileage = tbl11.item2;
            this.exportFleetData.hDVsDiesel.preEuro.annualFuel = tbl11.item3;

            this.exportFleetData.hDVsDiesel.euro1.numVehicles = tbl11.item4;
            this.exportFleetData.hDVsDiesel.euro1.annualMileage = tbl11.item5;
            this.exportFleetData.hDVsDiesel.euro1.annualFuel = tbl11.item6;

            this.exportFleetData.hDVsDiesel.euro2.numVehicles = tbl11.item7;
            this.exportFleetData.hDVsDiesel.euro2.annualMileage = tbl11.item8;
            this.exportFleetData.hDVsDiesel.euro2.annualFuel = tbl11.item9;

            this.exportFleetData.hDVsDiesel.euro3.numVehicles = tbl11.item10;
            this.exportFleetData.hDVsDiesel.euro3.annualMileage = tbl11.item11;
            this.exportFleetData.hDVsDiesel.euro3.annualFuel = tbl11.item12;

            this.exportFleetData.hDVsDiesel.euro4.numVehicles = tbl11.item13;
            this.exportFleetData.hDVsDiesel.euro4.annualMileage = tbl11.item14;
            this.exportFleetData.hDVsDiesel.euro4.annualFuel = tbl11.item15;

            this.exportFleetData.hDVsDiesel.euro5.numVehicles = tbl11.item16;
            this.exportFleetData.hDVsDiesel.euro5.annualMileage = tbl11.item17;
            this.exportFleetData.hDVsDiesel.euro5.annualFuel = tbl11.item18;

            this.exportFleetData.hDVsDiesel.euro6.numVehicles = tbl11.item19;
            this.exportFleetData.hDVsDiesel.euro6.annualMileage = tbl11.item20;
            this.exportFleetData.hDVsDiesel.euro6.annualFuel = tbl11.item21;


            var tbl12 = log.tbl12;
            this.exportFleetData.motorCycles.fourStroke.numVehicles = tbl12.item1;
            this.exportFleetData.motorCycles.fourStroke.annualMileage = tbl12.item2;
            this.exportFleetData.motorCycles.fourStroke.annualFuel = tbl12.item3;

            this.exportFleetData.motorCycles.twoStroke.numVehicles = tbl12.item4;
            this.exportFleetData.motorCycles.twoStroke.annualMileage = tbl12.item5;
            this.exportFleetData.motorCycles.twoStroke.annualFuel = tbl12.item6;

            this.exportFleetData.motorCycles.electric.numVehicles = tbl12.item7;
            this.exportFleetData.motorCycles.electric.annualMileage = tbl12.item8;
            this.exportFleetData.motorCycles.electric.annualFuel = tbl12.item9;


            var tbl13 = log.tbl13;
            this.exportFleetData.generators.diesel.numVehicles = tbl13.item1;
            this.exportFleetData.generators.diesel.annualFuel = tbl13.item2;

            console.log(this.exportFleetData);
            let fleetName:string = this.exportFleetData.generalInfo.fleetName;

            fleetName = fleetName.replace(/\s/g, '');
            fleetName = fleetName.replace(/[^A-Za-z0-9]+ ]/g, '').toLowerCase();

            this.exportCSVFile(this.exportFleetData,fleetName);
        });

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


    // openConfirmationDialog() {
    //     this.dialogRef = this.dialog.open(ConfirmationDialog, {
    //       disableClose: false
    //     });
    //     this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"
    
    //     this.dialogRef.afterClosed().subscribe(result => {
    //       if(result) {
    //         // do confirmation actions
    //       }
    //       this.dialogRef = null;
    //     });
    // }

    //Delete Fleet
    deleteFleet(event:Event,clickedFleetKey:any, index:any){
        event.preventDefault();
        console.log(index);
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let options = new RequestOptions({
            headers: headers
        });  

        var deleteRequest = JSON.stringify({email:this.currentEmail, fleetname:clickedFleetKey});
        // var deleteRequest = JSON.stringify({email:this.user.email, fleetname:clickedFleetKey});
        console.log(deleteRequest);

        this.http.post(this.delurl, deleteRequest, options).subscribe(data=>{

        });
        
        var str_index = "#fleet" + index;
        console.log(str_index);
        
        $(str_index).parent().remove();

        this.toastr.success('Delete Data Successfully!', "success!!!",{
            toastLife: 2000,
            newstOnTop: true
        });
    }


    viewFleet(event:Event,clickedFleetKey:any){
        event.preventDefault();
        // change the session data to this
        // or you can use a service to pass data

        // get the data where the saved feet has the keys as the clickedFleetKey variable
        // Read item:
        let clickedItem = JSON.parse(this.myStorage.getItem(clickedFleetKey));
        /*if(clickedItem !=null){
            this.mySession.setItem(this.currentUsername, JSON.stringify(clickedItem));
        }*/

        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let options = new RequestOptions({
            headers: headers
        });  
        
        ///console.log(clickedFleetKey);
        var fleetRequest = JSON.stringify({email:this.currentEmail, fleetname:clickedFleetKey});
        // var fleetRequest = JSON.stringify({email:this.user.email, fleetname:clickedFleetKey});

        console.log(fleetRequest);
        this.http.post(this.fleeturl, fleetRequest, options).subscribe(data=>{
            
            var log = data.json();
            
            console.log("Click Packet");
            console.log(log);
      
            var tbl0 = log.tbl0;
            if(tbl0 != null){
                this.fleetData.actionsRecommended.switchToHevs.hEVFuelEconomy = tbl0.item1;
                this.fleetData.actionsRecommended.switchToHevs.hEVAdditionalCostPerVehicle = tbl0.item2;          
                this.fleetData.actionsRecommended.switchToBEVs.bevCarsKmsPerKWh = tbl0.item3;
                this.fleetData.actionsRecommended.switchToBEVs.bevCarsAdditionalCostPerVehicle = tbl0.item4;
                this.fleetData.actionsRecommended.switchElecMotor.elecBikesKmsPerKWh = tbl0.item5;
                this.fleetData.actionsRecommended.switchElecMotor.elecBikesAdditionalCostPerbike = tbl0.item6;
                this.fleetData.actionsRecommended.switchToNewTrucks.bevTrucksKmPerKWh = tbl0.item7;            
                this.fleetData.actionsRecommended.generatorAlternatives.electricityDemand = tbl0.item8;
                this.fleetData.actionsRecommended.generatorAlternatives.pvItemsCost = tbl0.item9;
            }



            var tbl1 = log.tbl1;
            this.fleetData.generalInfo.fleetName = tbl1.item1;
            this.fleetData.generalInfo.localCurrency = tbl1.item2;
            this.fleetData.generalInfo.petrolPrice = tbl1.item3;
            this.fleetData.generalInfo.dieselPrice = tbl1.item4;
            this.fleetData.generalInfo.elecPrice = tbl1.item5;            
            this.fleetData.generalInfo.fossilFuelElec = tbl1.item6;
            this.fleetData.generalInfo.sulphurLevel = tbl1.item7;
            
            
            var tbl2 = log.tbl2;
            this.fleetData.passengerCarsGasoline.preEuro.numVehicles = tbl2.item1;
            this.fleetData.passengerCarsGasoline.preEuro.annualMileage = tbl2.item2;
            this.fleetData.passengerCarsGasoline.preEuro.annualFuel = tbl2.item3;

            this.fleetData.passengerCarsGasoline.euro1.numVehicles = tbl2.item4;
            this.fleetData.passengerCarsGasoline.euro1.annualMileage = tbl2.item5;
            this.fleetData.passengerCarsGasoline.euro1.annualFuel = tbl2.item6;

            this.fleetData.passengerCarsGasoline.euro2.numVehicles = tbl2.item7;
            this.fleetData.passengerCarsGasoline.euro2.annualMileage = tbl2.item8;
            this.fleetData.passengerCarsGasoline.euro2.annualFuel = tbl2.item9;

            this.fleetData.passengerCarsGasoline.euro3.numVehicles = tbl2.item10;
            this.fleetData.passengerCarsGasoline.euro3.annualMileage = tbl2.item11;
            this.fleetData.passengerCarsGasoline.euro3.annualFuel = tbl2.item12;

            this.fleetData.passengerCarsGasoline.euro4.numVehicles = tbl2.item13;
            this.fleetData.passengerCarsGasoline.euro4.annualMileage = tbl2.item14;
            this.fleetData.passengerCarsGasoline.euro4.annualFuel = tbl2.item15;

            this.fleetData.passengerCarsGasoline.euro5.numVehicles = tbl2.item16;
            this.fleetData.passengerCarsGasoline.euro5.annualMileage = tbl2.item17;
            this.fleetData.passengerCarsGasoline.euro5.annualFuel = tbl2.item18;

            this.fleetData.passengerCarsGasoline.euro6.numVehicles = tbl2.item19;
            this.fleetData.passengerCarsGasoline.euro6.annualMileage = tbl2.item20;
            this.fleetData.passengerCarsGasoline.euro6.annualFuel = tbl2.item21;

            
            var tbl3 = log.tbl3;
            this.fleetData.passengerCarsDiesel.euro3.numVehicles = tbl3.item1;
            this.fleetData.passengerCarsDiesel.euro3.annualMileage = tbl3.item2;
            this.fleetData.passengerCarsDiesel.euro3.annualFuel = tbl3.item3;

            this.fleetData.passengerCarsDiesel.euro4.numVehicles = tbl3.item4;
            this.fleetData.passengerCarsDiesel.euro4.annualMileage = tbl3.item5;
            this.fleetData.passengerCarsDiesel.euro4.annualFuel = tbl3.item6;

            this.fleetData.passengerCarsDiesel.euro5.numVehicles = tbl3.item7;
            this.fleetData.passengerCarsDiesel.euro5.annualMileage = tbl3.item8;
            this.fleetData.passengerCarsDiesel.euro5.annualFuel = tbl3.item9;

            this.fleetData.passengerCarsDiesel.euro6.numVehicles = tbl3.item10;
            this.fleetData.passengerCarsDiesel.euro6.annualMileage = tbl3.item11;
            this.fleetData.passengerCarsDiesel.euro6.annualFuel = tbl3.item12;

            
            var tbl4 = log.tbl4;
            this.fleetData.passengerCarsElectric.hybridElectric.numVehicles = tbl4.item1;
            this.fleetData.passengerCarsElectric.hybridElectric.annualMileage = tbl4.item2;
            this.fleetData.passengerCarsElectric.hybridElectric.annualFuel = tbl4.item3;

            this.fleetData.passengerCarsElectric.plugInHybridElectric.numVehicles = tbl4.item4;
            this.fleetData.passengerCarsElectric.plugInHybridElectric.annualMileage = tbl4.item5;
            this.fleetData.passengerCarsElectric.plugInHybridElectric.annualFuel = tbl4.item6;

            this.fleetData.passengerCarsElectric.batteryElectric.numVehicles = tbl4.item7;
            this.fleetData.passengerCarsElectric.batteryElectric.annualMileage = tbl4.item8;
            this.fleetData.passengerCarsElectric.batteryElectric.annualFuel = tbl4.item9;


            var tbl5 = log.tbl5;
            this.fleetData.passengerSUVsGasoline.preEuro.numVehicles = tbl5.item1;
            this.fleetData.passengerSUVsGasoline.preEuro.annualMileage = tbl5.item2;
            this.fleetData.passengerSUVsGasoline.preEuro.annualFuel = tbl5.item3;

            this.fleetData.passengerSUVsGasoline.euro1.numVehicles = tbl5.item4;
            this.fleetData.passengerSUVsGasoline.euro1.annualMileage = tbl5.item5;
            this.fleetData.passengerSUVsGasoline.euro1.annualFuel = tbl5.item6;

            this.fleetData.passengerSUVsGasoline.euro2.numVehicles = tbl5.item7;
            this.fleetData.passengerSUVsGasoline.euro2.annualMileage = tbl5.item8;
            this.fleetData.passengerSUVsGasoline.euro2.annualFuel = tbl5.item9;

            this.fleetData.passengerSUVsGasoline.euro3.numVehicles = tbl5.item10;
            this.fleetData.passengerSUVsGasoline.euro3.annualMileage = tbl5.item11;
            this.fleetData.passengerSUVsGasoline.euro3.annualFuel = tbl5.item12;

            this.fleetData.passengerSUVsGasoline.euro4.numVehicles = tbl5.item13;
            this.fleetData.passengerSUVsGasoline.euro4.annualMileage = tbl5.item14;
            this.fleetData.passengerSUVsGasoline.euro4.annualFuel = tbl5.item15;

            this.fleetData.passengerSUVsGasoline.euro5.numVehicles = tbl5.item16;
            this.fleetData.passengerSUVsGasoline.euro5.annualMileage = tbl5.item17;
            this.fleetData.passengerSUVsGasoline.euro5.annualFuel = tbl5.item18;

            this.fleetData.passengerSUVsGasoline.euro6.numVehicles = tbl5.item19;
            this.fleetData.passengerSUVsGasoline.euro6.annualMileage = tbl5.item20;
            this.fleetData.passengerSUVsGasoline.euro6.annualFuel = tbl5.item21;


            var tbl6 = log.tbl6;
            this.fleetData.passengerSUVsDiesel.preEuro.numVehicles = tbl6.item1;
            this.fleetData.passengerSUVsDiesel.preEuro.annualMileage = tbl6.item2;
            this.fleetData.passengerSUVsDiesel.preEuro.annualFuel = tbl6.item3;

            this.fleetData.passengerSUVsDiesel.euro1.numVehicles = tbl6.item4;
            this.fleetData.passengerSUVsDiesel.euro1.annualMileage = tbl6.item5;
            this.fleetData.passengerSUVsDiesel.euro1.annualFuel = tbl6.item6;

            this.fleetData.passengerSUVsDiesel.euro2.numVehicles = tbl6.item7;
            this.fleetData.passengerSUVsDiesel.euro2.annualMileage = tbl6.item8;
            this.fleetData.passengerSUVsDiesel.euro2.annualFuel = tbl6.item9;

            this.fleetData.passengerSUVsDiesel.euro3.numVehicles = tbl6.item10;
            this.fleetData.passengerSUVsDiesel.euro3.annualMileage = tbl6.item11;
            this.fleetData.passengerSUVsDiesel.euro3.annualFuel = tbl6.item12;

            this.fleetData.passengerSUVsDiesel.euro4.numVehicles = tbl6.item13;
            this.fleetData.passengerSUVsDiesel.euro4.annualMileage = tbl6.item14;
            this.fleetData.passengerSUVsDiesel.euro4.annualFuel = tbl6.item15;

            this.fleetData.passengerSUVsDiesel.euro5.numVehicles = tbl6.item16;
            this.fleetData.passengerSUVsDiesel.euro5.annualMileage = tbl6.item17;
            this.fleetData.passengerSUVsDiesel.euro5.annualFuel = tbl6.item18;

            this.fleetData.passengerSUVsDiesel.euro6.numVehicles = tbl6.item19;
            this.fleetData.passengerSUVsDiesel.euro6.annualMileage = tbl6.item20;
            this.fleetData.passengerSUVsDiesel.euro6.annualFuel = tbl6.item21;


            var tbl7 = log.tbl7;
            this.fleetData.passengerSUVsElectric.hybridElectric.numVehicles = tbl7.item1;
            this.fleetData.passengerSUVsElectric.hybridElectric.annualMileage = tbl7.item2;
            this.fleetData.passengerSUVsElectric.hybridElectric.annualFuel = tbl7.item3;

            this.fleetData.passengerSUVsElectric.plugInHybridElectric.numVehicles = tbl7.item4;
            this.fleetData.passengerSUVsElectric.plugInHybridElectric.annualMileage = tbl7.item5;
            this.fleetData.passengerSUVsElectric.plugInHybridElectric.annualFuel = tbl7.item6;

            this.fleetData.passengerSUVsElectric.batteryElectric.numVehicles = tbl7.item7;
            this.fleetData.passengerSUVsElectric.batteryElectric.annualMileage = tbl7.item8;
            this.fleetData.passengerSUVsElectric.batteryElectric.annualFuel = tbl7.item9;


            var tbl8 = log.tbl8;
            this.fleetData.lDVsGasoline.preEuro.numVehicles = tbl8.item1;
            this.fleetData.lDVsGasoline.preEuro.annualMileage = tbl8.item2;
            this.fleetData.lDVsGasoline.preEuro.annualFuel = tbl8.item3;

            this.fleetData.lDVsGasoline.euro1.numVehicles = tbl8.item4;
            this.fleetData.lDVsGasoline.euro1.annualMileage = tbl8.item5;
            this.fleetData.lDVsGasoline.euro1.annualFuel = tbl8.item6;

            this.fleetData.lDVsGasoline.euro2.numVehicles = tbl8.item7;
            this.fleetData.lDVsGasoline.euro2.annualMileage = tbl8.item8;
            this.fleetData.lDVsGasoline.euro2.annualFuel = tbl8.item9;

            this.fleetData.lDVsGasoline.euro3.numVehicles = tbl8.item10;
            this.fleetData.lDVsGasoline.euro3.annualMileage = tbl8.item11;
            this.fleetData.lDVsGasoline.euro3.annualFuel = tbl8.item12;

            this.fleetData.lDVsGasoline.euro4.numVehicles = tbl8.item13;
            this.fleetData.lDVsGasoline.euro4.annualMileage = tbl8.item14;
            this.fleetData.lDVsGasoline.euro4.annualFuel = tbl8.item15;

            this.fleetData.lDVsGasoline.euro5.numVehicles = tbl8.item16;
            this.fleetData.lDVsGasoline.euro5.annualMileage = tbl8.item17;
            this.fleetData.lDVsGasoline.euro5.annualFuel = tbl8.item18;

            this.fleetData.lDVsGasoline.euro6.numVehicles = tbl8.item19;
            this.fleetData.lDVsGasoline.euro6.annualMileage = tbl8.item20;
            this.fleetData.lDVsGasoline.euro6.annualFuel = tbl8.item21;


            var tbl9 = log.tbl9;
            this.fleetData.lDVsDiesel.preEuro.numVehicles = tbl9.item1;
            this.fleetData.lDVsDiesel.preEuro.annualMileage = tbl9.item2;
            this.fleetData.lDVsDiesel.preEuro.annualFuel = tbl9.item3;

            this.fleetData.lDVsDiesel.euro1.numVehicles = tbl9.item4;
            this.fleetData.lDVsDiesel.euro1.annualMileage = tbl9.item5;
            this.fleetData.lDVsDiesel.euro1.annualFuel = tbl9.item6;

            this.fleetData.lDVsDiesel.euro2.numVehicles = tbl9.item7;
            this.fleetData.lDVsDiesel.euro2.annualMileage = tbl9.item8;
            this.fleetData.lDVsDiesel.euro2.annualFuel = tbl9.item9;

            this.fleetData.lDVsDiesel.euro3.numVehicles = tbl9.item10;
            this.fleetData.lDVsDiesel.euro3.annualMileage = tbl9.item11;
            this.fleetData.lDVsDiesel.euro3.annualFuel = tbl9.item12;

            this.fleetData.lDVsDiesel.euro4.numVehicles = tbl9.item13;
            this.fleetData.lDVsDiesel.euro4.annualMileage = tbl9.item14;
            this.fleetData.lDVsDiesel.euro4.annualFuel = tbl9.item15;

            this.fleetData.lDVsDiesel.euro5.numVehicles = tbl9.item16;
            this.fleetData.lDVsDiesel.euro5.annualMileage = tbl9.item17;
            this.fleetData.lDVsDiesel.euro5.annualFuel = tbl9.item18;

            this.fleetData.lDVsDiesel.euro6.numVehicles = tbl9.item19;
            this.fleetData.lDVsDiesel.euro6.annualMileage = tbl9.item20;
            this.fleetData.lDVsDiesel.euro6.annualFuel = tbl9.item21;


            var tbl10 = log.tbl10;
            this.fleetData.mDVsDiesel.preEuro.numVehicles = tbl10.item1;
            this.fleetData.mDVsDiesel.preEuro.annualMileage = tbl10.item2;
            this.fleetData.mDVsDiesel.preEuro.annualFuel = tbl10.item3;

            this.fleetData.mDVsDiesel.euro1.numVehicles = tbl10.item4;
            this.fleetData.mDVsDiesel.euro1.annualMileage = tbl10.item5;
            this.fleetData.mDVsDiesel.euro1.annualFuel = tbl10.item6;

            this.fleetData.mDVsDiesel.euro2.numVehicles = tbl10.item7;
            this.fleetData.mDVsDiesel.euro2.annualMileage = tbl10.item8;
            this.fleetData.mDVsDiesel.euro2.annualFuel = tbl10.item9;

            this.fleetData.mDVsDiesel.euro3.numVehicles = tbl10.item10;
            this.fleetData.mDVsDiesel.euro3.annualMileage = tbl10.item11;
            this.fleetData.mDVsDiesel.euro3.annualFuel = tbl10.item12;

            this.fleetData.mDVsDiesel.euro4.numVehicles = tbl10.item13;
            this.fleetData.mDVsDiesel.euro4.annualMileage = tbl10.item14;
            this.fleetData.mDVsDiesel.euro4.annualFuel = tbl10.item15;

            this.fleetData.mDVsDiesel.euro5.numVehicles = tbl10.item16;
            this.fleetData.mDVsDiesel.euro5.annualMileage = tbl10.item17;
            this.fleetData.mDVsDiesel.euro5.annualFuel = tbl10.item18;

            this.fleetData.mDVsDiesel.euro6.numVehicles = tbl10.item19;
            this.fleetData.mDVsDiesel.euro6.annualMileage = tbl10.item20;
            this.fleetData.mDVsDiesel.euro6.annualFuel = tbl10.item21;


            var tbl11 = log.tbl11;
            this.fleetData.hDVsDiesel.preEuro.numVehicles = tbl11.item1;
            this.fleetData.hDVsDiesel.preEuro.annualMileage = tbl11.item2;
            this.fleetData.hDVsDiesel.preEuro.annualFuel = tbl11.item3;

            this.fleetData.hDVsDiesel.euro1.numVehicles = tbl11.item4;
            this.fleetData.hDVsDiesel.euro1.annualMileage = tbl11.item5;
            this.fleetData.hDVsDiesel.euro1.annualFuel = tbl11.item6;

            this.fleetData.hDVsDiesel.euro2.numVehicles = tbl11.item7;
            this.fleetData.hDVsDiesel.euro2.annualMileage = tbl11.item8;
            this.fleetData.hDVsDiesel.euro2.annualFuel = tbl11.item9;

            this.fleetData.hDVsDiesel.euro3.numVehicles = tbl11.item10;
            this.fleetData.hDVsDiesel.euro3.annualMileage = tbl11.item11;
            this.fleetData.hDVsDiesel.euro3.annualFuel = tbl11.item12;

            this.fleetData.hDVsDiesel.euro4.numVehicles = tbl11.item13;
            this.fleetData.hDVsDiesel.euro4.annualMileage = tbl11.item14;
            this.fleetData.hDVsDiesel.euro4.annualFuel = tbl11.item15;

            this.fleetData.hDVsDiesel.euro5.numVehicles = tbl11.item16;
            this.fleetData.hDVsDiesel.euro5.annualMileage = tbl11.item17;
            this.fleetData.hDVsDiesel.euro5.annualFuel = tbl11.item18;

            this.fleetData.hDVsDiesel.euro6.numVehicles = tbl11.item19;
            this.fleetData.hDVsDiesel.euro6.annualMileage = tbl11.item20;
            this.fleetData.hDVsDiesel.euro6.annualFuel = tbl11.item21;


            var tbl12 = log.tbl12;
            this.fleetData.motorCycles.fourStroke.numVehicles = tbl12.item1;
            this.fleetData.motorCycles.fourStroke.annualMileage = tbl12.item2;
            this.fleetData.motorCycles.fourStroke.annualFuel = tbl12.item3;

            this.fleetData.motorCycles.twoStroke.numVehicles = tbl12.item4;
            this.fleetData.motorCycles.twoStroke.annualMileage = tbl12.item5;
            this.fleetData.motorCycles.twoStroke.annualFuel = tbl12.item6;

            this.fleetData.motorCycles.electric.numVehicles = tbl12.item7;
            this.fleetData.motorCycles.electric.annualMileage = tbl12.item8;
            this.fleetData.motorCycles.electric.annualFuel = tbl12.item9;


            var tbl13 = log.tbl13;
            this.fleetData.generators.diesel.numVehicles = tbl13.item1;
            this.fleetData.generators.diesel.annualFuel = tbl13.item2;

            this.mySession.setItem(this.currentEmail, JSON.stringify(this.fleetData));
            // this.mySession.setItem(this.user.email, JSON.stringify(this.fleetData));
            this.mySession.setItem("user_email", this.user.email);

            console.log("this is my results");
            console.log(this.fleetData);
            //$("#option2").attr("selected");
            this.fleetDataService.isSetFleetClicked(true);
            this.router.navigate(['/index']);
        });

        

        //set there was a clicked fleet to navigate to a certain tab
        
        
    }
  
    myFunction()
    {
        console.log(111);
    }  


    getjson(){
        
        console.log("My App");
        var emailinfo=JSON.stringify({email:this.currentEmail});
        // var emailinfo=JSON.stringify({email:this.user.email});
        console.log(emailinfo);

        let headers = new Headers({
          'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
            headers: headers
        });

        this.http.post(this.url,emailinfo,options).subscribe(data => {
            console.log("testing value");
            console.log(data.json());
            var loge=data.json();
            
            //this.user.fullName = loge.fullname;
            //console.log(this.user.fullName.value);
            // this.user.imgurl = loge.imgurl;
            // this.user.organ = loge.organ;
            // this.user.phoneNum = loge.phoneNum;
            // this.user.email = loge.email;
            // this.user.expert = loge.expert;
            
            var nameArray = loge.fleetname;
            var createArray = loge.createdatedata;
            var updateArray = loge.updatedata;
            var length = nameArray.length;

            console.log(length);
            var NAMES = [];
            for(var i=0; i < length ; i++){
                
                let fleetset = {name:nameArray[i], create:createArray[i], update:updateArray[i]};
                this.FLEETSET.push(fleetset);
                
                /*this.fleetset.push(nameArray[i], createArray[i], updateArray[i]);
                console.log(this.fleetset[i].name);
                console.log(this.fleetset[i].create);
                console.log(this.fleetset[i].update);*/
                
            }

            
            /*this.fleetset.name = loge.fleetname;
            this.fleetset.create = loge.createdatedata;
            this.fleetset.update = loge.updatedata;*/
            
            $( "#important" ).trigger( "click" );
            
        });       
        console.log("ok");
        
    }

    onSaveList(user: User){
              
        var myData = JSON.stringify({fullName:user.fullName.value, organ:user.organ, expert:user.expert, phoneNum:user.phoneNum, email:user.email, imgurl:user.imgurl});
        let headers = new Headers({
          'Content-Type': 'application/json'
        });

        let options = new RequestOptions({
            headers: headers
        });
        
      
        this.http.post(this.jsurl,myData, options).subscribe(data=>{
            var res = data.json();
            res = res.result;

            console.log(res);
            if(res == "success"){
                this.toastr.success('User data Save Successfully!', "success!!!",{
                    toastLife: 2000,
                    newstOnTop: true
                });

                this.mySession.setItem("user_email", this.user.email);
            }
            else{
                this.toastr.error('Please confirm your Profile', 'Error Saving Data', {
                    toastLife: 5000,
                    newestOnTop:true
                });
                return;
            }
        })
    }


}