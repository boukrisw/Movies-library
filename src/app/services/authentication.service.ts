import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';

firebase.initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public userId;
  connected:boolean =false;

  //listLikes //: FirebaseListObservable = [];

  constructor(public afAuth: AngularFireAuth,public db: AngularFireDatabase) {
    //this.userId.subscribe();
    //db.list<Object>('likes').valueChanges().subscribe(console.log);
  }



  signup(email: string, password: string,Fname: string,Lname: string,birthday: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.connected = true;
        this.userId = value.user.uid
       
        /*Add user to DataBase! */
        firebase.database().ref('users/'+value.user.uid).set({
           email : email , 
           mdp :password , 
           nom:Lname,
           prenom:Fname,
           birthday:birthday
        });
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }

  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(value => {
        this.connected = true;
        this.userId = value.user.uid
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.afAuth.signOut();
    this.connected = false;
  }

  /*getlikes(){
    console.log('fuck ',this.likes)
    
  }*/
}



export interface pair {
  id: string;
  nb: number;
}
/*        Get user infos!
firebase.database().ref('/users/' + this.userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  console.log(snapshot.val(),snapshot.val().mdp );
});
*/