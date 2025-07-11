import type { ReactElement } from 'react';
import React from 'react';
import type { PublicProfile } from '../lib/user';
import { ProfileImageSize, ProfilePicture } from './ProfilePicture';
import { useUserCompaniesQuery } from '../hooks/userCompany';
import {
  Typography,
  TypographyColor,
  TypographyType,
} from './typography/Typography';
import { Tooltip } from './tooltip/Tooltip';

export type VerifiedCompanyUserBadgeProps = {
  user: Pick<PublicProfile, 'companies'>;
  size?: ProfileImageSize;
  showCompanyName?: boolean;
  showVerified?: boolean;
};

export const VerifiedCompanyUserBadge = ({
  user,
  size = ProfileImageSize.Size16,
  showCompanyName,
  showVerified,
}: VerifiedCompanyUserBadgeProps): ReactElement => {
  const { isVerified } = useUserCompaniesQuery();
  const { companies } = user;

  if (!companies || companies.length === 0) {
    return null;
  }

  return (
    <Tooltip
      content={[
        `Verified as a ${companies[0].name} employee.`,
        ...(isVerified
          ? []
          : // eslint-disable-next-line react/jsx-key
            [<br />, 'Get your company badge via account settings.']),
      ]}
      side="bottom"
      className="text-center"
    >
      <div className="flex items-center justify-center gap-1">
        <ProfilePicture
          size={size}
          className="border border-border-subtlest-secondary"
          user={{
            image: companies[0].image,
            id: companies[0].name,
          }}
          rounded="full"
        />
        {showCompanyName && (
          <Typography
            type={TypographyType.Footnote}
            color={TypographyColor.Secondary}
          >
            {companies[0].name}
          </Typography>
        )}
        {showVerified && (
          <Typography
            type={TypographyType.Caption2}
            color={TypographyColor.Quaternary}
          >
            Verified
          </Typography>
        )}
      </div>
    </Tooltip>
  );
};
