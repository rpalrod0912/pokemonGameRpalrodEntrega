import axios from "axios";

const pkmApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2/pokemon",
});

export default pkmApi;
