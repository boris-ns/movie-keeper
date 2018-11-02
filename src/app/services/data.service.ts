import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private endpoint: string;
  private apiKey: string;

  private userId: string;

  constructor(private http: HttpClient, private firebaseDb: AngularFireDatabase) { 
    this.endpoint = 'http://www.omdbapi.com/';
    this.apiKey = environment.omdbApiKey;
  }

  getMovie(movieId: string) {
    return this.http.get(`${this.endpoint}?apikey=${this.apiKey}&i=${movieId}`);
  }

  addUserToDb(user: firebase.User) {
    const newUser = {
      googleId: user.uid,
      name: user.displayName,
      movies: []
    };

    const users = this.firebaseDb.database.ref('/users'); 
    
    // @TODO: Better place for this kind of stuff is on the backend
    users.orderByChild('googleId').equalTo(newUser.googleId).once('value', snapshot => { 
      if (!snapshot.exists()) {
        this.userId = users.push(newUser).key;
      } else {
        this.userId = Object.keys(snapshot.val())[0];
      }
    });
  }

  addMovieToDb(movie: any) {
    const movies = this.firebaseDb.database.ref(`/users/${this.userId}/movies`);

    movies.orderByChild('imdbID').equalTo(movie.imdbID).once('value', snapshot => {
      if (!snapshot.exists()) {
        movies.push(movie);
      } else {
        alert('You already saved this movie/show.');
      }
    });
  }
}
