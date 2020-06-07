import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import {AuthenticationService} from '../services/authentication.service';
import {TmdbService} from '../services/tmdb.service';



@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  likes = firebase.database().ref('/likes/');
  dislikes = firebase.database().ref('/dislikes/');
  comments = firebase.database().ref('/comments/');
  static tabLikes=[]
  names :string[]=[]
  constructor(public auth: AuthenticationService ,public tmdb: TmdbService) {
    this.init();
  }

  init(){
    this.likes.on('value',this.gotDatalikes,this.errorData);
    this.names =[]
  }
  
  
  gotDatalikes(data){
    ActivityComponent.tabLikes=[]

    //console.log('data',data.val())
    let films = data.val();
    if(films != null){
      let keys = Object.keys(films);
      keys.map( (elt,i) => {
        let key = Object.keys(films[keys[i]]);
        key.forEach((idu)=>{
          firebase.database().ref('/likes/'+elt+'/'+idu+'/date').once('value').then(function(snapshot) {
            ActivityComponent.tabLikes.push( {action : 'vous avez liker ',iduser:idu,idFilm : elt,date :snapshot.val()})
          })
        });
      })
    }
  }
  errorData(data){
    console.log(data);
  }


  getTable(){
    let res =[];
    ActivityComponent.tabLikes.map( elt => {
      if(elt.iduser == this.auth.userId+'') {
        res.push(elt)
      }
    })
    return res;
  }

  async film(id){
    let v = (await this.tmdb.getMovie(parseInt(id))).title;
    this.names.push(v);
    return ;
  }
}