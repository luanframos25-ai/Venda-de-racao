import { CouponDefinition, StoreConfig } from '../types/store';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  brandName: 'Miau & Co.',
  whatsappNumber: '0000000000000',
  freeShippingThreshold: 199,
};

export const HERO_IMAGE =
  '/src/assets/images/hero_miau_editorial_1795622706822.jpg';

export const PRODUCT_IMAGES = {
  dry: '/src/assets/images/product_racao_seca_1795622707246.jpg',
  natural: '/src/assets/images/product_racao_natural_1795622707096.jpg',
  wet: '/src/assets/images/product_sache_umido_1795622707850.jpg',
  treats: '/src/assets/images/product_petiscos_gatos_1795622707827.jpg',
};

export const DEMO_COUPONS: CouponDefinition[] = [
  {
    code: 'MIAU10',
    label: '10% de desconto demonstrativo',
    discountPercent: 10,
  },
  {
    code: 'PRIMEIRACOMPRA',
    label: '15% OFF primeira compra (exemplo)',
    discountPercent: 15,
  },
  {
    code: 'FRETEGRATIS',
    label: 'Frete grátis ilustrativo',
    freeShipping: true,
  },
];

export const STORAGE_KEYS = {
  cart: 'miau_co_cart_v1',
  favorites: 'miau_co_favorites_v1',
  recentlyViewed: 'miau_co_recent_v1',
  storeConfig: 'miau_co_config_v2',
  tutorProfile: 'miau_co_profile_v1',
};
