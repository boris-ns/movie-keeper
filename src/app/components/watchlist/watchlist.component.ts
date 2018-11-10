import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  private userMovies: Array<any>;
  private imdbLinkInput: string;

  showToWatchList: boolean;

  constructor(private dataService: DataService) {
    this.showToWatchList = true; 
  }
  
  ngOnInit() {
    this.dataService.castUserMovies.subscribe(movies => this.userMovies = movies);
  }

  onClickWatched(movie: any): void {
    this.dataService.updateMovieAsWatched(movie);
  }

  onClickRemove(movie: any): void {
    this.dataService.removeMovieFromDb(movie);
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
