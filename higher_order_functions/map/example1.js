const animals = [
  { name: 'Fluffykins', species: 'rabbit' },
  { name: 'Caro',       species: 'dog' },
  { name: 'Hamilton',   species: 'dog' },
  { name: 'Harold',     species: 'fish' },
  { name: 'Ursula',     species: 'cat' },
  { name: 'Jimmy',      species: 'fish' }
];


const names = animals.map(function (animal) {
  return animal.name;
});

console.log(names);
