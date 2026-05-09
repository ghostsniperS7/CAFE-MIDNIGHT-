import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Special Midnight Burger',
    price: 850,
    rating: 5,
    reviews: 42,
    category: 'fastfood',
    image: 'Special Midnight Burger.jpg',
    description: 'Our signature double-patty burger with charcoal-grilled meat, secret midnight sauce, white cheddar, caramelized onions, and fresh lettuce in a brioche bun.',
    ingredients: ['Double Beef Patty', 'Midnight Sauce', 'White Cheddar', 'Caramelized Onions', 'Brioche Bun'],
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Zinger Burger',
    price: 650,
    rating: 4,
    reviews: 30,
    category: 'fastfood',
    image: 'Zinger Burger.jpg',
    description: 'Crispy fried chicken thigh fillet, spicy mayo, lettuce, and cheese between soft sesame buns.',
    ingredients: ['Crispy Chicken Fillet', 'Spicy Mayo', 'Lettuce', 'Cheese Slice', 'Sesame Bun'],
  },
  {
    id: '3',
    name: 'Chicken BBQ Platter',
    price: 2200,
    rating: 5,
    reviews: 27,
    category: 'bbq',
    image: 'Chicken BBQ Platter.jpg',
    description: 'A grand platter featuring Tikka pieces, Malai Boti, Seekh Kababs, and Reshmi Kababs served with Puri Paratha and mint chutney.',
    ingredients: ['Chicken Tikka', 'Malai Boti', 'Seekh Kabab', 'Puri Paratha', 'Green Chutney'],
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Malai Boti',
    price: 1200,
    rating: 5,
    reviews: 24,
    category: 'bbq',
    image: 'Malai Boti.jpg',
    description: 'Succulent pieces of chicken marinated in cream, mild spices, and lemon, grilled to perfection over charcoal.',
    ingredients: ['Boneless Chicken', 'Cream', 'Mild Spices', 'Charcoal Smoke'],
  },
  {
    id: '5',
    name: 'Cafe Special Chai',
    price: 350,
    rating: 5,
    reviews: 53,
    category: 'beverages',
    image: 'Cafe Special Chai.jpg',
    description: 'A creamy, slow-cooked tea blended with exotic spices and a hint of saffron. Perfect for Karachi nights.',
    ingredients: ['Fresh Milk', 'Strong Tea Leaves', 'Cardamom', 'Saffron', 'Secret Spices'],
    isBestSeller: true
  },
  {
    id: '6',
    name: 'Karak Chai',
    price: 250,
    rating: 4,
    reviews: 33,
    category: 'beverages',
    image: 'Karak Chai.jpg',
    description: 'Authentic Doodh Patti chai, strong and energizing, cooked in a traditional kettle.',
    ingredients: ['High Quality Tea', 'Milk', 'Sugar'],
  },
  {
    id: '7',
    name: 'Chocolate Lava Cake',
    price: 750,
    rating: 5,
    reviews: 21,
    category: 'desserts',
    image: 'Chocolate Lava Cake.jpg',
    description: 'Warm, gooey chocolate center cake served with a scoop of premium vanilla bean ice cream.',
    ingredients: ['Dark Chocolate', 'Butter', 'Flour', 'Vanilla Ice Cream'],
  },
  {
    id: '8',
    name: 'Brownie with Ice Cream',
    price: 650,
    rating: 5,
    reviews: 18,
    category: 'desserts',
    image: 'Brownie with Ice Cream.jpg',
    description: 'Fudgy chocolate brownie topped with hot chocolate fudge and cold vanilla ice cream.',
    ingredients: ['Cocoa', 'Walnuts', 'Chocolate Syrup', 'Vanilla Ice Cream'],
  },
  {
    id: '9',
    name: 'Loaded Fries',
    price: 550,
    rating: 4,
    reviews: 29,
    category: 'snacks',
    image: 'Loaded Fries.jpg',
    description: 'Crispy fries topped with spicy chicken chunks, melted cheese, jalapeños, and midnight special dip.',
    ingredients: ['Potatoes', 'Shredded Chicken', 'Liquid Cheese', 'Jalapeños'],
  },
  {
    id: '10',
    name: 'Chicken Wings',
    price: 780,
    rating: 5,
    reviews: 34,
    category: 'snacks',
    image: 'Chicken Wings.jpg',
    description: 'Crispy fried wings tossed in your choice of Buffalo or Honey BBQ sauce.',
    ingredients: ['Chicken Wings', 'Buffalo Sauce', 'Celery Sticks', 'Ranch Dip'],
  }
];

export const REVIEWS = [
  {
    id: 'r1',
    userName: 'Mansoor A. Ali',
    rating: 5,
    comment: 'The ambiance is unmatched in FC Area. The Special Midnight Burger is a must-try! Perfect spot for late-night hangouts with friends.',
    date: 'March 15, 2024'
  },
  {
    id: 'r2',
    userName: 'Abdul Samad',
    rating: 5,
    comment: 'Peaceful environment and really friendly staff. The BBQ platter was fresh and delicious. Prices are very reasonable for the quality they provide.',
    date: 'April 2, 2024'
  },
  {
    id: 'r3',
    userName: 'Rafay Khan',
    rating: 5,
    comment: 'Their Cafe Special Chai is life-changing! Best place to dine in with family. The open-air setting makes it even better.',
    date: 'May 10, 2024'
  }
];
