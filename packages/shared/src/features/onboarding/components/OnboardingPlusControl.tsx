import type { ReactElement } from 'react';
import React from 'react';
import classNames from 'classnames';
import { useViewSize, ViewSize } from '../../../hooks';
import {
  Typography,
  TypographyColor,
  TypographyTag,
  TypographyType,
} from '../../../components/typography/Typography';
import { PlusComparingCards } from './PlusComparingCards';
import { ElementPlaceholder } from '../../../components/ElementPlaceholder';
import { ListItemPlaceholder } from '../../../components/widgets/ListItemPlaceholder';
import type { FunnelStepPlusCards } from '../types/funnel';
import { useFunnelAnnualPricing } from '../hooks/useFunnelAnnualPricing';

const switchSkeletonItems = Array.from({ length: 2 }, (_, i) => i);
const PlusSkeleton = (): ReactElement => (
  <div className="flex flex-col items-center">
    <div className="mx-auto grid grid-cols-1 place-content-center items-start gap-6 tablet:grid-cols-2">
      {switchSkeletonItems.map((index) => (
        <div
          key={index}
          className={classNames(
            'mx-auto w-[21rem] max-w-full rounded-16 border border-border-subtlest-tertiary bg-surface-float p-4',
            index === 0 ? 'min-h-80' : 'min-h-96',
          )}
        >
          <ElementPlaceholder className="mb-4 h-6 w-10 rounded-4" />
          <ElementPlaceholder className="mb-1 h-8 w-10 rounded-4" />
          <ElementPlaceholder className="h-3 w-20 rounded-4" />
          <ElementPlaceholder className="my-4 h-10 w-full rounded-16" />
          <div className="flex flex-col gap-2">
            <ListItemPlaceholder padding="p-0 gap-2.5" textClassName="h-3" />
            {index === 1 && (
              <ListItemPlaceholder padding="p-0 gap-2.5" textClassName="h-3" />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

type Parameters = Pick<FunnelStepPlusCards, 'parameters'>;

interface OnboardingPlusControlProps extends Parameters {
  onSkip?: () => void;
  onComplete?: () => void;
}

export const OnboardingPlusControl = ({
  parameters: { headline, explainer, free, plus },
  onSkip,
  onComplete,
}: OnboardingPlusControlProps): ReactElement => {
  const isLaptop = useViewSize(ViewSize.Laptop);
  const { item } = useFunnelAnnualPricing();

  return (
    <section className="mx-auto flex w-full max-w-screen-laptop flex-1 flex-col justify-center gap-10 py-10 tablet:px-10">
      <header className="text-center">
        <Typography
          bold
          tag={TypographyTag.H1}
          type={isLaptop ? TypographyType.LargeTitle : TypographyType.Title2}
          className="mb-4 tablet:mb-6"
        >
          {headline || 'Fast-track your growth'}
        </Typography>
        <Typography
          className="mx-auto text-balance tablet:w-2/3"
          color={TypographyColor.Secondary}
          tag={TypographyTag.H2}
          type={isLaptop ? TypographyType.Title3 : TypographyType.Callout}
        >
          {explainer ||
            `Work smarter, learn faster, and stay ahead with AI tools, custom
          feeds, and pro features. Because copy-pasting code isn't a
          long-term strategy.`}
        </Typography>
      </header>
      {item ? (
        <PlusComparingCards
          productOption={item}
          onClickNext={onSkip}
          onClickPlus={onComplete}
          free={free}
          plus={plus}
        />
      ) : (
        <PlusSkeleton />
      )}
    </section>
  );
};
