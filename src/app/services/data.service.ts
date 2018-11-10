import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private endpoint: string;
  private apiKey: string;

  private userId: string;
  private userGoogleId: string;
  private userMovies: Array<any>;

  private userMoviesBS = new BehaviorSubject<any>(new Array());
  castUserMovies = this.userMoviesBS.asObservable();

  constructor(private http: HttpClient, private firebaseDb: AngularFireDatabase) { 
    this.endpoint = 'http://www.omdbapi.com/';
    this.apiKey = environment.omdbApiKey;
    this.userMovies = new Array<any>();
  }

  /**
   * Searches for movie on OMDB API and returns movie data.
   * @param movieId - IMDB movie ID that will be searched on OMDB API
   */
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
        let movie = movies[key];
        movie.firebaseId = key;
        this.userMovies.push(movie);
      }

      this.userMoviesBS.next(this.userMovies);
    });
  }

  addMovieToDb(movie: any) {
    const movies = this.firebaseDb.database.ref(`/users/${this.userId}/movies`);

    movies.orderByChild('imdbID').equalTo(movie.imdbID).once('value', snapshot => {
      if (!snapshot.exists()) {
        movie.watched = false;
        movies.push(movie);
        this.userMovies.push(movie);
      } else {
        alert('You already saved this movie/show.');
      }
    });
  }

  /**
   * Deletes movie object from database and from local array of movies.
   * @param movie - movie to delete
   */
  removeMovieFromDb(movie: any) {
    const movies = this.firebaseDb.database.ref(`/users/${this.userId}/movies`);
    movies.child(movie.firebaseId).remove();

    // Remove from local array
    for (let i = 0; i < this.userMovies.length; ++i) {
      if (this.userMovies[i].firebaseId === movie.firebaseId) {
        this.userMovies.splice(i, 1);
        break;
      }
    }
  }

  updateMovieAsWatched(movie: any) {
    const movies = this.firebaseDb.database.ref(`/users/${this.userId}/movies`);
    movies.child(movie.firebaseId).update({"watched":true});

    // Update locally
    for (let i = 0; i < this.userMovies.length; ++i) {
      if (this.userMovies[i].firebaseId === movie.firebaseId) {
        this.userMovies[i].watched = true;
        break;
      }
    }
  }

  getLoggedInUserId() {
    return this.userId;
  }

  getMoviesFromDb() {
    const users = this.firebaseDb.database.ref('/users'); 
    return users.orderByChild('googleId').equalTo(this.userGoogleId).once('value', snapshot => {});
  }
}
