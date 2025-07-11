import { gql } from 'graphql-request';
import type { PricePreviewResponse } from '@paddle/paddle-js/types/price-preview/price-preview';
import { gqlClient } from './common';
import type { PlusPriceTypeAppsId, PlusPriceType } from '../lib/featureValues';

export type PaddleProductLineItem =
  PricePreviewResponse['data']['details']['lineItems'][0];

export interface Price {
  amount: number;
  formatted: string;
}

export interface ProductPricingMetadata {
  appsId: PlusPriceTypeAppsId;
  title: string;
  caption?: {
    copy: string;
    color: PricingCaptionColor;
  };
  idMap: {
    paddle: string;
    ios: string;
  };
  coresValue?: number;
}

export interface ProductPricing extends Price {
  monthly?: Price;
  daily?: Price;
}

export interface BaseProductPricingPreview {
  priceId: string;
  price: ProductPricing;
  currency: {
    code: string;
    symbol: string;
  };
  duration: PlusPriceType;
}

export interface ProductPricingPreview extends BaseProductPricingPreview {
  metadata: ProductPricingMetadata;
}

export enum PurchaseType {
  Plus = 'plus',
  Organization = 'organization',
  Cores = 'cores',
}

export enum PlusPlanType {
  Organization = 'organization',
  Personal = 'personal',
}

export const PRICING_METADATA_FRAGMENT = gql`
  fragment PricingMetadataFragment on ProductPricingMetadata {
    appsId
    title
    caption {
      copy
      color
    }
    idMap {
      paddle
      ios
    }
    coresValue
  }
`;

const PRICING_PREVIEW_QUERY = gql`
  query PricingPreview($type: PricingType, $locale: String) {
    pricingPreview(type: $type, locale: $locale) {
      metadata {
        ...PricingMetadataFragment
      }
      priceId
      price {
        amount
        formatted
        monthly {
          amount
          formatted
        }
        daily {
          amount
          formatted
        }
      }
      currency {
        code
        symbol
      }
      duration
    }
  }
  ${PRICING_METADATA_FRAGMENT}
`;

interface PricingPreviewResponse {
  pricingPreview: ProductPricingPreview[];
}

export const fetchPricingPreview = async (
  type: PurchaseType,
  locale = globalThis?.navigator?.language ?? 'en-US',
): Promise<ProductPricingPreview[]> => {
  const { pricingPreview } = await gqlClient.request<PricingPreviewResponse>(
    PRICING_PREVIEW_QUERY,
    { type, locale },
  );

  return pricingPreview;
};

const PRICING_PREVIEW_BY_IDS_QUERY = gql`
  query PricingPreviewByIds(
    $ids: [String]!
    $locale: String
    $loadMetadata: Boolean
  ) {
    pricingPreviewByIds(
      ids: $ids
      locale: $locale
      loadMetadata: $loadMetadata
    ) {
      priceId
      metadata {
        ...PricingMetadataFragment
      }
      price {
        amount
        formatted
        monthly {
          amount
          formatted
        }
        daily {
          amount
          formatted
        }
      }
      currency {
        code
        symbol
      }
      duration
      trialPeriod {
        interval
        frequency
      }
    }
  }
  ${PRICING_METADATA_FRAGMENT}
`;

export const fetchPricingPreviewByIds = async (
  ids: string[],
  locale = globalThis?.navigator?.language ?? 'en-US',
  loadMetadata = false,
): Promise<ProductPricingPreview[]> => {
  const { pricingPreviewByIds } = await gqlClient.request<{
    pricingPreviewByIds: ProductPricingPreview[];
  }>(PRICING_PREVIEW_BY_IDS_QUERY, { ids, locale, loadMetadata });

  return pricingPreviewByIds;
};

const PRICING_METADATA_QUERY = gql`
  query PricingMetadata($type: PricingType) {
    pricingMetadata(type: $type) {
      ...PricingMetadataFragment
    }
  }
  ${PRICING_METADATA_FRAGMENT}
`;

export const fetchPricingMetadata = async (
  type: PurchaseType,
): Promise<ProductPricingMetadata[]> => {
  const { pricingMetadata } = await gqlClient.request<{
    pricingMetadata: ProductPricingMetadata[];
  }>(PRICING_METADATA_QUERY, { type });

  return pricingMetadata;
};

export enum PricingCaptionColor {
  Success = 'success',
  Help = 'help',
}
