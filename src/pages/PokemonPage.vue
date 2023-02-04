<template>
  <h1 v-if="!pokemon">Cargando...</h1>
  <div v-else="pokemon">
    <h1>¿Cuál es este Pokémon?</h1>

    <PokemonPicture
      :pokemonId="pokemon.id"
      :mostrarPkm="showPkm"
    ></PokemonPicture>
    <h2 v-if="tipo">
      {{ this.descripcionPokemon }}
    </h2>
    <div v-if="!click">
      <PokemonOptions
        :pokemons="pkmnsArr"
        @selection="verificarRes"
        @click="this.click = true"
      ></PokemonOptions>
    </div>
    <template v-if="mostrarResp">
      <h2 class="fade-in">{{ msj }}</h2>
      <button @click="nuevoJuego(this.tipo)">
        {{ this.intentos > 0 ? "Siguiente Pokemon" : "Nueva Partida" }}
      </button>
    </template>
    <h1>Tu puntuacion:{{ this.puntuacion }}</h1>
    <h1>Tus intentos:{{ this.intentos }}</h1>
    <div v-if="!tipo">
      <button @click="mostrarPista = true">Dame una pista</button>
      <h2 v-if="mostrarPista">La Pista es: {{ this.pista }}</h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PokemonOptions from "../components/PokemonOptions.vue";
import PokemonPicture from "../components/PokemonPicture.vue";
import getPokemonOptions from "../helpers/getPokemonOptions";

export default {
  components: { PokemonOptions, PokemonPicture },
  data: () => {
    return {
      pkmnsArr: [],
      pokemon: null,
      showPkm: false,
      mostrarResp: false,
      msj: "",
      puntuacion: 0,
      comenzarDeNuevo: false,
      //Booleano tipo para verificar si el jugador a acertado o ha fallado
      tipo: false,
      descripcionPokemon: "",
      intentos: 4,
      mostrarPista: false,
      pista: "",
      click: false,
    };
  },
  methods: {
    async getPokemonDescription(id) {
      let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
      const data = axios.get(url);
      const datosPkmn = await data;
      debugger;
      //Filtramos texto en español de la API
      const filteredFlavorTextEntries =
        datosPkmn.data.flavor_text_entries.filter(
          (element) => element.language.name === "es"
        );

      const flavorTextEntry =
        filteredFlavorTextEntries.length > 0
          ? filteredFlavorTextEntries[0]
          : {};
      const flavorText = flavorTextEntry.flavor_text;
      const filteredPista = datosPkmn.data.genera.filter(
        (element) => element.language.name === "es"
      );
      const filteredPistaEntry =
        filteredPista.length > 0 ? filteredPista[0] : {};
      const pistaFiltrada = filteredPistaEntry.genus;

      this.descripcionPokemon = flavorText;
      this.pista = pistaFiltrada;
    },

    async mixedPkmArr() {
      debugger;
      this.pkmnsArr = await getPokemonOptions();
      const intRand = Math.floor(Math.random() * 4);
      this.pokemon = this.pkmnsArr[intRand];
      console.log(this.pokemon.id);
      debugger;
      this.getPokemonDescription(this.pokemon.id);
    },
    verificarRes(selectId) {
      this.showPkm = true;
      this.mostrarResp = true;

      if (selectId === this.pokemon.id) {
        this.msj = `Bien!!, era ${this.pokemon.name}`;
        this.tipo = true;
        this.puntuacion += 1;
      } else {
        this.msj = `Mal!!!, era ${this.pokemon.name}`;
        this.intentos -= 1;
      }
    },
    //Añadido Sistema de puntuacion si variable tipo false reseteamos contador
    nuevoJuego(tipo) {
      if (this.intentos === 0) {
        this.puntuacion = 0;
        this.tipo = false;
        this.intentos = 4;
      }

      (this.showPkm = false),
        (this.mostrarResp = false),
        (this.pkmnsArr = []),
        this.mixedPkmArr(),
        (this.pokemon = null),
        (this.tipo = false),
        (this.descripcionPokemon = ""),
        (this.mostrarPista = false),
        (this.pista = ""),
        (this.click = false);
    },
  },
  mounted() {
    this.mixedPkmArr();
    debugger;
  },
};
</script>

<style></style>
