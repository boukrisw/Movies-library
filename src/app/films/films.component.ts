import { Component, OnInit } from '@angular/core';
import {TmdbService} from '../services/tmdb.service';
import {AuthenticationService} from '../services/authentication.service';


import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
 
//firebase.initializeApp(environment.firebase);

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsComponent implements OnInit {


  Fname:string = '';
  Lname:string = '';
  mail:string = '';
  pwd:string = '';
  birthday:string = '';

 // database = firebase.database;
  
  likes = firebase.database().ref('/likes/');
  dislikes = firebase.database().ref('/dislikes/');

  static tabLikes : pair[] = [];
  static tabDisLikes : pair[] = [];
  
  

  constructor(public tmdb: TmdbService, public auth: AuthenticationService) { 
    this.init();
  }
  
  gotDatalikes(data){
    FilmsComponent.tabLikes = [];
    let films = data.val();
    if(films != null){
      let keys = Object.keys(films);
      keys.map( (elt,i) => {
        let k = keys[i];
        let key = Object.keys(films[k]);
        FilmsComponent.tabLikes.push({id:elt,nb:key.length})
      })
    }
  }

  gotDatadislikes(data){
    FilmsComponent.tabDisLikes = [];
    let films = data.val();
    if(films !=null){
      let keys = Object.keys(films);
      keys.map( (elt,i) => {
        let k = keys[i];
        let key = Object.keys(films[k]);
        FilmsComponent.tabDisLikes.push({id:elt,nb:key.length})
      })
    }
    //console.log('this.tabdisLikes',FilmsComponent.tabDisLikes[0]);
  }


  errorData(data){
    console.log(data);
  }

  ngOnInit(): void {
  }

  async init(){
    await this.tmdb.popularFilms();
    await this.tmdb.upComingFilms();

    FilmsComponent.tabLikes = [];

    this.likes.on('value',this.gotDatalikes,this.errorData);
    this.dislikes.on('value',this.gotDatadislikes,this.errorData);

    this.Fname = '';
    this.Lname = '';
    this.mail = '';
    this.pwd = '';
    this.birthday = '';
  }

  CreateAccount(){
    this.auth.signup(this.mail,this.pwd,this.Fname,this.Lname,this.birthday);
    this.Fname =''
    this.Lname =''
    this.mail=''
    this.pwd=''
    this.birthday=''
    this.tmdb.RechercheTrouve = false;
    this.tmdb.RechrcheResult = null;
  }

  async click(id : number){
    this.tmdb.idFilm = id;
    this.tmdb.filmdetail = (await this.tmdb.getMovie(id));
  }


  like(id : number){
    let like,unlike;
    //console.log('Like')
    if(this.auth.connected){
      firebase.database().ref('/likes/' +id+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        like = snapshot.numChildren();
      }).then(() => {
        if(like == 1){
          firebase.database().ref('/likes/' +id+'/'+ this.auth.userId).remove();
          //console.log('remove like')
        }else if(like == 0){
          var currentdate = new Date();
          let date = '';
          
          if(currentdate.getDate() < 10) date = date + '0';
          date = date + currentdate.getDate() + "/"
          
          if(currentdate.getMonth()+1 < 10) date = date + '0';
          date = date + (currentdate.getMonth()+1)  + "/" 
          
          date = date + currentdate.getFullYear() + " "  
          
          if(currentdate.getHours() < 10) date = date + '0';
          date = date + currentdate.getHours() + ":"  
          
          if(currentdate.getMinutes() < 10) date = date + '0';
          date = date + currentdate.getMinutes() 

          firebase.database().ref('likes/'+id+'/'+this.auth.userId).set({
            date : date 
          });
          //console.log('add like')
        }
      });

      firebase.database().ref('/dislikes/' +id+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        unlike = snapshot.numChildren();
      }).then(() => {
        if(unlike == 1){
          firebase.database().ref('/dislikes/' +id+'/'+ this.auth.userId).remove();
          //console.log('remove dislikes')
        }
      });
    }
  }

  dislike(id : number){
    let like,unlike;

    if(this.auth.connected){
      firebase.database().ref('/dislikes/' +id+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        unlike = snapshot.numChildren();
      }).then(() => {
        if(unlike == 1){
          firebase.database().ref('/dislikes/' +id+'/'+ this.auth.userId).remove();
          //console.log('remove like')
        }else if(unlike == 0){
          var currentdate = new Date();
          let date = '';
          
          if(currentdate.getDate() < 10) date = date + '0';
          date = date + currentdate.getDate() + "/"
          
          if(currentdate.getMonth()+1 < 10) date = date + '0';
          date = date + (currentdate.getMonth()+1)  + "/" 
          
          date = date + currentdate.getFullYear() + " "  
          
          if(currentdate.getHours() < 10) date = date + '0';
          date = date + currentdate.getHours() + ":"  
          
          if(currentdate.getMinutes() < 10) date = date + '0';
          date = date + currentdate.getMinutes()
          firebase.database().ref('dislikes/'+id+'/'+this.auth.userId).set({
            date : date 
          });
          //console.log('add like')
        }
      });

      firebase.database().ref('/likes/' +id+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        like = snapshot.numChildren();
      }).then(() => {
        if(like == 1){
          firebase.database().ref('/likes/' +id+'/'+ this.auth.userId).remove();
          //console.log('remove dislikes')
        }
      });
    }
  }

  getLikes(id: number){
    let res =0;
    FilmsComponent.tabLikes.map( elt => {
      if(elt.id == id+'') {
        res = elt.nb;
      }
    })
    return res;
  }

  getDisLikes(id: number){
    let res =0;
    FilmsComponent.tabDisLikes.map( elt => {
      if(elt.id == id+'') {
        res = elt.nb;
      }
    })
    return res;
  }
  addComment(index){
    if(this.auth.connected){
      let i = 1
      firebase.database().ref('comments/'+this.tmdb.PopularFilms.results[index].id+'/'+this.auth.userId).once('value').then(function(snapshot) {
        i = i + snapshot.numChildren();
      }).then(() => {
        var currentdate = new Date();
        let date = '';
        
        if(currentdate.getDate() < 10) date = date + '0';
        date = date + currentdate.getDate() + "/"
        
        if(currentdate.getMonth()+1 < 10) date = date + '0';
        date = date + (currentdate.getMonth()+1)  + "/" 
        
        date = date + currentdate.getFullYear() + " "  
        
        if(currentdate.getHours() < 10) date = date + '0';
        date = date + currentdate.getHours() + ":"  
        
        if(currentdate.getMinutes() < 10) date = date + '0';
        date = date + currentdate.getMinutes()
        firebase.database().ref('comments/'+this.tmdb.PopularFilms.results[index].id+'/'+this.auth.userId+'/'+i).set({
          date : date ,
          comment : this.tmdb.PopularFilms.results[index].comment
        });
        this.tmdb.PopularFilms.results[index].comment =''
      });
    }
  }

  addCommentSearch(index){
    if(this.auth.connected){
      let i = 1
      firebase.database().ref('comments/'+this.tmdb.RechrcheResult.results[index].id+'/'+this.auth.userId).once('value').then(function(snapshot) {
        i = i + snapshot.numChildren();
      }).then(() => {
        var currentdate = new Date();
        let date = '';
        
        if(currentdate.getDate() < 10) date = date + '0';
        date = date + currentdate.getDate() + "/"
        
        if(currentdate.getMonth()+1 < 10) date = date + '0';
        date = date + (currentdate.getMonth()+1)  + "/" 
        
        date = date + currentdate.getFullYear() + " "  
        
        if(currentdate.getHours() < 10) date = date + '0';
        date = date + currentdate.getHours() + ":"  
        
        if(currentdate.getMinutes() < 10) date = date + '0';
        date = date + currentdate.getMinutes()
        firebase.database().ref('comments/'+this.tmdb.RechrcheResult.results[index].id+'/'+this.auth.userId+'/'+i).set({
          date : date ,
          comment : this.tmdb.RechrcheResult.results[index].comment
        });
        this.tmdb.RechrcheResult.results[index].comment =''
      });
    }
  }
}
export interface pair {
  id: string;
  nb: number;
}