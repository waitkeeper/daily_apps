import type {
  BoxFaqProps,
  BoxListProps,
  ImageReviewProps,
  PricingPlanVariation,
} from '../../shared';

export enum FunnelPricingType {
  Daily = 'daily',
  Monthly = 'monthly',
}

export interface FunnelStepPricingPlan {
  priceId: string;
  label: string;
  variation?: PricingPlanVariation;
  badge?: {
    text: string;
    background: string;
  };
  oldPrice?: Record<FunnelPricingType, string>;
}

export interface FunnelStepPricingDiscount {
  message: string;
  duration: number;
}

export interface FunnelStepPricingRefund {
  title: string;
  content: string;
  image: string;
}

export interface FunnelStepPricingParameters {
  version?: 'v1';
  headline: string;
  cta: string;
  pricingType: FunnelPricingType;
  discount: FunnelStepPricingDiscount;
  defaultPlan: FunnelStepPricingPlan['priceId'];
  plans: Array<FunnelStepPricingPlan>;
  perks: string[];
  featuresList: Omit<BoxListProps, 'className'>;
  review: Omit<ImageReviewProps, 'className'>;
  refund: FunnelStepPricingRefund;
  faq: BoxFaqProps['items'];
}

export interface FunnelStepPricingV2Parameters {
  version: 'v2';
  discount: FunnelStepPricingDiscount;
  hero: {
    image: string;
    headline: string;
    explainer: string;
  };
  features: {
    heading: string;
    items: string[];
  };
  plans: Array<FunnelStepPricingPlan>;
  plansBlock: {
    heading: string;
    timer: {
      message: string;
    };
    pricingType: FunnelPricingType;
    defaultPlan: FunnelStepPricingPlan['priceId'];
    ctaMessage: string;
    cta: string;
  };
  refund: FunnelStepPricingRefund;
  reviews: {
    heading: string;
    items: Array<Omit<ImageReviewProps, 'className' | 'image'>>;
  };
  trust: {
    image: string;
  };
  faq: BoxFaqProps;
}
