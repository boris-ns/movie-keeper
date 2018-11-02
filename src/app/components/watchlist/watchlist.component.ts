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

  constructor(private dataService: DataService, private authService: AuthService) { 
  }

  ngOnInit() {
  }

  private getIdFromLink(link: string) {
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
    });
  }
}