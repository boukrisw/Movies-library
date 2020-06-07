import { Component, OnInit } from '@angular/core';
import {TmdbService} from '../services/tmdb.service';
import {AuthenticationService} from '../services/authentication.service';


@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit {
  email:string ='';
  password:string ='';

  searchQuery:string = '';


  constructor(public tmdb: TmdbService, public auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  home(){
    this.tmdb.RechercheTrouve = false;
    this.tmdb.RechrcheResult = null;
  }

  login(){
    this.auth.login(this.email,this.password);
    this.email ='';
    this.password ='';
    this.tmdb.RechercheTrouve = false;
    this.tmdb.RechrcheResult = null;
  }

  logout(){
    this.auth.logout();
    this.tmdb.RechercheTrouve = false;
    this.tmdb.RechrcheResult = null;
  }
  
  async searchClick() {
    if(this.searchQuery != '') await this.tmdb.searchMovie({query : this.searchQuery, region:'FR'});
    this.searchQuery = '';
  }
}
