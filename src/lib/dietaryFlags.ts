// ---------------------------------------------------------------------------
// Dietary flags for every dish in menuData.json.
// "ve" = vegan  |  "v" = vegetarian (contains dairy/egg but no meat/fish)
// Dishes without an entry contain meat or fish.
// ---------------------------------------------------------------------------

type DietaryTag = "v" | "ve";

const flags: Record<string, DietaryTag> = {
  // ── WEEK 1 ──────────────────────────────────────────────────────────────
  // Lunch
  "Feta, pea, pine kernel and broccoli pasta": "v",
  "Katsu tempeh burger": "ve",
  "Mushroom bourguignonne": "v",
  "Cauliflower and apricot tagine": "ve",
  "Vegetable stir-fry with egg noodles": "v",
  "Lentil and coconut dhal": "ve",
  "Feta and roasted vegetable pita pizza": "v",
  "Black bean and sweet potato stew with cabbage": "ve",
  "Roast fennel, olive and cherry tomato penne pasta": "v",
  "Quorn chilli": "v",
  // Dinner
  "Mixed bean enchiladas": "v",
  "Creamy truffle gnocchi": "v",
  "Roast squash risotto with toasted pumpkin seeds and rocket": "v",
  "Seitan Thai green curry": "ve",
  "Loaded chipotle jackfruit potato tots": "ve",
  "Peri peri vegetable wrap with grilled mozzarella": "v",
  "Vegetable jambalaya": "ve",
  "Mexican spiced sweet potato with sour cream": "v",
  "Beetroot and quinoa burger with apple slaw": "ve",
  "Roast aubergine with caponata and feta": "v",
  "Mushroom stroganoff": "v",
  // Brunch
  "Mac and cheese with parsley crumb": "v",
  "Falafel burger with tzatziki": "v",
  "Roast artichoke on flatbread with tzatziki and salad": "v",
  "Butternut squash and coconut curry": "ve",

  // ── WEEK 2 ──────────────────────────────────────────────────────────────
  // Lunch
  "Pitta pocket with falafel and sweet chili sauce": "ve",
  "Carrot and courgette tabbouleh, roasted spring cabbage with vegan feta": "ve",
  "Chicory and cheddar gratin with roasted Jerusalem artichoke": "v",
  "Sweetcorn and courgette fritters with smashed avocado": "v",
  "Broccoli, leek and blue cheese crumble with thyme": "v",
  "Roasted aubergine topped with chickpea ratatouille and vegan feta": "ve",
  "Spinach, mozzarella, red onion and pesto pasta": "v",
  "Puy lentil cottage pie with garlic mash topping": "v",
  "Courgette and celeriac pancakes with hummus and balsamic onions": "v",
  "Spinach and crumbled tempeh filo pie with rocket and potato salad": "v",
  // Dinner
  "Root vegetable casserole with rosemary dumpling": "v",
  "Stuffed cabbage and tomato bake": "ve",
  "Cajun battered tofu nuggets with succotash": "ve",
  "Sweet and sour jackfruit and chickpeas": "ve",
  "Parsnip, spinach and cheese roll with chutney": "v",
  "Roasted vegetable and cheese gozleme with red onion jam": "v",
  "Roasted butternut squash risotto with toasted seeds": "v",
  "Smoked tofu red Thai curry": "ve",
  "Crispy aubergine with mushroom noodles": "ve",
  "Spicy bean burger with melted brie, tomato and cranberry relish": "v",
  "Southern fried cauliflower with carrot and turnip remoulade": "v",
  // Brunch
  "Cumin roasted mixed pepper and cheddar burrito with guacamole": "v",
  "Pulled jackfruit and bean nachos with cream cheese, jalapeños and guacamole": "v",
  "Pear, blue cheese and celeriac quiche with rocket": "v",
  "Lentil loaf with mushroom sauce": "ve",

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
  "Vegetable tagine": "ve",
  // Dinner
  "Tomato and basil pasta": "v",
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
