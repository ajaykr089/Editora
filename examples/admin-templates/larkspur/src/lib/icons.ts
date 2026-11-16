// Only the icons Larkspur uses, registered up front: they draw at once and the full icon set is
// never downloaded. An icon name that is not registered here renders nothing, so add it here
// when you use a new one (the e2e test fails on a missing icon).
import { addIcons } from '@editora/ui-core/add-icons';
import {
  activityIcon, alertTriangleIcon, archiveIcon, arrowLeftIcon, arrowRightIcon, arrowUpRightIcon, bellIcon, boxIcon,
  briefcaseIcon, calendarIcon, cartIcon, chartBarIcon, chartLineIcon, chartPieIcon, checkCircleIcon, checkIcon,
  chevronDownIcon, chevronRightIcon, clockIcon, columnsIcon, copyIcon, creditCardIcon, dashboardIcon, downloadIcon,
  editIcon, externalLinkIcon, eyeIcon, fileTextIcon, filterIcon, globeIcon, helpCircleIcon, homeIcon, inboxIcon,
  infoIcon, invoiceIcon, keyIcon, layersIcon, layoutIcon, linkIcon, lockIcon, logoutIcon, mailIcon, mapPinIcon,
  menuIcon, messageSquareIcon, monitorIcon, moonIcon, moreHorizontalIcon, packageIcon, paletteIcon, paperclipIcon,
  pencilIcon, phoneIcon, plusIcon, printerIcon, receiptIcon, refreshCwIcon, replyIcon, rocketIcon, searchIcon,
  sendIcon, settingsIcon, shieldCheckIcon, shoppingBagIcon, smartphoneIcon, sparklesIcon, starIcon, storeIcon,
  sunIcon, tabletIcon, tagIcon, targetIcon, trashIcon, trendingDownIcon, trendingUpIcon, truckIcon, uploadIcon,
  userIcon, userPlusIcon, usersIcon, walletIcon, xIcon, bookIcon, appGridIcon,
} from '@editora/icons/glyphs';

addIcons(
  activityIcon, alertTriangleIcon, archiveIcon, arrowLeftIcon, arrowRightIcon, arrowUpRightIcon, bellIcon, boxIcon,
  briefcaseIcon, calendarIcon, cartIcon, chartBarIcon, chartLineIcon, chartPieIcon, checkCircleIcon, checkIcon,
  chevronDownIcon, chevronRightIcon, clockIcon, columnsIcon, copyIcon, creditCardIcon, dashboardIcon, downloadIcon,
  editIcon, externalLinkIcon, eyeIcon, fileTextIcon, filterIcon, globeIcon, helpCircleIcon, homeIcon, inboxIcon,
  infoIcon, invoiceIcon, keyIcon, layersIcon, layoutIcon, linkIcon, lockIcon, logoutIcon, mailIcon, mapPinIcon,
  menuIcon, messageSquareIcon, monitorIcon, moonIcon, moreHorizontalIcon, packageIcon, paletteIcon, paperclipIcon,
  pencilIcon, phoneIcon, plusIcon, printerIcon, receiptIcon, refreshCwIcon, replyIcon, rocketIcon, searchIcon,
  sendIcon, settingsIcon, shieldCheckIcon, shoppingBagIcon, smartphoneIcon, sparklesIcon, starIcon, storeIcon,
  sunIcon, tabletIcon, tagIcon, targetIcon, trashIcon, trendingDownIcon, trendingUpIcon, truckIcon, uploadIcon,
  userIcon, userPlusIcon, usersIcon, walletIcon, xIcon, bookIcon, appGridIcon,
);
