import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import {AuthenticationService} from "../../../auth/_services";

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    myStorage = window.localStorage;
    username:string;
    useremail:string;
    userpic:string = "./assets/app/media/img/users/user4.jpg";
    currentEmail:string;
    basepath:string = "https://knowledge.fleetforum.org/public/avatars/";
    role: string;
    constructor(private _authService: AuthenticationService,) {
        
        var userinfo = JSON.parse(this.myStorage.getItem("currentUser"));
        // console.log("user info profile data");
        // console.log(userinfo);
        

        if(userinfo != null){
            this.username = userinfo.fullName;
            this.useremail = userinfo.email;
            if(userinfo.img != "" && userinfo.img != null)this.userpic = this.basepath + userinfo.img;
            this.role = "user";
        }
        else{
            this.username = "Guest";
            this.useremail = "Guest@gmail.com";
            this.role = "guest";
        }

        // this.username = userinfo.fullName;
        // this.useremail = userinfo.email;
        // if(userinfo.img != "" && userinfo.img != null)this.userpic = this.basepath + userinfo.img;
        //if(userinfo.img != null && userinfo.img != "")this.userpic = this.basepath + userinfo.img;
        
        // console.log("profile information");
        // console.log(userinfo);
        this.currentEmail = this.useremail;




    }
    ngOnInit() {

    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

    onSamlLogin() {
        this._authService.samlLogin().subscribe(
            data => {
                window.location.href = data;
            },
            err => {
            }
        )
    }

    smalLogout() {
        this._authService.samlLogout().subscribe(
            data => {
                window.location.href = data;
            },
            err => {
            }
        )
    }
}