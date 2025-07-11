import * as actual from '@dailydotdev/shared/src/lib/boot';
import { Alerts } from '@dailydotdev/shared/src/graphql/alerts';
import { RemoteSettings } from '@dailydotdev/shared/src/graphql/settings';
import defaultUser from '@dailydotdev/shared/__tests__/fixture/loggedUser';

export enum BootApp {
  Extension = 'extension',
}

const defaultAlerts: Alerts = {
  filter: true,
  rankLastSeen: new Date(),
};

const defaultSettings: RemoteSettings = {
  theme: 'bright',
  openNewTab: false,
  spaciness: 'roomy',
  insaneMode: false,
  showTopSites: true,
  sidebarExpanded: true,
  companionExpanded: false,
  sortingEnabled: false,
  optOutReadingStreak: true,
  optOutCompanion: true,
  autoDismissNotifications: true,
  customLinks: [
    'http://custom1.com',
    'http://custom2.com',
    'http://custom3.com',
    'http://custom4.com',
    'http://custom5.com',
  ],
};

const defaultBootData: actual.BootCacheData = {
  alerts: defaultAlerts,
  user: defaultUser,
  settings: defaultSettings,
  squads: [],
  notifications: { unreadNotificationsCount: 0 },
  feeds: [],
  geo: { ip: '', region: '' },
};

export const getBootMock = (
  bootMock: actual.BootCacheData = defaultBootData,
): actual.Boot => ({
  ...bootMock,
  accessToken: { token: '1', expiresIn: '1' },
  visit: { sessionId: '1', visitId: '1' },
  feeds: [],
});

export async function getBootData() {
  return getBootMock();
}

export * from '@dailydotdev/shared/src/lib/boot';
