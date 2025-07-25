import type { ReactElement, ReactNode } from 'react';
import React, { useRef, useState } from 'react';
import type { ModalProps } from './common/Modal';
import { Modal } from './common/Modal';
import type { UserListProps } from '../profile/UserList';
import UserList from '../profile/UserList';
import type { InfiniteScrollingProps } from '../containers/InfiniteScrolling';
import type { UserShortProfile } from '../../lib/user';
import { SearchField } from '../fields/SearchField';
import type { Origin } from '../../lib/log';

export interface UserListModalProps extends Omit<ModalProps, 'children'> {
  users: UserShortProfile[];
  placeholderAmount?: number;
  title: string;
  header?: ReactNode;
  scrollingProps: Omit<InfiniteScrollingProps, 'children'>;
  userListProps?: Pick<
    UserListProps,
    | 'additionalContent'
    | 'afterContent'
    | 'initialItem'
    | 'isLoading'
    | 'emptyPlaceholder'
  >;
  onSearch?(query: string): void;
  origin?: Origin;
  showAward?: boolean;
  showFollow?: boolean;
  showSubscribe?: boolean;
  children?: ReactNode;
}

function UserListModal({
  users,
  title,
  header,
  scrollingProps,
  placeholderAmount,
  size = Modal.Size.Medium,
  userListProps,
  onSearch,
  origin,
  showFollow = true,
  showSubscribe = true,
  showAward,
  children,
  ...props
}: UserListModalProps): ReactElement {
  const container = useRef<HTMLElement>();
  const [modalRef, setModalRef] = useState<HTMLElement>();

  const { onScroll, ...otherScrollingProps } = scrollingProps;

  return (
    <Modal
      contentRef={(e) => setModalRef(e)}
      kind={Modal.Kind.FlexibleCenter}
      size={size}
      {...props}
    >
      {header ?? <Modal.Header title={title} />}
      <Modal.Body className="!p-0" onScroll={onScroll} ref={container}>
        {onSearch && (
          <SearchField
            className="mx-6 my-4"
            inputId="members-search"
            valueChanged={onSearch}
          />
        )}
        {children}
        <UserList
          {...userListProps}
          users={users}
          scrollingProps={otherScrollingProps}
          placeholderAmount={placeholderAmount}
          userInfoProps={{
            scrollingContainer: container.current,
            appendTooltipTo: modalRef,
            origin,
            showFollow,
            showAward,
            showSubscribe,
          }}
        />
      </Modal.Body>
    </Modal>
  );
}

export default UserListModal;
