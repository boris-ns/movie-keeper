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

  constructor(private dataService: DataService) { 
  }
  
  ngOnInit() {
    this.dataService.castUserMovies.subscribe(movies => this.userMovies = movies);
  }

  onClickWatched(movie: any): void {
    console.log("WATCHED");
    console.log(movie);
  }

  onClickRemove(movie: any): void {
    this.dataService.removeMovieFromDb(movie);
  }
}
