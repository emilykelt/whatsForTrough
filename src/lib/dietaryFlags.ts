// ---------------------------------------------------------------------------
// Dietary flags for every dish in menuData.json.
// "ve" = vegan  |  "v" = vegetarian (contains dairy/egg but no meat/fish)
// Dishes without an entry contain meat or fish.
// ---------------------------------------------------------------------------

type DietaryTag = "v" | "ve";

const flags: Record<string, DietaryTag> = {
  // ── WEEK 1 (Michaelmas 2026) ────────────────────────────────────────────
  // Lunch
  "Potato pancakes with guacamole, salsa and refried beans": "ve",
  "Vegetable tagine": "ve",
  "Blue cheese and courgette frittata": "v",
  "Bean chili with nachos": "ve",
  "Tempeh goujon with charred broccoli steak and hoisin sauce": "ve",
  "Sweet potato, spinach and butter bean stew": "ve",
  "Mac and cheese": "v",
  "Battered cauliflower with sweet chili sauce": "ve",
  "Lentil curry": "ve",
  "Baked gnocchi with mushroom sauce and cheddar": "v",
  // Dinner
  "Mozzarella and sundried tomato stuffed mushroom": "v",
  "Falafel with warm quinoa salad and coconut yoghurt": "ve",
  "Broccoli, leek, pea and goats cheese crumble": "v",
  "Onion and cheddar quiche": "v",
  "Wild rice and corn sauce stuffed tomato": "ve",
  "Flatbread with grilled halloumi and Mediterranean vegetables": "v",
  "Stir-fry with rice noodles": "ve",
  "Peri-peri halloumi fries with crunchy salad": "v",
  "Vegetable fritters with salsa": "v",
  "Teriyaki tofu, spring onion and nori rice bowl": "ve",
  "Spinach and feta pie": "v",
  "Mushroom stroganoff": "v",
  "Lentil loaf with tomato sauce": "ve",
  "Celeriac steak with chimichurri": "ve",
  "Tomato and mozzarella pizza": "v",

  // ── WEEK 2 (Michaelmas 2026) ────────────────────────────────────────────
  // Lunch
  "Roasted celeriac with crisp chickpeas and chimichurri": "ve",
  "Lentil dhal": "ve",
  "Roasted root veg and goats cheese pie": "v",
  "Sweet potato tagine": "ve",
  "Spinach and ricotta cannelloni": "v",
  "Vegetable jambalaya": "ve",
  "Tomato and cheddar roll": "v",
  "Winter veg and lentil stew": "ve",
  "Butter bean stew with spinach and herb dumplings": "v",
  "Vegetable and cheese burrito": "v",
  // Dinner
  "Tortilla Espanol": "v",
  "Butterbean katsu with steamed courgette and bok choi": "ve",
  "Chipotle vegetable, pickled onion, guacamole and cheese quesadilla": "v",
  "Spicy bean and jackfruit tostada": "ve",
  "Spinach falafel with garlic yoghurt, pickled cabbage and pitta": "v",
  "Spicy tomato and chickpea shakshuka": "v",
  "Crispy cauliflower with sticky orange sauce": "ve",
  "Vegetable bhuna": "ve",
  "Kale dhansak": "ve",
  "Tomato and basil pasta": "v",
  "Jacket potato with Boston beans": "ve",
  "Sweet chili stir-fry with rice noodles": "ve",
  "Lentil shepherds pie": "ve",
  "Spinach, ricotta and pine kernel pasta": "v",
  "Loaded tater tots": "ve",

  // ── WEEK 3 ──────────────────────────────────────────────────────────────
  // Lunch
  "Basil gnocchi": "v",
  "Sweet and sour jackfruit with charred pineapple": "ve",
  "Chickpea, kale and green bean masala": "ve",
  "Crispy coconut polenta with salsa": "ve",
  "Leek and potato butter pie": "v",
  "Veggie jambalaya": "ve",
  "Roasted red pepper and parmesan risotto": "v",
  "Vegan roll with red onion jam": "ve",
  "Spanakopita": "v",
  // Dinner
  "Lentil and root vegetable stew": "ve",
  "Celeriac and mushroom stroganoff": "v",
  "Halloumi and bean burrito": "v",
  "Spinach and potato dhal": "ve",
  "Apple and brie ciabatta": "v",
  "Lentil and vegetable shepherds pie": "ve",
  "Mushroom and tarragon pasta": "v",
  "Bean chilli topped tater tots": "ve",
  "Vegetable gumbo": "ve",
  "Tofu massaman curry": "ve",
  // Brunch (Sat)
  "Spicy halloumi burger": "v",
  "Pesto bulgur wheat stuffed aubergine topped with vegan cheese": "ve",
  // Brunch (Sun)
  "Chickpea, kale and potato stew": "ve",
  "Spicy rice stuffed pepper": "ve",
};

/** Returns the dietary tag for a dish name, or undefined if it contains meat/fish. */
export function getDietaryTag(dishName: string): DietaryTag | undefined {
  return flags[dishName];
}
