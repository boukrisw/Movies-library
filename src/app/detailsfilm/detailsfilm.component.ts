import { Component, OnInit } from '@angular/core';
import {TmdbService} from '../services/tmdb.service';
import {FilmsComponent} from '../films/films.component';
import {AuthenticationService} from '../services/authentication.service';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-detailsfilm',
  templateUrl: './detailsfilm.component.html',
  styleUrls: ['./detailsfilm.component.scss']
})
export class DetailsfilmComponent implements OnInit {


  comments = firebase.database().ref('/comments/'+this.tmdb.idFilm);
  static tabComments:pair[] = [];


  constructor(public tmdb: TmdbService, public auth: AuthenticationService) {
    this.init();
  }


  async init(){
    await this.tmdb.popularFilms();
    DetailsfilmComponent.tabComments = [];
    this.comments.on('value',this.gotDatacomments,this.errorData);
  
  }

  gotDatacomments(data){
    DetailsfilmComponent.tabComments = [];
    
    let comments = data.val();
    if(comments != null){
     // console.log('comment : ',comments);

      let keys = Object.keys(comments);
      keys.map( (elt,i) => {
        
        let k = keys[i];
        //let key = Object.keys(comments[k]);
        //FilmsComponent.tabLikes.push({id:elt,nb:key.length})

   //     console.log('keys : ',keys[i]);
     //   console.log('comments[k] : ',comments[k]);
        comments[k].map(elt => {
          //console.log('elt : ',elt.comment);
          DetailsfilmComponent.tabComments.push({comment:elt.comment,date:elt.date})
        })
      })
    }

  }

  errorData(data){
    console.log(data);
  }

  getComments(){
    let res =[];
    DetailsfilmComponent.tabComments.map( elt => {
        res.push(elt);
    })
    return res.sort(this.compare);
  }

  //07/06/2020 16:43
  compare(a:pair, b:pair) {
    let aS = a.date.split(' ')
    let bS = b.date.split(' ')
    
    let aDay = aS[0].split('/')
    let bDay = bS[0].split('/')

    let aTime = aS[1].split(':')
    let bTime = bS[1].split(':')

    if (parseInt(aDay[2]) == parseInt(bDay[2])){
      if (parseInt(aDay[1]) == parseInt(bDay[1])){
        if (parseInt(aDay[0]) == parseInt(bDay[0])){
          if (parseInt(aTime[0]) == parseInt(bTime[0])){
            if (parseInt(aTime[1]) == parseInt(bTime[1])){
              return 0;
            }else if( (parseInt(aTime[1]) < parseInt(bTime[1]))){
              return 1;
            } 
          }else if( (parseInt(aTime[0]) < parseInt(bTime[0]))){
            return 1;
          } 
        }else if( (parseInt(aDay[0]) < parseInt(bDay[0]))){
          return 1;
        } 
      }else if( (parseInt(aDay[1]) < parseInt(bDay[1]))){
        return 1;
      }   
    }else if( (parseInt(aDay[2]) < parseInt(bDay[2]))){
      return 1;
    }
    return -1;
  }

  ngOnInit(): void {
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

  addComment(){
    if(this.auth.connected){
      let i = 1
      firebase.database().ref('comments/'+this.tmdb.idFilm+'/'+this.auth.userId).once('value').then(function(snapshot) {
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
        firebase.database().ref('comments/'+this.tmdb.idFilm+'/'+this.auth.userId+'/'+i).set({
          date : date ,
          comment : this.tmdb.filmdetail.comment
        });
        this.tmdb.filmdetail.comment =''
      });
    //  console.log(index);
    //  console.log(this.tmdb.PopularFilms.results[index].comment); 
    }
  }

  like(){
    let like,unlike;
    //console.log('Like')
    if(this.auth.connected){
      firebase.database().ref('/likes/' +this.tmdb.idFilm+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        like = snapshot.numChildren();
      }).then(() => {
        if(like == 1){
          firebase.database().ref('/likes/' +this.tmdb.idFilm+'/'+ this.auth.userId).remove();
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

          firebase.database().ref('likes/'+this.tmdb.idFilm+'/'+this.auth.userId).set({
            date : date 
          });
          //console.log('add like')
        }
      });

      firebase.database().ref('/dislikes/' +this.tmdb.idFilm+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        unlike = snapshot.numChildren();
      }).then(() => {
        if(unlike == 1){
          firebase.database().ref('/dislikes/' +this.tmdb.idFilm+'/'+ this.auth.userId).remove();
          //console.log('remove dislikes')
        }
      });
    }
  }

  dislike(){
    let like,unlike;

    if(this.auth.connected){
      firebase.database().ref('/dislikes/' +this.tmdb.idFilm+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        unlike = snapshot.numChildren();
      }).then(() => {
        if(unlike == 1){
          firebase.database().ref('/dislikes/' +this.tmdb.idFilm+'/'+ this.auth.userId).remove();
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
          firebase.database().ref('dislikes/'+this.tmdb.idFilm+'/'+this.auth.userId).set({
            date : date 
          });
          //console.log('add like')
        }
      });

      firebase.database().ref('/likes/' +this.tmdb.idFilm+'/'+ this.auth.userId).once('value').then(function(snapshot) {
        like = snapshot.numChildren();
      }).then(() => {
        if(like == 1){
          firebase.database().ref('/likes/' +this.tmdb.idFilm+'/'+ this.auth.userId).remove();
          //console.log('remove dislikes')
        }
      });
    }
  }
}
export interface pair {
  comment: string;
  date: string;
}