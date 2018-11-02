import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthService {
    auth0 = new auth0.WebAuth({
        ClientID: ' kC5vf6YDySncnzHrk38p0gmtUb1lCVS0',
        domain: 'cleanfleet.auth0.com',
        responseType: 'token id_token',
        audience: 'http://cleanfleet.auth0.com/userinfo',
        redirectUri: 'http://localhost:4300/callback',
        scope: 'openid'
    });

    constructor(public router:Router) {}

    public login():void {
        this.auth0.authorize();
    }
    
    public handleAuthentication():void {
        this.auth0.parseHash((err, authResult) => {
            if(authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setSession(authResult);

                window.location.href = "/index";
                this.router.navigate(['/index']);
            } else if(err) {
                this.router.navigate(['/login']);
                console.log(err);
            }
        });
    }

    private setSession(authResult):void {
        //set the time that the Access Token will expire
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    public logout():void {
        //remove tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');

        //navigate to the login page
        this.router.navigate(['/login']);
    }

    public isAuthenticated():boolean {
        //Check wheather the current time is past the Access Token expiry time
        const expiresAt = JSON.stringify(localStorage.getItem('expires_at') || '{}');
        return new Date().getTime() < Number(expiresAt);
    }
}

