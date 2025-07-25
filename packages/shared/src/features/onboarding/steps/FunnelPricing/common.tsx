import type { ReactElement } from 'react';
import React from 'react';
import {
  Typography,
  TypographyColor,
  TypographyTag,
  TypographyType,
} from '../../../../components/typography/Typography';
import { anchorDefaultRel } from '../../../../lib/strings';
import type {
  FunnelStepPricingParameters,
  FunnelStepPricingV2Parameters,
} from '../../types/steps/pricing';

export const PricingEmailSupport = (): ReactElement => {
  return (
    <Typography
      tag={TypographyTag.P}
      type={TypographyType.Callout}
      color={TypographyColor.Tertiary}
      className="text-center"
    >
      For technical or product related questions click here or email us at{' '}
      <a
        href="mailto:support@daily.dev"
        className="text-text-link underline"
        target="_blank"
        rel={anchorDefaultRel}
      >
        support@daily.dev
      </a>
    </Typography>
  );
};

export const isFunnelPricingV2 = (
  parameters: FunnelStepPricingParameters | FunnelStepPricingV2Parameters,
): parameters is FunnelStepPricingV2Parameters => {
  return parameters.version === 'v2';
};
