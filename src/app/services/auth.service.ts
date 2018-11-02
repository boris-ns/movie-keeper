import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User>;
  private userInfo: firebase.User;
  private userDbId: string;

  constructor(private firebaseAuth: AngularFireAuth, private dataService: DataService) { 
    this.user = firebaseAuth.authState;

    this.user.subscribe(user => {
      this.userInfo = user;

      if (user != null) {
        this.dataService.addUserToDb(user);
      }
    });
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

  getLoggedInUserId() {
    return (this.isUserLoggedIn()) ? this.userDbId : null;
  }
}
