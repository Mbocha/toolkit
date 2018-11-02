import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {FleetDataService} from "./_services/fleet.data.service";
import {ToastModule} from "ng2-toastr";
import {ChartsModule} from "ng2-charts";
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {Router,ActivatedRoute } from '@angular/router';

@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
    ],
    imports: [
        CommonModule,
        LayoutModule,
        BrowserModule,
        HttpClientModule,
        HttpModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
        FormsModule,
        ChartsModule,
        ReactiveFormsModule,
        ToastModule.forRoot()
    ],
    providers: [ScriptLoaderService,FleetDataService],
    bootstrap: [AppComponent]
})
export class AppModule { }