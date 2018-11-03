import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  private imdbLink: string; 

  dataAvailable: boolean = false;
  private userMovies: Array<any>;

  constructor(private dataService: DataService, private authService: AuthService) { 
  }
  
  ngOnInit() {
    this.dataService.getMoviesFromDb().then(snapshot => {
      const key = Object.keys(snapshot.val())[0];
      const movies = snapshot.val()[key]["movies"];        
      this.userMovies = new Array<any>();

      for (let key in movies) {
        this.userMovies.push(movies[key]);
      }

      console.log(this.userMovies);
    });
  }

  private getIdFromLink(link: string): string {
    // Example link https://imdb.com/title/tt2467372/episodes
    const tokens = link.split('/');
    return tokens[4];
  }

  onClickBtnAddMovie() {
    const movieId = this.getIdFromLink(this.imdbLink);

    if (!movieId) {
      alert("Error while parsing IMDB link. Maybe the link is broken.");
    }

    this.dataService.getMovie(movieId).subscribe(movie => {
      this.dataService.addMovieToDb(movie);
      this.userMovies.push(movie);
    });
  }
}
