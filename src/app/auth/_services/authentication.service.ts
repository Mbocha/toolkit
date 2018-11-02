import { Injectable , ComponentFactoryResolver} from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import {Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { AlertComponent } from '../_directives/alert.component';
import { LoginCustom } from '../_helpers/login-custom';
import { Helpers } from '../../helpers';
import {AppConstants} from "../constants ";

@Injectable()
export class AuthenticationService {
    loading = false;
    constructor(private cfr: ComponentFactoryResolver,private http: Http, private route: ActivatedRoute, private router: Router, private _alertService: AlertService,) {
    }

    login(email: string, password: string) {
        console.log("second");
        console.log(email);
        console.log(password);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});
        
        return this.http.post('https://localhost/api/authenticate', JSON.stringify({ email: email, password: password }), options).map((response: Response) => {
            // login successful if there's a jwt token in the response
            let user = response.json();
            console.log("result------------");
            console.log(user.result);
            var  flag = user.result;
            var userName = user.fullname;
            var userEmail = user.email;
            var token = user.token;
            var organ = user.organ;
            var img = user.img;
            console.log(img);

            if(flag != "ok"){
                this.showAlert('alertSignin');
                this._alertService.error("Wrong Email or Password");
                this.loading = false;
            }

            //var saveData = JSON.stringify({fullName:userName, email:userEmail, img:img, token:token});
            var saveData = JSON.stringify({fullName:userName, email:userEmail, organ:organ, img:img, token:token});
            localStorage.setItem('currentUser', saveData);
        });

        // return this.http.post('https://cleanfleet.fleetforum.org/api/authenticate', JSON.stringify({ email: email, password: password }), options)
        //     .map((response: Response) => {
        //         // login successful if there's a jwt token in the response
        //         let user = response.json();
        //         console.log("result------------");
                
        //         //this.router.navigate(['/index']); 
        //         console.log(user);
                
        //         if (user && user.token) {
        //             // store user details and jwt token in local storage to keep user logged in between page refreshes
        //             localStorage.setItem('currentUser', JSON.stringify(user));
        //         }
        //     });
    }

    samlLogin () {
        return this.http.get(AppConstants.apiURL+'/login')
            .map((response: Response) => {
                return response.json();
            })
    }

    samlLogout () {
        return this.http.get(AppConstants.apiURL+'/logout')
            .map((response: Response) => {
                return response.json();
            })
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('autosave');
    }


    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}