export const APPLIANCES = [
    {
      id: '1',
      name: 'Washing Machine',
      icon: 'washing-machine',
      powerConsumption: 0.7, // kW
      duration: 1.5, // hours for full cycle
      category: 'Laundry',
    },
    {
      id: '2',
      name: 'Clothes Dryer',
      icon: 'tumble-dryer',
      powerConsumption: 2.5, // kW
      duration: 1, // hours for full cycle
      category: 'Laundry',
    },
    {
      id: '3',
      name: 'Dishwasher',
      icon: 'dishwasher',
      powerConsumption: 1.2, // kW
      duration: 2, // hours for full cycle
      category: 'Kitchen',
    },
    {
      id: '4',
      name: 'Electric Oven',
      icon: 'stove',
      powerConsumption: 2.3, // kW
      duration: 1, // hours for cooking
      category: 'Kitchen',
    },
    {
      id: '5',
      name: 'Gaming PC',
      icon: 'desktop-tower',
      powerConsumption: 0.5, // kW
      duration: 1, // hours (default)
      category: 'Entertainment',
    },
    {
      id: '6',
      name: 'Electric Sauna',
      icon: 'hot-tub',
      powerConsumption: 6, // kW
      duration: 1, // hours
      category: 'Home',
    },
    {
      id: '7',
      name: 'Electric Vehicle Charging',
      icon: 'car-electric',
      powerConsumption: 7.5, // kW
      duration: 3, // hours (default)
      category: 'Transportation',
    },
    {
      id: '8',
      name: 'Refrigerator (Daily)',
      icon: 'fridge',
      powerConsumption: 0.15, // kW
      duration: 24, // hours
      category: 'Kitchen',
    },
    {
      id: '9',
      name: 'Electric Space Heater',
      icon: 'radiator',
      powerConsumption: 1.5, // kW
      duration: 3, // hours
      category: 'Home',
    },
    {
      id: '10',
      name: 'Television',
      icon: 'television',
      powerConsumption: 0.12, // kW
      duration: 4, // hours
      category: 'Entertainment',
    },
  ];
  
  export const CATEGORIES = [
    'All',
    'Laundry',
    'Kitchen',
    'Entertainment',
    'Home',
    'Transportation',
  ];
  
  export default { APPLIANCES, CATEGORIES };