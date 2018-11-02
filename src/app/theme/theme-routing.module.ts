import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IndexModule} from "./pages/subheader-type-search/index/index.module";
import {ValidationModule} from "../validation/validation.module";

const routes: Routes = [



    {
        "path": "",
        "component": ThemeComponent,
        "canActivate": [AuthGuard],
        "children": [
            {
                "path": "profile",
                "loadChildren": ".\/pages\/default\/profile\/profile.module#ProfileModule"
            },
        ]
    },

    {
        "path": "",
        "component": ThemeComponent,
         "children": [
            {
                "path": "index",
                "loadChildren": ".\/pages\/subheader-type-search\/index\/index.module#IndexModule"
            },
            // {
            //     "path": "test",
            //     "loadChildren": ".\/pages\/subheader-type-search\/test\/test.module#TestModule"
            // },
            {
                "path": "inner",
                "loadChildren": ".\/pages\/default\/inner\/inner.module#InnerModule"
            },

            {
                "path": "air-pollution-and-transport",
                "loadChildren": ".\/pages\/toolkit\/air-pollution\/air-pollution.module#AirPollutionModule"
            },
            {
                "path": "influence-of-technology-on-emissions",
                "loadChildren": ".\/pages\/toolkit\/influence-of-technology\/influence-of-technology.module#TechnologyInfluenceModule"
            },
            {
                "path": "health-impacts",
                "loadChildren": ".\/pages\/toolkit\/health-impacts\/health-impacts.module#HealthImpactsModule"
            },
            {
                "path": "environmental-impacts",
                "loadChildren": ".\/pages\/toolkit\/environmental-impacts\/environmental-impacts.module#EnvironmentalImpactsModule"
            },
            {
                "path": "climate-change-and-the-greenhouse-effect",
                "loadChildren": ".\/pages\/toolkit\/climate-change\/climate-change.module#ClimateChangeModule"
            },
            {
                "path": "journey-management",
                "loadChildren": ".\/pages\/toolkit\/journey-management\/journey-management.module#JourneyManagementModule"
            },
            {
                "path": "eco-driving",
                "loadChildren": ".\/pages\/toolkit\/eco-driving\/eco-driving.module#EcoDrivingModule"
            },
            {
                "path": "maintenance",
                "loadChildren": ".\/pages\/toolkit\/maintenance\/maintenance.module#MaintenanceModule"
            },
            {
                "path": "fuels",
                "loadChildren": ".\/pages\/toolkit\/fuels\/fuels.module#FuelsModule"
            },
            {
                "path": "emission-control-for-diesel-vehicles",
                "loadChildren": ".\/pages\/toolkit\/diesel-emission-control\/diesel-emission-control.module#DieselEmissionsControlModule"
            },
            {
                "path": "emission-control-for-petrol-vehicles",
                "loadChildren": ".\/pages\/toolkit\/petrol-emission-control\/petrol-emission-control.module#PetrolEmissionsControlModule"
            },
            {
                "path": "cleaner-vehicles",
                "loadChildren": ".\/pages\/toolkit\/cleaner-vehicles\/cleaner-vehicles.module#CleanerVehiclesModule"
            },
            {
                "path": "electric-vehicles",
                "loadChildren": ".\/pages\/toolkit\/electric-vehicles\/electric-vehicles.module#ElectricVehiclesModule"
            },
            {
                "path": "generator-alternatives",
                "loadChildren": ".\/pages\/toolkit\/generator-alternatives\/generator-alternatives.module#GeneratorAlternativesModule"
            },
            {
                "path": "case-studies",
                "loadChildren": ".\/pages\/toolkit\/case-studies\/case-studies.module#CaseStudiesModule"
            },
            {
                "path": "strategy-checklist",
                "loadChildren": ".\/pages\/toolkit\/strategy-checklist\/strategy-checklist.module#StrategyChecklistModule"
            },
            {
                "path": "404",
                "loadChildren": ".\/pages\/default\/not-found\/not-found.module#NotFoundModule"
            },
            {
                "path": "",
                "redirectTo": "test",
                "pathMatch": "full"
            }
        ]
    },

    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        // TestModule,
        IndexModule,
        ValidationModule

    ],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }