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

  // ── WEEK 3 (Michaelmas 2026) ────────────────────────────────────────────
  // Lunch
  "Paneer jalfrezi with poppadom": "v",
  "Roasted squash and chickpea casserole": "ve",
  "Broccoli, pea and stilton pasta crumble bake": "v",
  "Vegetable casserole topped with crispy mushrooms": "ve",
  "Spinach falafel burger with tzatziki and chili jam": "v",
  "Aubergine caponata": "ve",
  "Leek, potato, cheddar and onion puff pastry open pie": "v",
  "Moroccan vegetable tagine": "ve",
  "Four cheese pasta bake with parsley crumb": "v",
  "Wet polenta with roasted Mediterranean veg and onion chutney": "v",
  // Dinner
  "Halloumi fries with chili jam and crispy rocket": "v",
  "Aubergine, butterbean and charred courgette katsu curry": "ve",
  "BBQ pulled jackfruit with mixed bean salad and guacamole": "ve",
  "Vegan biryani": "ve",
  "Crispy chili and miso aubergine with egg noodles": "v",
  "Roasted squash with tabbouleh style salsa and coconut yoghurt": "ve",
  "Potato pancakes with feta and guacamole": "v",
  "Five bean and mushroom bolognese with pasta": "ve",
  "Squash and sage risotto with pumpkin seeds": "v",
  "Roast pepper, basil and blue cheese frittata with tomato salsa": "v",
  "Jacket potato with mixed bean chili": "ve",
  "Gnocchi with mushrooms and leeks": "v",
  "Lentil and Mediterranean veg ragu": "ve",
  "Vegetable curry": "ve",
  "Vegan chili nachos": "ve",
};

/** Returns the dietary tag for a dish name, or undefined if it contains meat/fish. */
export function getDietaryTag(dishName: string): DietaryTag | undefined {
  return flags[dishName];
}
