import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TmdbService} from './services/tmdb.service';
import { FilmsComponent } from './films/films.component';
import { NavigationbarComponent } from './navigationbar/navigationbar.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';


import { environment } from '../environments/environment';

import {AccountComponent } from './account/account.component';
import { ActivityComponent } from './activity/activity.component';
import { DetailsfilmComponent } from './detailsfilm/detailsfilm.component';

@NgModule({
  declarations: [
    AppComponent,
    FilmsComponent,
    NavigationbarComponent,
    AccountComponent,
    ActivityComponent,
    DetailsfilmComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'project-544520034047'),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [TmdbService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
