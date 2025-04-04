import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Route } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { PropertyListComponent } from './app/property/property-list/property-list.component';
import { PropertyCardComponent } from './app/property/property-card/property-card.component';
import { AddPropertyComponent } from './app/property/add-property/add-property.component';
import { PropertyDetailComponent } from './app/property/property-detail/property-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { LoginComponent } from './app/user/login/login.component';
import { RegisterComponent } from './app/user/register/register.component';
import { UserServiceService } from './app/services/user-service.service';
import { AlertifyService } from './app/services/alertify.service';
import { AuthService } from './app/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Component } from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PropertyDetailResolverService } from './app/property/property-detail/property-detail-resolver.service';
import { FilterPipe } from './app/Pipes/filter.pipe';
import { SortPipe } from './app/Pipes/sort.pipe';


const appRoutes: Route[] = [
  { path: '', component: PropertyListComponent }, 
  { path: 'rent-property', component: PropertyListComponent },
  { path: 'add-property', component: AddPropertyComponent }, 
  { path: 'property-detail/:id', component: PropertyDetailComponent, resolve: {prp: PropertyDetailResolverService} }, 
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),
    importProvidersFrom(FormsModule, ReactiveFormsModule, BrowserAnimationsModule, BsDropdownModule, FilterPipe, SortPipe),
    UserServiceService,
    AlertifyService,
    AuthService,
    Component,
    ButtonsModule,
    PropertyDetailResolverService
  ]
}).catch(err => console.error(err));
