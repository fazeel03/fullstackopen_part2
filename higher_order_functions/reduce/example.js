const cart = [
  { name: 'Dumbbell',      price: 1200, quantity: 2 },
  { name: 'Protein Shake', price: 250,  quantity: 4 },
  { name: 'Gym Gloves',    price: 400,  quantity: 1 },
  { name: 'Resistance Band', price: 350, quantity: 3 }
];

// 1) Simple example: 
const totalCost = cart.reduce(function (accumulator, item) {
  const itemTotal = item.price * item.quantity;
  return accumulator + itemTotal;
}, 0);

console.log('Total cost:', totalCost, 'INR');

// 2) Richer example: 
const summary = cart.reduce(function (acc, item) {
  const itemTotal = item.price * item.quantity;

  return {
    totalItems: acc.totalItems + item.quantity,
    totalCost: acc.totalCost + itemTotal
  };
}, { totalItems: 0, totalCost: 0 });

console.log('Summary:', summary);
