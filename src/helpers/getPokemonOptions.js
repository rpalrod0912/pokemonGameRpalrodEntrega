import pkmApi from "../api/pkmApi";

//Rebice Objeto Pkm

const getPokemons = () => {
  const pkmArray = Array.from(Array(650));
  return pkmArray.map((pkm, index) => index + 1);
};

//Mezclamos, es decir, ordenamos aleatoriamente el array
const getPokemonOptions = async () => {
  const pkmArrayMix = getPokemons().sort(() => Math.random() - 0.5);
  const pkmns = await getPokemonNames(pkmArrayMix.splice(0, 4));
  return pkmns;
};

const getPokemonNames = async ([a, b, c, d] = []) => {
  const promiseArr = [
    pkmApi.get(`/${a}`),
    pkmApi.get(`/${b}`),
    pkmApi.get(`/${c}`),
    pkmApi.get(`/${d}`),
  ];
  const [pkm1, pkm2, pkm3, pkm4] = await Promise.all(promiseArr);
  return [
    { name: pkm1.data.name, id: pkm1.data.id },
    { name: pkm2.data.name, id: pkm2.data.id },
    { name: pkm3.data.name, id: pkm3.data.id },
    { name: pkm4.data.name, id: pkm4.data.id },
  ];
};

export default getPokemonOptions;
