import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  private toWatchMovies: Array<any>;
  private watchedMovies: Array<any>;
  private imdbLinkInput: string;

  showToWatchList: boolean;

  constructor(private dataService: DataService) {
    this.showToWatchList = true; 
  }
  
  ngOnInit() {
    this.dataService.castUserMovies.subscribe(movies => this.toWatchMovies = movies);
    this.dataService.castWatchedUserMovies.subscribe(movies => this.watchedMovies = movies);
  }

  onClickWatched(movie: any): void {
    this.dataService.updateMovieAsWatched(movie);
  }

  onClickRemove(movie: any, isMovieWatched: boolean): void {
    this.dataService.removeMovieFromDb(movie, isMovieWatched);
  }

  /** Shows list of movies that user wants to watch */
  onClickBtnToWatchList(): void {
    this.showToWatchList = true;
  }

  /** Shows list of movies that user marked as 'Watched' */
  onClickBtnWatchedList(): void {
    this.showToWatchList = false;
  }
}
