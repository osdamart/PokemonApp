import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  baseUrl = 'https://pokeapi.co/api/v2';
  spriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
  imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
  realImgUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/';

  constructor(private http: HttpClient) { }

  getPokemon(offset = 0){
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=151`).pipe(
      map(result => {
        return result['results']
      }),
      map(pokemons => {
        return pokemons.map((poke,index) => {
          poke.image = this.getPokemonImg(index + offset + 1);
          poke.pokeIndex = index + offset +1;
          return poke;
        })
      })
    );
  }

  getPokemonImg(index){
    return `${this.realImgUrl}${index}.png`;
  }

  getPokeDetails(index){
    return this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(
      map(poke => {
        let sprites = Object.keys(poke['sprites']['other']['home']);
        poke['images'] = sprites
          .map(spriteKey => poke['sprites']['other']['home'][spriteKey])
          .filter(img => img);
          return poke;
      })
    );
  }

}
