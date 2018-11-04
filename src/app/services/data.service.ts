import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';
import { resolve } from 'q';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private endpoint: string;
  private apiKey: string;

  private userId: string;
  private userGoogleId: string;
  private userMovies: Array<any>;

  constructor(private http: HttpClient, private firebaseDb: AngularFireDatabase) { 
    this.endpoint = 'http://www.omdbapi.com/';
    this.apiKey = environment.omdbApiKey;
    this.userMovies = new Array<any>();
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
    this.userGoogleId = user.uid;
    
    // @TODO: Better place for this kind of stuff is on the backend
    users.orderByChild('googleId').equalTo(newUser.googleId).once('value', snapshot => { 
      if (!snapshot.exists()) {
        this.userId = users.push(newUser).key;
      } else {
        this.userId = Object.keys(snapshot.val())[0];
      }

      this.userMovies = new Array();
      const movies = snapshot.val()[this.userId]["movies"];
      for (let key in movies) {
        this.userMovies.push(movies[key]);
      }
    });
  }

  addMovieToDb(movie: any) {
    const movies = this.firebaseDb.database.ref(`/users/${this.userId}/movies`);

    movies.orderByChild('imdbID').equalTo(movie.imdbID).once('value', snapshot => {
      if (!snapshot.exists()) {
        movies.push(movie);
        alert('Movie successfully saved! :)');
      } else {
        alert('You already saved this movie/show.');
      }
    });
  }

  getLoggedInUserId() {
    return this.userId;
  }

  getMoviesFromDb() {
    const users = this.firebaseDb.database.ref('/users'); 
    return users.orderByChild('googleId').equalTo(this.userGoogleId).once('value', snapshot => {});
  }
}
