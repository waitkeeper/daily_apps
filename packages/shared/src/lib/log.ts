import type { PurchaseType } from '../graphql/paddle';

export enum Origin {
  ShareBar = 'share bar',
  ReadingHistoryContextMenu = 'reading history context menu',
  ArticlePage = 'article page',
  ArticleModal = 'article modal',
  Companion = 'companion',
  Feed = 'feed',
  CommentFeed = 'comment feed',
  CustomFeed = 'custom feed',
  PostContextMenu = 'post context menu',
  PostCommentContextMenu = 'post comment context menu',
  TagsFilter = 'tags filter',
  TagsSearch = 'tags search',
  RealTime = 'realtime',
  NonRealTime = 'nonrealtime',
  ChangelogPopup = 'changelog popup',
  BlockedFilter = 'blocked filter',
  SourcePage = 'source page',
  TagPage = 'tag page',
  Profile = 'profile',
  PostTags = 'post tags',
  // squads - start
  NewSquadModal = 'new squad modal',
  SquadDirectory = 'squad directory',
  SquadCreation = 'squad creation',
  SquadPage = 'squad page',
  Auto = 'auto',
  Sidebar = 'sidebar',
  Share = 'share',
  Notification = 'notification',
  NotificationsPage = 'notifications page',
  Boot = 'boot',
  SquadMembersList = 'squad members list',
  SquadChecklist = 'squad checklist',
  SquadInvitation = 'squad invitation',
  // squads - end
  PostCommentButton = 'comment button',
  StartDiscussion = 'start discussion button',
  CompanionContextMenu = 'companion context menu',
  // search - start
  HomePage = 'home page',
  SearchPage = 'search page',
  HistoryPage = 'history page',
  HistoryTooltip = 'history tooltip',
  // search - end
  PostContent = 'post content',
  History = 'history',
  FeedbackCard = 'feedback card',
  InitializeRegistrationFlow = 'initialize registration flow',
  Onboarding = 'onboarding',
  ManageTag = 'manage_tag',
  EditTag = 'edit_tag',
  // Collection
  CollectionModal = 'collection modal',
  Settings = 'settings',
  WorkspaceDropdown = 'workspace dropdown',
  UserFollowingList = 'user following list',
  UserFollowersList = 'user followers list',
  UserUpvotesList = 'user upvotes list',
  FollowFilter = 'follow filter',
  PostSharedBy = 'post shared by',
  // Marketing
  InAppPromotion = 'in app promotion',
  Suggestions = 'suggestions',
  // Start Credits
  WalletPageCTA = 'wallet page cta',
  WalletPagePackage = 'wallet page package',
  Award = 'award',
  CoresPage = 'cores page',
  AwardsList = 'awards list',
  // End Credits
  ProfileMenu = 'profile menu',
  StreakRecover = 'streak recover',
}

export enum LogEvent {
  HidePost = 'hide post',
  ReportSquad = 'report squad',
  Click = 'click',
  CommentPost = 'comment post',
  Impression = 'impression',
  ManageTags = 'click manage tags',
  SearchTags = 'search tags',
  ClickOnboardingBack = 'click onboarding back',
  ClickOnboardingNext = 'click onboarding next',
  OnboardingSkip = 'my feed onboarding skip',
  GlobalError = 'global error',
  ClickArticleAnonymousCTA = 'click article anonymous cta',
  ClickScrollBlock = 'click scroll block',
  KeyboardShortcutTriggered = 'keyboard shortcut triggered',
  FeedEmpty = 'feed empty',
  // notifications - start
  ClickNotificationIcon = 'click notification icon',
  OpenNotificationList = 'open notification list',
  ClickNotification = 'click notification',
  ClickEnableNotification = 'click enable notification',
  ClickNotificationDismiss = 'click notification dismiss',
  EnableNotification = 'enable notification',
  DisableNotification = 'disable notification',
  ScheduleDigest = 'schedule digest',
  // notifications - end
  // squads - start
  ViewSquadInvitation = 'view squad invitation',
  ClickJoinSquad = 'click join squad',
  CompleteJoiningSquad = 'complete joining squad',
  DeleteSquad = 'delete squad',
  LeaveSquad = 'leave squad',
  ShareSquadInvitation = 'share squad invitation',
  ViewSquadPage = 'view squad page',
  ViewSquadForbiddenPage = 'view squad forbidden',
  CompleteSquadCreation = 'complete squad creation',
  StartShareToSquad = 'start share to squad',
  ShareToSquad = 'share to squad',
  ChecklistClose = 'checklist close',
  DeletePost = 'delete post',
  DeleteComment = 'delete comment',
  // squads - end
  EligibleScrollBlock = 'eligible scroll block',
  OpenComment = 'open comment modal',
  // vote - start
  UpvotePost = 'upvote post',
  RemovePostUpvote = 'remove post upvote',
  DownvotePost = 'downvote post',
  RemovePostDownvote = 'remove post downvote',
  ClickDismissFeedback = 'click dismiss feedback',
  UpvoteComment = 'upvote comment',
  RemoveCommentUpvote = 'remove comment upvote',
  DownvoteComment = 'downvote comment',
  RemoveCommentDownvote = 'remove comment downvote',
  // vote - end
  // moderation - start
  ApprovePost = 'approve post',
  RejectPost = 'reject post',
  // moderation - end
  // bookmark - start
  BookmarkPost = 'bookmark post',
  RemovePostBookmark = 'remove post bookmark',
  SetBookmarkReminder = 'set bookmark reminder',
  RemoveBookmarkReminder = 'remove bookmark reminder',
  MoveBookmarkToFolder = 'change bookmark folder',
  CreateBookmarkFolder = 'create bookmark folder',
  RenameBookmarkFolder = 'rename bookmark folder',
  DeleteBookmarkFolder = 'delete bookmark folder',
  // bookmark - end
  ReportComment = 'report comment',
  // search start
  FocusSearch = 'focus search',
  SubmitSearch = 'submit search',
  OpenSearchHistory = 'open search history',
  UpvoteSearch = 'upvote search',
  DownvoteSearch = 'downvote search',
  CopySearch = 'copy search',
  CopyKeyLink = 'copy key link',
  HideFromHeader = 'hide from header',
  CloseInvitationPopup = 'close invitation popup',
  ErrorSearch = 'error search',
  AcceptInvitation = 'accept invitation',
  DownloadExtension = 'download extension',
  DownloadApp = 'download app',
  SearchHighlightAnimation = 'highlight search',
  SwitchSearch = 'switch search',
  // search end
  RequestContentScripts = 'request content scripts',
  ApproveContentScripts = 'approve content scripts',
  DeclineContentScripts = 'decline content scripts',
  ToggleFeedPreview = 'toggle feed preview',
  CreateFeed = 'create feed',
  // Referral campaign
  CopyReferralLink = 'copy referral link',
  InviteReferral = 'invite referral',
  // Shortcuts
  RevokeShortcutAccess = 'revoke shortcut access',
  SaveShortcutAccess = 'save shortcut access',
  OpenShortcutConfig = 'open shortcut config',
  // Devcard
  ShareDevcard = 'share devcard',
  GenerateDevcard = 'generate devcard',
  DownloadDevcard = 'download devcard',
  CopyDevcardCode = 'copy devcard code',
  // Reading Streaks
  OpenStreaks = 'open streaks',
  DismissStreaksMilestone = 'dismiss streaks milestone',
  ScheduleStreakReminder = 'schedule streak reminder',
  StreakRecover = 'restore streak',
  DismissStreakRecover = 'dimiss streaks milestone',
  StreakTimezoneMismatch = 'streak timezone mismatch',
  // 404 page
  View404Page = '404 page',
  // Follow Actions - start
  Follow = 'follow',
  Unfollow = 'unfollow',
  Block = 'block',
  Unblock = 'unblock',
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
  // Follow Actions - end
  // Tags - start
  BlockTag = 'block',
  UnblockTag = 'unblock',
  // Tags - end
  // marketing CTA
  MarketingCtaDismiss = 'dismiss promotion',
  // Reading reminder
  ScheduleReadingReminder = 'schedule reading reminder',
  SkipReadingReminder = 'skip reading reminder',
  // custom feeds start
  StartCustomFeed = 'start custom feed',
  CreateCustomFeed = 'create custom feed',
  UpdateCustomFeed = 'update custom feed',
  DeleteCustomFeed = 'delete custom feed',
  // custom feeds end
  // Settings
  ChangeSettings = 'change settings',
  // End settings
  // Integrations
  StartAddingWorkspace = 'start adding workspace',
  StartAddingIntegration = 'start adding integration',
  ManageIntegration = 'manage integration',
  SetIntegration = 'set integration',
  RemoveIntegration = 'remove integration',
  RevokeIntegrationAccess = 'revoke integration access',
  // End integrations
  // Post snippets
  CopySnippet = 'copy snippet',
  NextSnippet = 'next snippet',
  PreviousSnippet = 'previous snippet',
  // End post snippets
  TopReaderModalClose = 'close badge',
  TopReaderBadgeDownload = 'download badge',
  // Plus subscription
  UpgradeSubscription = 'upgrade subscription',
  ManageSubscription = 'manage subscription',
  SelectBillingCycle = 'select billing cycle',
  SelectCheckoutPayment = 'select checkout payment',
  InitiateCheckout = 'initiate checkout',
  CompleteCheckout = 'complete checkout',
  WarningCheckout = 'warning checkout',
  ErrorCheckout = 'error checkout',
  InitiatePayment = 'initiate payment',
  ErrorPayment = 'error payment',
  HoverPlusFeature = 'hover plus feature',
  ClickPlusFeature = 'click plus feature',
  ClosePlusFeature = 'close plus feature',
  CancelSubscription = 'cancel subscription',
  ReceivePayment = 'receive payment',
  OnboardingSkipPlus = 'skip upgrade subscription',
  OnboardingUpgradePlus = 'upgrade subscription',
  GiftSubscription = 'gift subscription',
  CompleteGiftCheckout = 'complete gift checkout',
  ClickPlusFaq = 'click plus faq',
  HoverCheckoutWidget = 'hover checkout widget',
  PageScroll = 'page scroll',
  SelectSubscriptionType = 'select subscription type',
  SetOrgSize = 'set org size',
  // End Plus subscription
  // Clickbait Shield
  ToggleClickbaitShield = 'toggle clickbait shield',
  ClickbaitShieldTitle = 'clickbait shield title',
  // End Clickbait Shield
  InstallPWA = 'install pwa',
  // Start Share
  ShareProfile = 'share profile',
  ShareSource = 'share source',
  ShareTag = 'share tag',
  SharePost = 'share post',
  // End Share
  // Start Smart Prompts
  SmartPrompt = 'smart prompt',
  ToggleSmartPrompts = 'toggle smart prompts',
  // End Smart Prompts
  // Start Profile
  ProfileView = 'profile view',
  UpdateProfile = 'update profile',
  UpdateProfileImage = 'update profile image',
  // End Profile
  TranslatePost = 'translate post',
  // Start Credits
  StartBuyingCredits = 'start buying credits',
  SelectCreditsQuantity = 'select credits quantity',
  StartAwardUser = 'start award user',
  PickAwardUser = 'pick award user',
  AwardUser = 'award user',
  StartAwardPost = 'start award post',
  PickAwardPost = 'pick award post',
  AwardPost = 'award post',
  StartAwardComment = 'start award comment',
  PickAwardComment = 'pick award comment',
  AwardComment = 'award comment',
  StartAwardSquad = 'start award Squad',
  PickAwardSquad = 'pick award Squad',
  AwardSquad = 'award Squad',
  // End Credits
}

export enum TargetType {
  MyFeedModal = 'my feed modal',
  ArticleAnonymousCTA = 'article anonymous cta',
  EnableNotifications = 'enable notifications',
  OnboardingChecklist = 'onboarding checklist',
  LoginButton = 'login button',
  SignupButton = 'signup button',
  SquadJoinButton = 'squad join button',
  SearchRecommendation = 'search rec',
  SearchHistory = 'search history',
  SearchSource = 'search source',
  SearchInviteButton = 'search invite button',
  HideInviteCheckbox = 'hide invite mechanism',
  ReferralPopup = 'referral popup',
  InviteFriendsPage = 'invite friends page',
  ProfilePage = 'profile page',
  GenericReferralPopup = 'generic referral popup',
  Shortcuts = 'shortcuts',
  VerifyEmail = 'verify email',
  ResendVerificationCode = 'resend verification code',
  StreaksMilestone = 'streaks milestone',
  StreakRecover = 'streak restore',
  PromotionCard = 'promotion_card',
  MarketingCtaPopover = 'promotion_popover',
  MarketingCtaPopoverSmall = 'promotion_popover_small',
  MarketingCtaPlus = 'promotion_plus',
  PlusEntryCard = 'plus_entry_card',
  PlusEntryForYouTab = 'plus_entry_for_you_tab',
  PlusEntryBookmarkTab = 'plus_entry_bookmark_tab',
  PlusEntryAnnouncementBar = 'plus_entry_announcement_bar',
  Comment = 'comment',
  ReadingReminder = 'reading reminder',
  Source = 'source',
  // Settings
  Layout = 'layout',
  Theme = 'theme',
  Language = 'language',
  // End settings
  SocialLink = 'social link',
  Badge = 'badge',
  Plus = 'plus',
  // Browsers
  Chrome = 'chrome',
  Edge = 'edge',
  Credits = 'credits',
  List = 'list',
  Grid = 'grid',
}

export enum TargetId {
  On = 'on',
  Off = 'off',
  SearchReferralBadge = 'search referral badge',
  InviteBanner = 'invite banner',
  InviteProfileMenu = 'invite in profile menu',
  SearchActivation = 'search activation',
  // Referral campaign
  GenericReferralPopup = 'generic referral popup',
  ProfilePage = 'profile page',
  InviteFriendsPage = 'invite friends page',
  Squad = 'squad',
  General = 'general',
  OrganizationsPage = 'organizations page',
  // Settings
  Cards = 'cards',
  List = 'list',
  // End settings
  TopReader = 'top reader',
  Sidebar = 'sidebar',
  Header = 'header',
  ProfileDropdown = 'profile dropdown',
  Ads = 'ads',
  MyProfile = 'my profile',
  PlusBadge = 'plus badge',
  PlusPage = 'plus page',
  Onboarding = 'onboarding',
  BlockedWords = 'block words',
  CustomFeed = 'custom feed',
  BookmarkFolder = 'bookmark folder',
  FeedSettings = 'feed settings',
  ClickbaitShield = 'clickbait shield',
  StreakTimezoneLabel = 'streak timezone label',
  StreakTimezoneMismatchPrompt = 'streak timezone mismatch prompt',
  ContextMenu = 'context',
  SmartPrompt = 'smart prompt',
  Account = 'account',
}

export enum NotificationChannel {
  Email = 'email',
  Web = 'web',
}

export enum NotificationCategory {
  Marketing = 'marketing',
  Product = 'product',
  Digest = 'digest',
  ReadingReminder = 'reading reminder',
  StreakReminder = 'streak reminder',
  Following = 'following',
  Award = 'award',
}

export enum NotificationTarget {
  Header = 'header',
  Footer = 'footer',
  Icon = 'notifications icon',
}

export enum NotificationPromptSource {
  BookmarkReminder = 'bookmark reminder',
  NotificationsPage = 'notifications page',
  NewComment = 'new comment',
  NewSourceModal = 'new source modal',
  SquadPage = 'squad page',
  NotificationItem = 'notification item',
  SquadPostCommentary = 'squad post commentary',
  SquadPostModal = 'squad post modal',
  SquadChecklist = 'squad checklist',
  SourceSubscribe = 'source subscribe',
  ReadingReminder = 'reading reminder',
}

export enum ShortcutsSourceType {
  Custom = 'custom',
  Browser = 'browser',
  Placeholder = 'placeholder',
  Button = 'button',
}

export enum UserAcquisitionEvent {
  Dismiss = 'dismiss ua',
  Submit = 'choose ua',
}

export enum StreakTimezonePromptAction {
  Settings = 'settings',
  Ignore = 'ignore',
}

export const purchaseTypeToTargetType: Record<PurchaseType, TargetType> = {
  cores: TargetType.Credits,
  plus: TargetType.Plus,
  organization: TargetType.Plus,
};
