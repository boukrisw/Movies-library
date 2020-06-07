import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SearchMovieQuery, SearchMovieResponse} from '../tmdb-data/searchMovie';
import {MovieQuery, MovieResponse} from '../tmdb-data/Movie';

const tmdbApi = 'https://api.themoviedb.org/3';

function ObjectToString(data?: object): {[key: string]: string} {
  const res = {};
  for (const k of Object.keys(data || {}) ) {
    const v = data[k];
    res[k] = typeof v === 'string' ? v : JSON.stringify(v);
  }
  return res;
}

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  PopularFilms:SearchMovieResponse ;

  UpComingFilms:SearchMovieResponse ;

  RechrcheResult:SearchMovieResponse;  
  RechercheTrouve:boolean =false;

  idFilm;
  filmdetail;

  private apiKey: string;

  private async get<T>(url: string, data: object): Promise<HttpResponse<T>> {
    return this.http.get<T>( url, {
      observe: 'response',
      params: {...ObjectToString(data), api_key: this.apiKey}
    }).toPromise();
  }

  constructor(private http: HttpClient) {}

  init(key: string): this {
    this.apiKey = key;
    return this;
  }

  // _______________________________________________________________________________________________________________________________________
  // Movies ________________________________________________________________________________________________________________________________
  // _______________________________________________________________________________________________________________________________________
  async getMovie(id: number, options?: MovieQuery): Promise<MovieResponse> {
    const url = `${tmdbApi}/movie/${id}`;
    const res = await this.get<MovieResponse>(url, options);
    return res.body;
  }

  async searchMovie(query: SearchMovieQuery) {
    const url = `${tmdbApi}/search/movie`;
    const res = await this.get<SearchMovieResponse>(url, query);
    this.RechercheTrouve=true;
    this.RechrcheResult = res.body;
  }

  async popularFilms(options?: MovieQuery){
    const url = tmdbApi+'/movie/popular?api_key=200b64b2e13e6f6e004f310c0c0d8697&language=en-US&page=1';
    const res = await this.get<SearchMovieResponse>(url, options);
    this.PopularFilms = res.body;
  }
  
  async upComingFilms(options?: MovieQuery) {
    const url = 'https://api.themoviedb.org/3/movie/upcoming?api_key=200b64b2e13e6f6e004f310c0c0d8697&language=en-US&page=1';
    const res = await this.get<SearchMovieResponse>(url, options);
    this.UpComingFilms = res.body;
  }
}

