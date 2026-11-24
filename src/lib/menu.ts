import { BranchId, Product, ProductCategory, ResolvedProduct } from "./types";

export const CATEGORIES: { id: ProductCategory; label: string; labelAr: string }[] = [
  { id: "espresso-drinks", label: "Espresso Drinks", labelAr: "مشروبات الاسبرسو" },
  { id: "black-coffee", label: "Black Coffee", labelAr: "قهوة سوداء" },
  { id: "cold-drinks", label: "Cold & Hot Drinks", labelAr: "مشروبات باردة وحارة" },
  { id: "desserts", label: "Desserts", labelAr: "حلويات" },
  { id: "sandwiches", label: "Sandwiches", labelAr: "ساندوتشات" },
  { id: "beans", label: "Beans", labelAr: "محاصيل البن" },
];

const ALLERGEN_NOTE = ["Egg", "Wheat & derivatives", "Nuts", "Milk & derivatives"];

export const DEFAULT_PREP_TIME_MINUTES = 12;

function img(slug: string) {
  return `/images/products/${slug}.jpg`;
}

/**
 * branchInfo prices are transcribed from each branch's published menu.
 * Beans pricing is centrally set and identical across branches.
 */
export const PRODUCTS: Product[] = [
  // ---------- ESPRESSO DRINKS ----------
  {
    slug: "piclo",
    name: "Piclo",
    nameAr: "بيكلو",
    description: "A short, concentrated espresso pull with a thick crema — for purists.",
    category: "espresso-drinks",
    image: img("piclo"),
    branchInfo: {
      "al-basateen": { price: 15, available: true },
      "al-mohammadiyah": { price: 14, available: true },
      "al-manar": { price: 14, available: true },
    },
  },
  {
    slug: "mechato",
    name: "Mechato",
    nameAr: "ميكاتو",
    description: "Espresso marked with a spoonful of steamed milk foam.",
    category: "espresso-drinks",
    image: img("mechato"),
    branchInfo: {
      "al-basateen": { price: 14, available: true },
      "al-mohammadiyah": { price: 13, available: true },
      "al-manar": { price: 13, available: true },
    },
  },
  {
    slug: "espresso",
    name: "Espresso",
    nameAr: "اسبرسو",
    description: "Our house blend, pulled fast and strong.",
    category: "espresso-drinks",
    image: img("espresso"),
    branchInfo: {
      "al-basateen": { price: 13, available: true },
      "al-mohammadiyah": { price: 12, available: true },
      "al-manar": { price: 12, available: true },
    },
  },
  {
    slug: "restretto",
    name: "Restretto",
    nameAr: "ريستريتو",
    description: "A tighter, more intense extraction than espresso — bold and syrupy.",
    category: "espresso-drinks",
    image: img("restretto"),
    branchInfo: {
      "al-basateen": { price: 12, available: true },
      "al-mohammadiyah": { price: 12, available: true },
      "al-manar": { price: 12, available: true },
    },
  },
  {
    slug: "latte",
    name: "Latte",
    nameAr: "لاتيه",
    description: "Espresso with silky steamed milk and a whisper of foam.",
    category: "espresso-drinks",
    image: img("latte"),
    branchInfo: {
      "al-basateen": { price: 18, available: true },
      "al-mohammadiyah": { price: 16, available: true },
      "al-manar": { price: 16, available: true },
    },
  },
  {
    slug: "cappuccino",
    name: "Cappuccino",
    nameAr: "كابتشينو",
    description: "Equal parts espresso, steamed milk and airy foam.",
    category: "espresso-drinks",
    image: img("cappuccino"),
    branchInfo: {
      "al-basateen": { price: 18, available: true },
      "al-mohammadiyah": { price: 16, available: true },
      "al-manar": { price: 16, available: true },
    },
  },
  {
    slug: "flat-white",
    name: "Flat White",
    nameAr: "فلات وايت",
    description: "Velvety micro-foam over a double ristretto shot.",
    category: "espresso-drinks",
    image: img("flat-white"),
    branchInfo: {
      "al-basateen": { price: 17, available: true },
      "al-mohammadiyah": { price: 14, available: true },
      "al-manar": { price: 14, available: true },
    },
  },
  {
    slug: "cortado",
    name: "Cortado",
    nameAr: "كورتادو",
    description: "Espresso cut with a small amount of warm milk, in perfect balance.",
    category: "espresso-drinks",
    image: img("cortado"),
    branchInfo: {
      "al-basateen": { price: 15, available: true },
      "al-mohammadiyah": { price: 14, available: true },
      "al-manar": { price: 14, available: true },
    },
  },
  {
    slug: "salted-caramel-latte",
    name: "Salted Caramel Latte",
    nameAr: "سولتد كراميل",
    description: "Iced or hot latte swirled with buttery salted caramel.",
    category: "espresso-drinks",
    image: img("salted-caramel-latte"),
    branchInfo: {
      "al-basateen": { price: 22, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "white-mocha",
    name: "White Mocha",
    nameAr: "وايت موكا",
    description: "White chocolate and espresso over steamed milk, served hot or iced.",
    category: "espresso-drinks",
    image: img("white-mocha"),
    branchInfo: {
      "al-basateen": { price: 21, available: true },
      "al-mohammadiyah": { price: 19, available: true },
      "al-manar": { price: 19, available: true },
    },
  },
  {
    slug: "spanish-latte",
    name: "Spanish Latte",
    nameAr: "سبانش لاتيه",
    description: "Espresso with condensed and steamed milk — sweet and rich.",
    category: "espresso-drinks",
    image: img("spanish-latte"),
    branchInfo: {
      "al-basateen": { price: 21, available: true },
      "al-mohammadiyah": { price: 19, available: true },
      "al-manar": { price: 19, available: true },
    },
  },
  {
    slug: "ice-latte",
    name: "Iced Latte",
    nameAr: "لاتيه بارد",
    description: "Espresso and cold milk over ice, smooth and refreshing.",
    category: "espresso-drinks",
    image: img("ice-latte"),
    branchInfo: {
      "al-basateen": { price: 18, available: true },
      "al-mohammadiyah": { price: 16, available: true },
      "al-manar": { price: 16, available: true },
    },
  },

  // ---------- BLACK COFFEE ----------
  {
    slug: "americano",
    name: "Americano",
    nameAr: "امريكانو",
    description: "Espresso lengthened with hot water for a lighter, clean cup.",
    category: "black-coffee",
    image: img("americano"),
    branchInfo: {
      "al-basateen": { price: 15, available: true },
      "al-mohammadiyah": { price: 14, available: true },
      "al-manar": { price: 14, available: true },
    },
  },
  {
    slug: "turkish-coffee",
    name: "Turkish Coffee",
    nameAr: "قهوة تركي",
    description: "Finely ground coffee slow-brewed unfiltered, thick and aromatic.",
    category: "black-coffee",
    image: img("turkish-coffee"),
    branchInfo: {
      "al-basateen": { price: 11, available: true },
      "al-mohammadiyah": { price: 10, available: true },
      "al-manar": { price: 10, available: true },
    },
  },
  {
    slug: "hot-coffee-of-the-day",
    name: "Hot Coffee of the Day",
    nameAr: "قهوة اليوم حار",
    description: "Today's featured filter roast, brewed hot. Small / medium / large.",
    category: "black-coffee",
    image: img("hot-coffee-of-the-day"),
    branchInfo: {
      "al-basateen": {
        price: 9,
        available: true,
        priceNote: "9 / 13 / 15",
        sizes: [
          { label: "Small", labelAr: "صغير", price: 9 },
          { label: "Medium", labelAr: "وسط", price: 13 },
          { label: "Large", labelAr: "كبير", price: 15 },
        ],
      },
      "al-mohammadiyah": {
        price: 8,
        available: true,
        priceNote: "8 / 11 / 13",
        sizes: [
          { label: "Small", labelAr: "صغير", price: 8 },
          { label: "Medium", labelAr: "وسط", price: 11 },
          { label: "Large", labelAr: "كبير", price: 13 },
        ],
      },
      "al-manar": {
        price: 8,
        available: true,
        priceNote: "8 / 11 / 13",
        sizes: [
          { label: "Small", labelAr: "صغير", price: 8 },
          { label: "Medium", labelAr: "وسط", price: 11 },
          { label: "Large", labelAr: "كبير", price: 13 },
        ],
      },
    },
  },
  {
    slug: "iced-coffee-of-the-day",
    name: "Iced Coffee of the Day",
    nameAr: "قهوة اليوم بارد",
    description: "Today's featured filter roast, served over ice. Small / large.",
    category: "black-coffee",
    image: img("iced-coffee-of-the-day"),
    branchInfo: {
      "al-basateen": { price: 13, available: true, priceNote: "13 / 15" },
      "al-mohammadiyah": { price: 10, available: true, priceNote: "10 / 13" },
      "al-manar": { price: 8, available: true, priceNote: "8 / 10 / 13" },
    },
  },
  {
    slug: "cold-brew",
    name: "Cold Brew",
    nameAr: "كولد برو",
    description: "Steeped cold for 18 hours — smooth, low-acid, naturally sweet.",
    category: "black-coffee",
    image: img("cold-brew"),
    branchInfo: {
      "al-basateen": { price: 25, available: true },
      "al-mohammadiyah": { price: 25, available: true },
      "al-manar": { price: 25, available: true },
    },
  },
  {
    slug: "chemex",
    name: "Chemex",
    nameAr: "كيمكس",
    description: "Pour-over brewed by the cup for a bright, clean finish.",
    category: "black-coffee",
    image: img("chemex"),
    branchInfo: {
      "al-basateen": { price: 23, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "special-v60",
    name: "Special V60",
    nameAr: "في سكستي فاخر",
    description: "V60 pour-over featuring a rotating specialty single-origin bean.",
    category: "black-coffee",
    image: img("special-v60"),
    branchInfo: {
      "al-basateen": { price: 27, available: true },
      "al-mohammadiyah": { price: 25, available: true },
      "al-manar": { price: 25, available: true },
    },
  },
  {
    slug: "v60",
    name: "V60",
    nameAr: "في سكستي",
    description: "Hand-poured filter coffee through a V60 dripper.",
    category: "black-coffee",
    image: img("v60"),
    branchInfo: {
      "al-basateen": { price: 23, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "ice",
    name: "Ice",
    nameAr: "ثلج",
    description: "A cup of ice, for building your own cold drink at the table.",
    category: "black-coffee",
    image: img("ice"),
    branchInfo: {
      "al-basateen": { price: 2, available: true },
      "al-mohammadiyah": { price: 2, available: true },
      "al-manar": { price: 2, available: true },
    },
  },
  {
    slug: "oska-water",
    name: "Oska Water",
    nameAr: "مياه اوسكا",
    description: "Still bottled water.",
    category: "black-coffee",
    image: img("oska-water"),
    branchInfo: {
      "al-basateen": { price: 5, available: true },
      "al-mohammadiyah": { price: 4, available: true },
      "al-manar": { price: 1, available: true },
    },
  },
  {
    slug: "sparkling-water",
    name: "Sparkling Water",
    nameAr: "مياه غازية اوسكا",
    description: "Chilled sparkling water.",
    category: "black-coffee",
    image: img("sparkling-water"),
    branchInfo: {
      "al-basateen": { price: 5, available: true },
      "al-mohammadiyah": { price: 4, available: true },
      "al-manar": { price: 4, available: true },
    },
  },
  {
    slug: "coffee-day-box",
    name: "Coffee Day Box",
    nameAr: "بوكس قهوة اليوم",
    description: "A boxed batch of the day's coffee to share — serves a small group.",
    category: "black-coffee",
    image: img("coffee-day-box"),
    branchInfo: {
      "al-basateen": { price: 38, available: true },
      "al-mohammadiyah": { price: 35, available: true },
      "al-manar": { price: 35, available: true },
    },
  },

  // ---------- COLD & HOT DRINKS ----------
  {
    slug: "hibiscus",
    name: "Hibiscus",
    nameAr: "كركديه",
    description: "Chilled hibiscus with fresh mint and citrus.",
    category: "cold-drinks",
    image: img("hibiscus"),
    branchInfo: {
      "al-basateen": { price: 19, available: true },
      "al-mohammadiyah": { price: 17, available: true },
      "al-manar": { price: 17, available: true, priceNote: "9 / 17" },
    },
  },
  {
    slug: "iced-tea-peach",
    name: "Iced Tea Peach",
    nameAr: "ايس تي خوخ",
    description: "Black tea over ice with peach and a squeeze of lemon.",
    category: "cold-drinks",
    image: img("iced-tea-peach"),
    branchInfo: {
      "al-basateen": { price: 21, available: true },
      "al-mohammadiyah": { price: 19, available: true },
      "al-manar": { price: 19, available: true },
    },
  },
  {
    slug: "mojito-mix-berry",
    name: "Mojito Mix Berry",
    nameAr: "موهيتو مكس توت",
    description: "Muddled mixed berries, mint and lime over crushed ice.",
    category: "cold-drinks",
    image: img("mojito-mix-berry"),
    branchInfo: {
      "al-basateen": { price: 21, available: true },
      "al-mohammadiyah": { price: 19, available: true },
      "al-manar": { price: 19, available: true },
    },
  },
  {
    slug: "matcha-latte",
    name: "Matcha Latte",
    nameAr: "ماتشا لاتيه",
    description: "Ceremonial-grade matcha whisked with cold milk over ice.",
    category: "cold-drinks",
    image: img("matcha-latte"),
    branchInfo: {
      "al-basateen": { price: 25, available: true },
      "al-mohammadiyah": { price: 23, available: true },
      "al-manar": { price: 23, available: true },
    },
  },
  {
    slug: "passion-fruit-smoothie",
    name: "Passion Fruit Smoothie",
    nameAr: "سموذي باشن فروت",
    description: "Blended passion fruit smoothie, tart and tropical.",
    category: "cold-drinks",
    image: img("passion-fruit-smoothie"),
    branchInfo: {
      "al-basateen": { price: 23, available: true },
      "al-mohammadiyah": { price: 21, available: true },
      "al-manar": { price: 21, available: true },
    },
  },
  {
    slug: "orange-juice",
    name: "Orange Juice",
    nameAr: "عصير برتقال",
    description: "Freshly squeezed orange juice.",
    category: "cold-drinks",
    image: img("orange-juice"),
    branchInfo: {
      "al-basateen": { price: 15, available: true },
      "al-mohammadiyah": { price: 15, available: true },
      "al-manar": { price: 15, available: true },
    },
  },
  {
    slug: "summer-potion-smoothie",
    name: "Summer Potion Smoothie",
    nameAr: "سموذي سمر بوشن",
    description: "A blended blueberry-forward summer smoothie.",
    category: "cold-drinks",
    image: img("summer-potion-smoothie"),
    branchInfo: {
      "al-basateen": { price: 23, available: true },
      "al-mohammadiyah": { price: 21, available: true },
      "al-manar": { price: 21, available: true },
    },
  },
  {
    slug: "iced-tea-pineapple",
    name: "Iced Tea Pineapple",
    nameAr: "ايس تي اناناس",
    description: "Black tea over ice with pineapple and mint.",
    category: "cold-drinks",
    image: img("iced-tea-pineapple"),
    branchInfo: {
      "al-basateen": { price: 21, available: true },
      "al-mohammadiyah": { price: 19, available: true },
      "al-manar": { price: 19, available: true },
    },
  },
  {
    slug: "hot-chocolate",
    name: "Hot Chocolate",
    nameAr: "شوكلت حار",
    description: "Rich melted chocolate, steamed and topped with shavings.",
    category: "cold-drinks",
    image: img("hot-chocolate"),
    branchInfo: {
      "al-basateen": { price: 19, available: true },
      "al-mohammadiyah": { price: 17, available: true },
      "al-manar": { price: 17, available: true },
    },
  },
  {
    slug: "sahlab",
    name: "Sahlab",
    nameAr: "سحلب",
    description: "A warm, creamy Middle Eastern classic topped with pistachio.",
    category: "cold-drinks",
    image: img("sahlab"),
    branchInfo: {
      "al-basateen": { price: 16, available: true },
      "al-mohammadiyah": { price: 14, available: true },
      "al-manar": { price: 14, available: true },
    },
  },
  {
    slug: "iced-chocolate",
    name: "Iced Chocolate",
    nameAr: "ايس شوكلت",
    description: "Chocolate blended with milk and ice, topped with cocoa.",
    category: "cold-drinks",
    image: img("iced-chocolate"),
    branchInfo: {
      "al-basateen": { price: 19, available: true },
      "al-mohammadiyah": { price: 17, available: true },
      "al-manar": { price: 17, available: true },
    },
  },
  {
    slug: "lemon-mint-smoothie",
    name: "Lemon Mint Smoothie",
    nameAr: "سموذي ليمون نعناع",
    description: "Blended lemon and fresh mint over ice — bright and cooling.",
    category: "cold-drinks",
    image: img("lemon-mint-smoothie"),
    branchInfo: {
      "al-basateen": { price: 14, available: true },
      "al-mohammadiyah": { price: 12, available: true },
      "al-manar": { price: 12, available: true },
    },
  },
  {
    slug: "pina-colada",
    name: "Pina Colada (Virgin)",
    nameAr: "بيناكولادا",
    description: "Blended pineapple and coconut, non-alcoholic.",
    category: "cold-drinks",
    image: img("pina-colada"),
    branchInfo: {
      "al-basateen": { price: 23, available: true },
      "al-mohammadiyah": { price: 21, available: true },
      "al-manar": { price: 21, available: true },
    },
  },

  // ---------- DESSERTS ----------
  {
    slug: "trio-cake",
    name: "Trio Cake",
    nameAr: "تريو كيك",
    description: "Layered chocolate cake with caramel drip and toffee crunch.",
    category: "desserts",
    image: img("trio-cake"),
    branchInfo: {
      "al-basateen": { price: 30, available: true },
      "al-mohammadiyah": { price: 30, available: true },
      "al-manar": { price: 30, available: true },
    },
  },
  {
    slug: "rice-krispy",
    name: "Rice Krispy",
    nameAr: "رايس كرسبي",
    description: "A crisp, chocolate-coated rice cereal bar.",
    category: "desserts",
    image: img("rice-krispy"),
    branchInfo: {
      "al-basateen": { price: 12, available: true },
      "al-mohammadiyah": { price: 10, available: true },
      "al-manar": { price: 10, available: true },
    },
  },
  {
    slug: "dolchie-cake",
    name: "Dolchie Cake",
    nameAr: "دولتشي كيك",
    description: "Dark chocolate layer cake with a caramel-dulce center.",
    category: "desserts",
    image: img("dolchie-cake"),
    branchInfo: {
      "al-basateen": { price: 27, available: true },
      "al-mohammadiyah": { price: 27, available: true },
      "al-manar": { price: 27, available: true },
    },
  },
  {
    slug: "yogurt-granola",
    name: "Yogurt Granola",
    nameAr: "جرانولا الزبادي",
    description: "Layered yogurt, berry compote and toasted granola.",
    category: "desserts",
    image: img("yogurt-granola"),
    branchInfo: {
      "al-basateen": { price: 23, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "house-layers",
    name: "House Layers",
    nameAr: "طبقات البيت",
    description: "Our signature layered jar dessert — chocolate, cream and crunch.",
    category: "desserts",
    image: img("house-layers"),
    branchInfo: {
      "al-basateen": { price: 28, available: true },
      "al-mohammadiyah": { price: 25, available: true },
      "al-manar": { price: 25, available: true },
    },
  },
  {
    slug: "date-cheese",
    name: "Date Cheese",
    nameAr: "تشيز التمر",
    description: "No-bake date cheesecake with a pecan-caramel swirl.",
    category: "desserts",
    image: img("date-cheese"),
    branchInfo: {
      "al-basateen": { price: 27, available: true },
      "al-mohammadiyah": { price: 25, available: true },
      "al-manar": { price: 25, available: true },
    },
  },
  {
    slug: "tiramisu",
    name: "Tiramisu",
    nameAr: "تراميسو",
    description: "Espresso-soaked layers with mascarpone cream and cocoa dust.",
    category: "desserts",
    image: img("tiramisu"),
    branchInfo: {
      "al-basateen": { price: 23, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "salted-carrot-cake",
    name: "Salted Carrot Cake",
    nameAr: "سولتد جزر",
    description: "Spiced carrot cake, cream cheese frosting, salted caramel top.",
    category: "desserts",
    image: img("salted-carrot-cake"),
    branchInfo: {
      "al-basateen": { price: 30, available: true },
      "al-mohammadiyah": { price: 27, available: true },
      "al-manar": { price: 27, available: true },
    },
  },
  {
    slug: "mango-pudding",
    name: "Mango Pudding",
    nameAr: "بودنق مانجو",
    description: "Silky mango pudding cake, topped with fresh mango cubes.",
    category: "desserts",
    image: img("mango-pudding"),
    branchInfo: {
      "al-basateen": { price: 27, available: true },
      "al-mohammadiyah": { price: 25, available: true },
      "al-manar": { price: 25, available: true },
    },
  },
  {
    slug: "french-toast",
    name: "French Toast Cake",
    nameAr: "فرنش توست",
    description: "Caramelized French toast cake with granola and vanilla ice cream.",
    category: "desserts",
    image: img("french-toast"),
    branchInfo: {
      "al-basateen": { price: 27, available: true },
      "al-mohammadiyah": { price: 24, available: true },
      "al-manar": { price: 24, available: true },
    },
  },
  {
    slug: "lotus-caramel",
    name: "Lotus Caramel",
    nameAr: "لوتس كراميل",
    description: "Lotus biscoff layered cake with caramel and biscuit crumb.",
    category: "desserts",
    image: img("lotus-caramel"),
    branchInfo: {
      "al-basateen": { price: 30, available: true },
      "al-mohammadiyah": { price: 27, available: true },
      "al-manar": { price: 27, available: true },
    },
  },
  {
    slug: "crunchy-chocolate",
    name: "Crunchy Chocolate",
    nameAr: "كرنشي شوكلت",
    description: "Dense chocolate cake with a crunchy praline top layer.",
    category: "desserts",
    image: img("crunchy-chocolate"),
    branchInfo: {
      "al-basateen": { price: 30, available: true },
      "al-mohammadiyah": { price: 27, available: true },
      "al-manar": { price: 27, available: true },
    },
  },

  // ---------- SANDWICHES ----------
  {
    slug: "tuna-sandwich",
    name: "Tuna Sandwich",
    nameAr: "شباتا تونا",
    description: "Tuna salad on a soft toasted roll with lettuce.",
    category: "sandwiches",
    image: img("tuna-sandwich"),
    branchInfo: {
      "al-basateen": { price: 18, available: true },
      "al-mohammadiyah": { price: 15, available: true },
      "al-manar": { price: 15, available: true },
    },
  },
  {
    slug: "egg-sandwich",
    name: "Egg Sandwich",
    nameAr: "شباتا بيض",
    description: "Egg salad, lettuce and roasted turkey on a toasted roll.",
    category: "sandwiches",
    image: img("egg-sandwich"),
    branchInfo: {
      "al-basateen": { price: 18, available: true },
      "al-mohammadiyah": { price: 15, available: true },
      "al-manar": { price: 15, available: true },
    },
  },
  {
    slug: "cheese-sandwich",
    name: "Cheese Sandwich",
    nameAr: "شباتا اجبان",
    description: "A trio of melted cheeses on toasted flatbread.",
    category: "sandwiches",
    image: img("cheese-sandwich"),
    branchInfo: {
      "al-basateen": { price: 16, available: true },
      "al-mohammadiyah": { price: 13, available: true },
      "al-manar": { price: 13, available: true },
    },
  },
  {
    slug: "chicken-fajitas",
    name: "Chicken Fajitas",
    nameAr: "فاهيتا دجاج",
    description: "Spiced chicken and peppers stuffed into a toasted roll.",
    category: "sandwiches",
    image: img("chicken-fajitas"),
    branchInfo: {
      "al-basateen": { price: 24, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "halloumi-vegetables",
    name: "Halloumi Vegetables",
    nameAr: "حلومي خضار",
    description: "Grilled halloumi with roasted vegetables on toasted bread.",
    category: "sandwiches",
    image: img("halloumi-vegetables"),
    branchInfo: {
      "al-basateen": { price: 25, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "halloumi-pesto",
    name: "Halloumi Pesto",
    nameAr: "حلومي بيستو",
    description: "Grilled halloumi, roasted pepper and pesto on toasted bread.",
    category: "sandwiches",
    image: img("halloumi-pesto"),
    branchInfo: {
      "al-basateen": { price: 25, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },
  {
    slug: "turkey-toast",
    name: "Turkey Toast",
    nameAr: "تيركي توست",
    description: "Sliced turkey, cheese and pickles on toasted white bread.",
    category: "sandwiches",
    image: img("turkey-toast"),
    branchInfo: {
      "al-basateen": { price: 19, available: true },
      "al-mohammadiyah": { price: 17, available: true },
      "al-manar": { price: 17, available: true },
    },
  },
  {
    slug: "chips",
    name: "Chips",
    nameAr: "شبس",
    description: "A side of seasoned potato chips.",
    category: "sandwiches",
    image: img("chips"),
    branchInfo: {
      "al-basateen": { price: 3, available: true },
      "al-mohammadiyah": { price: 3, available: true },
      "al-manar": { price: 3, available: true },
    },
  },
  {
    slug: "chicken-cajun",
    name: "Chicken Cajun",
    nameAr: "دجاج كيجن",
    description: "Cajun-spiced chicken with greens on multigrain bread.",
    category: "sandwiches",
    image: img("chicken-cajun"),
    branchInfo: {
      "al-basateen": { price: 24, available: true },
      "al-mohammadiyah": { price: 20, available: true },
      "al-manar": { price: 20, available: true },
    },
  },

  // ---------- BEANS ----------
  {
    slug: "colombia",
    name: "Colombia",
    nameAr: "كولومبي",
    description: "250g whole bean, medium roast — balanced, notes of caramel and nut.",
    category: "beans",
    image: img("colombia"),
    branchInfo: {
      "al-basateen": { price: 54, available: true },
      "al-mohammadiyah": { price: 54, available: true },
      "al-manar": { price: 54, available: true },
    },
  },
  {
    slug: "colombia-reserve",
    name: "Colombia Reserve",
    nameAr: "كولومبي",
    description: "250g whole bean, a lighter reserve lot of the same origin.",
    category: "beans",
    image: img("colombia-reserve"),
    branchInfo: {
      "al-basateen": { price: 46, available: true },
      "al-mohammadiyah": { price: 46, available: true },
      "al-manar": { price: 46, available: true },
    },
  },
  {
    slug: "uganda",
    name: "Uganda",
    nameAr: "اوغندي",
    description: "250g whole bean — full-bodied with dark chocolate notes.",
    category: "beans",
    image: img("uganda"),
    branchInfo: {
      "al-basateen": { price: 56, available: true },
      "al-mohammadiyah": { price: 56, available: true },
      "al-manar": { price: 56, available: true },
    },
  },
  {
    slug: "ethiopia",
    name: "Ethiopia",
    nameAr: "اثيوبي",
    description: "250g whole bean — bright and floral with a citrus finish.",
    category: "beans",
    image: img("ethiopia"),
    branchInfo: {
      "al-basateen": { price: 54, available: true },
      "al-mohammadiyah": { price: 54, available: true },
      "al-manar": { price: 54, available: true },
    },
  },
  {
    slug: "yemeni",
    name: "Yemeni",
    nameAr: "يمني فاخر",
    description: "250g whole bean, premium lot — spiced, wine-like complexity.",
    category: "beans",
    image: img("yemeni"),
    branchInfo: {
      "al-basateen": { price: 90, available: true },
      "al-mohammadiyah": { price: 90, available: true },
      "al-manar": { price: 90, available: true },
    },
  },
  {
    slug: "colombia-peach",
    name: "Colombia Peach",
    nameAr: "كولومبي خوخ فاخر",
    description: "250g whole bean, premium fermentation lot with a peach-like fruit note.",
    category: "beans",
    image: img("colombia-peach"),
    branchInfo: {
      "al-basateen": { price: 90, available: true },
      "al-mohammadiyah": { price: 90, available: true },
      "al-manar": { price: 90, available: true },
    },
  },
  {
    slug: "colombia-grape",
    name: "Colombia Grape",
    nameAr: "كولومبي عنب فاخر",
    description: "250g whole bean, premium fermentation lot with a grape-like fruit note.",
    category: "beans",
    image: img("colombia-grape"),
    branchInfo: {
      "al-basateen": { price: 90, available: true },
      "al-mohammadiyah": { price: 90, available: true },
      "al-manar": { price: 90, available: true },
    },
  },
  {
    slug: "colombia-passion-fruit",
    name: "Colombia Passion Fruit",
    nameAr: "كولومبي فواكة استوائية فاخر",
    description: "250g whole bean, premium fermentation lot with tropical passion-fruit notes.",
    category: "beans",
    image: img("colombia-passion-fruit"),
    branchInfo: {
      "al-basateen": { price: 90, available: true },
      "al-mohammadiyah": { price: 90, available: true },
      "al-manar": { price: 90, available: true },
    },
  },
];

// A couple of items marked unavailable at specific branches, to demonstrate
// the availability-status feature — adjust freely from the admin dashboard.
PRODUCTS.find((p) => p.slug === "special-v60")!.branchInfo["al-manar"].available = false;
PRODUCTS.find((p) => p.slug === "matcha-latte")!.branchInfo["al-mohammadiyah"].available = false;

export function getAllergens(slug: string): string[] {
  const savory = ["egg-sandwich", "cheese-sandwich", "tuna-sandwich", "halloumi-vegetables", "halloumi-pesto", "turkey-toast", "chicken-fajitas", "chicken-cajun"];
  const dessert = PRODUCTS.filter((p) => p.category === "desserts").map((p) => p.slug);
  if (savory.includes(slug) || dessert.includes(slug)) return ALLERGEN_NOTE;
  return [];
}

export function productsForBranch(branchId: BranchId): ResolvedProduct[] {
  return PRODUCTS.map((p) => {
    const info = p.branchInfo[branchId];
    const { branchInfo: _branchInfo, ...base } = p;
    void _branchInfo;
    return {
      ...base,
      price: info.price,
      available: info.available,
      priceNote: info.priceNote,
      sizes: info.sizes,
      prepTimeMinutes: DEFAULT_PREP_TIME_MINUTES,
    };
  });
}

export function productsByCategory(branchId: BranchId, category: ProductCategory): ResolvedProduct[] {
  return productsForBranch(branchId).filter((p) => p.category === category);
}

export function findProduct(branchId: BranchId, slug: string): ResolvedProduct | undefined {
  return productsForBranch(branchId).find((p) => p.slug === slug);
}
