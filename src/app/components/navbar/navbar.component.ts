import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { DataService } from 'src/app/services/data.service';
import { SwitchListService } from 'src/app/services/switch-list.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  imdbLinkInput: string;

  constructor(public authService: AuthService, private dataService: DataService,
              private switchListService: SwitchListService) { 

  }

  ngOnInit() {
  }

  onClickBtnLogin() {
    this.authService.loginWithGoogle();    
  }

  onClickBtnSignOut() {
    this.authService.signOut();
  }

  private getIdFromLink(link: string): string {
    // Example link https://imdb.com/title/tt2467372/episodes
    const tokens = link.split('/');
    return tokens[4];
  }

  onClickBtnAddMovie() {
    if (!this.imdbLinkInput) {
      alert('Please enter IMDB link into the field before trying to add a movie.');
      return;
    }
    
    const movieId = this.getIdFromLink(this.imdbLinkInput);

    if (!movieId) {
      alert("Error while parsing IMDB link. Maybe the link is broken.");
      return;
    }

    this.dataService.getMovie(movieId).subscribe(movie => {
      this.dataService.addMovieToDb(movie);
      this.imdbLinkInput = "";
    });
  }

  onClickBtnShowToWatchList() {
    this.switchListService.switchList(true);
  }

  onClickBtnShowWatchedList() {
    this.switchListService.switchList(false);
  }
}
