export type CatAgeGroup = 'filhote' | 'adulto' | 'castrado' | 'idoso';

export type FoodType = 'seca' | 'natural' | 'umida' | 'petisco';

export type CategorySlug =
  | 'todos'
  | 'filhotes'
  | 'adultos'
  | 'castrados'
  | 'idosos'
  | 'premium'
  | 'naturais'
  | 'umidas'
  | 'petiscos';

export type NutritionalNeed =
  | 'Controle de Peso'
  | 'Trato Urinário'
  | 'Bolas de Pelo'
  | 'Pele & Pelagem'
  | 'Digestão Sensível'
  | 'Sem Grãos'
  | 'Crescimento Saudável'
  | 'Mobilidade & Longevidade';

export type SortOption =
  | 'bestsellers'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc';

export interface Product {
  id: string;
  name: string;
  brand: string;
  weight: string;
  weightGrams: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  categories: CategorySlug[];
  ageGroups: CatAgeGroup[];
  foodType: FoodType;
  nutritionalNeeds: NutritionalNeed[];
  isBestseller?: boolean;
  isWeeklyOffer?: boolean;
  isPremium?: boolean;
  isNatural?: boolean;
  shortDescription: string;
  ingredients: string;
  proteinPercent: string;
  caloriesPer100g: string;
  isDemoData: true;
}

export interface CategoryItem {
  slug: CategorySlug;
  title: string;
  subtitle: string;
  image: string;
  accentBg: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  isSubscription?: boolean;
  frequencyDays?: number;
}

export interface StoreConfig {
  brandName: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
}

export interface QuizAnswers {
  catName: string;
  age: 'filhote' | 'adulto' | 'idoso';
  weight: 'ate-3kg' | '3-a-5kg' | 'acima-5kg';
  neutered: boolean;
  activity: 'calmo' | 'moderado' | 'ativo';
  foodPreference: 'seca' | 'umida' | 'mista' | 'natural';
  nutritionalNeed: NutritionalNeed;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  image: string;
  content: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface IllustrativeReview {
  id: string;
  tutorName: string;
  catName: string;
  city: string;
  rating: number;
  productName: string;
  comment: string;
  isExample: true;
}

export interface CouponDefinition {
  code: string;
  label: string;
  discountPercent?: number;
  freeShipping?: boolean;
  minSubtotal?: number;
}
