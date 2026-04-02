import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconProvider } from '@editora/react-icons';
import { Box, Grid } from '@editora/ui-react';

import {
  LogoAirbnbIcon,
  LogoAmazonIcon,
  LogoAppleIcon,
  LogoAwsIcon,
  LogoAzureIcon,
  LogoBitbucketIcon,
  LogoCloudflareIcon,
  LogoDiscordIcon,
  LogoDockerIcon,
  LogoDoordashIcon,
  LogoFacebookIcon,
  LogoFigmaIcon,
  LogoFirebaseIcon,
  LogoGithubIcon,
  LogoGitlabIcon,
  LogoGoogleDriveIcon,
  LogoGoogleIcon,
  LogoGoogleMapsIcon,
  LogoGooglePlayIcon,
  LogoHeadphonesIcon,
  LogoInstagramIcon,
  LogoKubernetesIcon,
  LogoLinkedinIcon,
  LogoLyftIcon,
  LogoMapPinIcon,
  LogoMessageCircleIcon,
  LogoMessageSquareIcon,
  LogoMessengerIcon,
  LogoMicrosoftIcon,
  LogoMusicIcon,
  LogoNetlifyIcon,
  LogoNetflixIcon,
  LogoNpmIcon,
  LogoOpenaiIcon,
  LogoPaypalIcon,
  LogoPinterestIcon,
  LogoPodcastIcon,
  LogoRedditIcon,
  LogoSendIcon,
  LogoSignalIcon,
  LogoShopifyIcon,
  LogoSkypeIcon,
  LogoSlackIcon,
  LogoSnapchatIcon,
  LogoSpotifyIcon,
  LogoStripeIcon,
  LogoTelegramIcon,
  LogoThreadsIcon,
  LogoTiktokIcon,
  LogoTwitterIcon,
  LogoUberIcon,
  LogoVercelIcon,
  LogoViberIcon,
  LogoWhatsappIcon,
  LogoYoutubeIcon,
  LogoZoomIcon,
  LogoDigitaloceanIcon,
} from '@editora/react-icons';

const meta: Meta<typeof Box> = {
  title: 'Icons/React Icons Logos',
  component: Box,
};

export default meta;
type Story = StoryObj<typeof meta>;

type LogoItem = {
  name: string;
  category: string;
  Icon: React.ComponentType;
};

type LogoSection = {
  title: string;
  columns?: number;
  items: LogoItem[];
};

const developerToolsSection: LogoSection = {
  title: 'Developer Tools',
  columns: 6,
  items: [
    { Icon: LogoGithubIcon, name: 'GitHub', category: 'Dev' },
    { Icon: LogoGitlabIcon, name: 'GitLab', category: 'Dev' },
    { Icon: LogoBitbucketIcon, name: 'Bitbucket', category: 'Dev' },
    { Icon: LogoFigmaIcon, name: 'Figma', category: 'Design' },
    { Icon: LogoSlackIcon, name: 'Slack', category: 'Communication' },
    { Icon: LogoDiscordIcon, name: 'Discord', category: 'Communication' },
    { Icon: LogoNpmIcon, name: 'npm', category: 'Package' },
    { Icon: LogoDockerIcon, name: 'Docker', category: 'DevOps' },
    { Icon: LogoKubernetesIcon, name: 'Kubernetes', category: 'DevOps' },
    { Icon: LogoOpenaiIcon, name: 'OpenAI', category: 'AI' },
  ],
};

const socialMediaSection: LogoSection = {
  title: 'Social & Content',
  columns: 6,
  items: [
    { Icon: LogoInstagramIcon, name: 'Instagram', category: 'Social' },
    { Icon: LogoFacebookIcon, name: 'Facebook', category: 'Social' },
    { Icon: LogoTwitterIcon, name: 'Twitter', category: 'Social' },
    { Icon: LogoWhatsappIcon, name: 'WhatsApp', category: 'Social' },
    { Icon: LogoTelegramIcon, name: 'Telegram', category: 'Social' },
    { Icon: LogoTiktokIcon, name: 'TikTok', category: 'Social' },
    { Icon: LogoPinterestIcon, name: 'Pinterest', category: 'Social' },
    { Icon: LogoRedditIcon, name: 'Reddit', category: 'Social' },
    { Icon: LogoSnapchatIcon, name: 'Snapchat', category: 'Social' },
    { Icon: LogoThreadsIcon, name: 'Threads', category: 'Social' },
    { Icon: LogoMessengerIcon, name: 'Messenger', category: 'Social' },
    { Icon: LogoSignalIcon, name: 'Signal', category: 'Social' },
    { Icon: LogoViberIcon, name: 'Viber', category: 'Social' },
    { Icon: LogoLinkedinIcon, name: 'LinkedIn', category: 'Social' },
    { Icon: LogoYoutubeIcon, name: 'YouTube', category: 'Video' },
  ],
};

const techAndCloudSection: LogoSection = {
  title: 'Tech & Cloud',
  columns: 6,
  items: [
    { Icon: LogoGoogleIcon, name: 'Google', category: 'Tech' },
    { Icon: LogoGoogleDriveIcon, name: 'Google Drive', category: 'Tech' },
    { Icon: LogoGoogleMapsIcon, name: 'Google Maps', category: 'Tech' },
    { Icon: LogoGooglePlayIcon, name: 'Google Play', category: 'Tech' },
    { Icon: LogoAppleIcon, name: 'Apple', category: 'Tech' },
    { Icon: LogoMicrosoftIcon, name: 'Microsoft', category: 'Tech' },
    { Icon: LogoAmazonIcon, name: 'Amazon', category: 'Tech' },
    { Icon: LogoNetflixIcon, name: 'Netflix', category: 'Tech' },
    { Icon: LogoSpotifyIcon, name: 'Spotify', category: 'Tech' },
    { Icon: LogoStripeIcon, name: 'Stripe', category: 'Tech' },
    { Icon: LogoPaypalIcon, name: 'PayPal', category: 'Tech' },
    { Icon: LogoAwsIcon, name: 'AWS', category: 'Cloud' },
    { Icon: LogoAzureIcon, name: 'Azure', category: 'Cloud' },
    { Icon: LogoFirebaseIcon, name: 'Firebase', category: 'Cloud' },
    { Icon: LogoVercelIcon, name: 'Vercel', category: 'Cloud' },
    { Icon: LogoNetlifyIcon, name: 'Netlify', category: 'Cloud' },
    { Icon: LogoDigitaloceanIcon, name: 'DigitalOcean', category: 'Cloud' },
    { Icon: LogoCloudflareIcon, name: 'Cloudflare', category: 'Cloud' },
  ],
};

const communicationSection: LogoSection = {
  title: 'Communication & Video',
  columns: 5,
  items: [
    { Icon: LogoZoomIcon, name: 'Zoom', category: 'Video' },
    { Icon: LogoSkypeIcon, name: 'Skype', category: 'Video' },
    { Icon: LogoMessageCircleIcon, name: 'Message Circle', category: 'Messaging' },
    { Icon: LogoMessageSquareIcon, name: 'Message Square', category: 'Messaging' },
    { Icon: LogoSendIcon, name: 'Send', category: 'Messaging' },
  ],
};

const foodAndDeliverySection: LogoSection = {
  title: 'Food & Delivery',
  columns: 5,
  items: [
    { Icon: LogoUberIcon, name: 'Uber', category: 'Delivery' },
    { Icon: LogoLyftIcon, name: 'Lyft', category: 'Delivery' },
    { Icon: LogoDoordashIcon, name: 'DoorDash', category: 'Delivery' },
    { Icon: LogoAirbnbIcon, name: 'Airbnb', category: 'Travel' },
    { Icon: LogoShopifyIcon, name: 'Shopify', category: 'E-commerce' },
  ],
};

const musicAndAudioSection: LogoSection = {
  title: 'Music & Audio',
  columns: 4,
  items: [
    { Icon: LogoMusicIcon, name: 'Music', category: 'Audio' },
    { Icon: LogoHeadphonesIcon, name: 'Headphones', category: 'Audio' },
    { Icon: LogoPodcastIcon, name: 'Podcast', category: 'Audio' },
  ],
};

const mapsAndLocationSection: LogoSection = {
  title: 'Maps & Location',
  columns: 4,
  items: [{ Icon: LogoMapPinIcon, name: 'Map Pin', category: 'Location' }],
};

const allLogoSections: LogoSection[] = [
  developerToolsSection,
  socialMediaSection,
  techAndCloudSection,
  communicationSection,
  foodAndDeliverySection,
  musicAndAudioSection,
  mapsAndLocationSection,
];

const allLogoCount = allLogoSections.reduce(
  (total, section) => total + section.items.length,
  0,
);

const canvasStyle: React.CSSProperties = { padding: 24 };

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: '#0f172a',
  marginBottom: 16,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: 16,
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.96))',
  minWidth: 100,
};

const iconFrameStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0f172a',
  overflow: 'visible',
};

function formatSectionTitle(section: LogoSection): string {
  return `${section.title} (${section.items.length})`;
}

function LogoCard({ Icon, name, category }: LogoItem): React.ReactElement {
  return (
    <Box style={cardStyle}>
      <Box style={iconFrameStyle}>
        <Icon />
      </Box>
      <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center' }}>{name}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>
        {category}
      </div>
    </Box>
  );
}

function IconGridSection({ section }: { section: LogoSection }): React.ReactElement {
  return (
    <Box style={{ marginBottom: 32 }}>
      <div style={sectionTitleStyle}>{formatSectionTitle(section)}</div>
      <Grid columns={`repeat(${section.columns ?? 4}, minmax(100px, 1fr))`} gap="12px">
        {section.items.map((item) => (
          <LogoCard
            key={`${section.title}-${item.name}`}
            Icon={item.Icon}
            name={item.name}
            category={item.category}
          />
        ))}
      </Grid>
    </Box>
  );
}

function renderStory(sections: LogoSection[], heading?: string): React.ReactElement {
  return (
    <IconProvider value={{ size: 24, strokeWidth: 1.5 }}>
      <Box style={canvasStyle}>
        {heading ? (
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
            {heading}
          </div>
        ) : null}
        {sections.map((section) => (
          <IconGridSection key={section.title} section={section} />
        ))}
      </Box>
    </IconProvider>
  );
}

export const DeveloperToolsLogos: Story = {
  render: () => renderStory([developerToolsSection]),
};

export const SocialMediaLogos: Story = {
  render: () => renderStory([socialMediaSection]),
};

export const TechAndCloudLogos: Story = {
  render: () => renderStory([techAndCloudSection]),
};

export const CommunicationAndVideo: Story = {
  render: () => renderStory([communicationSection]),
};

export const FoodDelivery: Story = {
  render: () => renderStory([foodAndDeliverySection]),
};

export const MusicAndAudio: Story = {
  render: () => renderStory([musicAndAudioSection]),
};

export const MapsAndLocation: Story = {
  render: () => renderStory([mapsAndLocationSection]),
};

export const AllLogosGrid: Story = {
  render: () => renderStory(allLogoSections, `All Logo Icons (${allLogoCount} icons)`),
};

AllLogosGrid.parameters = {
  docs: {
    description: {
      story: `Complete catalog of all ${allLogoCount} logo icons across developer tools, social platforms, tech brands, cloud services, communication apps, food delivery, audio, and location.`,
    },
  },
};
