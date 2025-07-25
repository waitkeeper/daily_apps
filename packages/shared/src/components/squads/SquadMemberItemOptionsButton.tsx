import type { ReactElement } from 'react';
import React from 'react';
import type { SourceMember } from '../../graphql/sources';
import { SourceMemberRole } from '../../graphql/sources';
import { Button, ButtonSize, ButtonVariant } from '../buttons/Button';
import { BlockIcon, MenuIcon } from '../icons';
import { useAuthContext } from '../../contexts/AuthContext';
import type { PromptOptions } from '../../hooks/usePrompt';
import { usePrompt } from '../../hooks/usePrompt';
import { UserShortInfo } from '../profile/UserShortInfo';
import { useToastNotification } from '../../hooks';
import { Tooltip } from '../tooltip/Tooltip';

interface SquadMemberActionsProps {
  member: SourceMember;
  onUnblock: React.MouseEventHandler;
  onOptionsClick: React.MouseEventHandler;
}

function SquadMemberItemOptionsButton({
  member,
  onUnblock,
  onOptionsClick,
}: SquadMemberActionsProps): ReactElement {
  const { showPrompt } = usePrompt();
  const { displayToast } = useToastNotification();
  const { user: loggedUser } = useAuthContext();
  const { role, user } = member;

  const onConfirmUnblock = async (e: React.MouseEvent) => {
    e.preventDefault();

    const options: PromptOptions = {
      title: 'Unblock member?',
      description: `${user.name} will now have access to join your Squad and can then post, upvote and comment`,
      okButton: {
        title: 'Unblock',
        variant: ButtonVariant.Primary,
      },
      content: (
        <UserShortInfo
          disableTooltip
          user={user}
          className={{
            container: 'justify-center px-6 py-3',
            textWrapper: 'max-w-fit',
          }}
        />
      ),
      className: { buttons: 'mt-6' },
    };

    if (await showPrompt(options)) {
      onUnblock(e);
      displayToast('Member is now unblocked');
    }
  };

  if (role === SourceMemberRole.Blocked) {
    return (
      <Tooltip content="Unblock">
        <Button
          className="my-auto ml-2"
          variant={ButtonVariant.Tertiary}
          icon={<BlockIcon />}
          onClick={onConfirmUnblock}
        />
      </Tooltip>
    );
  }

  const option = (
    <Tooltip content="Member options">
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Tertiary}
        className="z-1 m-auto ml-2 mr-0"
        onClick={onOptionsClick}
        icon={<MenuIcon />}
      />
    </Tooltip>
  );

  const sameUser = loggedUser && loggedUser.id === user.id;
  const hideOption = sameUser || !loggedUser;

  return hideOption ? null : option;
}

export default SquadMemberItemOptionsButton;
