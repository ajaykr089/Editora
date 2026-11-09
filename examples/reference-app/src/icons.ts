// Only the icons Tallyhawk uses, registered up front: they draw at once and the full icon set
// (about 48 KB gzipped) is never downloaded. CI checks that (tests/flows.spec.ts).
import { addIcons } from '@editora/ui-core/add-icons';
import {
  arrowRightIcon,
  bellIcon,
  cameraIcon,
  chartPieIcon,
  checkCircleIcon,
  checkIcon,
  creditCardIcon,
  dashboardIcon,
  inboxIcon,
  moonIcon,
  plusIcon,
  receiptIcon,
  settingsIcon,
  shieldCheckIcon,
  sunIcon,
  usersIcon,
  walletIcon,
  workflowIcon,
} from '@editora/icons/glyphs';

addIcons(
  arrowRightIcon, bellIcon, cameraIcon, chartPieIcon, checkCircleIcon, checkIcon, creditCardIcon, dashboardIcon, inboxIcon,
  moonIcon, plusIcon, receiptIcon, settingsIcon, shieldCheckIcon, sunIcon, usersIcon, walletIcon, workflowIcon
);
