import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User>;
  private userInfo: firebase.User;

  constructor(private firebaseAuth: AngularFireAuth,
              private firebaseDb:   AngularFireDatabase) { 

    this.user = firebaseAuth.authState;

    this.user.subscribe(user => {
      this.userInfo = user;

      if (user != null) {
        this.addUserToDatabase(user);
      }
    });
  }

  addUserToDatabase(user: firebase.User) {
    // const users = this.firebaseDb.list('/users');
    const newUser = {
      id: user.uid,
      name: user.displayName,
    };

    // users.push(newUser);
  }

  loginWithGoogle() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  signOut() {
    this.firebaseAuth.auth.signOut().then(res => {
      console.log("user signed out");
      // Go to the homepage: this.router.navigate(['/']);
    });
  }

  isUserLoggedIn() {
    return (this.userInfo) ? true : false;
  }
}
