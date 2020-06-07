import { Component } from '@angular/core';

import {TmdbService} from './services/tmdb.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private tmdb: TmdbService) {
    this.init();
  }

  async init() {
    this.tmdb.init( environment.tmdbKey );
  }
}
