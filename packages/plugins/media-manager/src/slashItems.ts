/**
 * Entries for the slash menu (`@editora/plugins` `SlashCommandsPlugin`), so that typing `/image` or `/video` opens
 * the media picker:
 *
 *   SlashCommandsPlugin({ items: mediaSlashItems })
 *
 * They are not in the slash menu's own defaults because they only work with the media manager loaded.
 */
export const mediaSlashItems = [
  {
    id: 'image',
    label: 'Image',
    description: 'Upload or choose an image',
    command: 'insertImage',
    keywords: ['picture', 'photo', 'img', 'upload'],
  },
  {
    id: 'audio',
    label: 'Audio',
    description: 'Upload or choose an audio file',
    command: 'insertAudio',
    keywords: ['sound', 'music', 'podcast', 'mp3'],
  },
  {
    id: 'video',
    label: 'Video',
    description: 'Upload or choose a video',
    command: 'insertVideo',
    keywords: ['movie', 'clip', 'mp4'],
  },
];
