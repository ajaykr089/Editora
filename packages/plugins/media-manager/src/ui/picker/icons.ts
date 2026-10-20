const svg = (body: string, size = 18) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  library: svg('<rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="1.6"></circle><path d="m21 15-4.5-4.5L6 21"></path>'),
  upload: svg('<path d="M12 16V4"></path><path d="m7 9 5-5 5 5"></path><path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"></path>'),
  link: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>'),
  search: svg('<circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path>'),
  close: svg('<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"></path>', 14),
  play: svg('<path d="M8 5.5v13l11-6.5z" fill="currentColor"></path>', 16),
  trash: svg('<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="m6 6 1 14h10l1-14"></path>', 16),
  alert: svg('<circle cx="12" cy="12" r="9"></circle><path d="M12 8v5"></path><path d="M12 16.5v.01"></path>', 20),
  retry: svg('<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path>', 16),
  video: svg('<rect x="3" y="5" width="18" height="14" rx="3"></rect><path d="m10 9.5 4.5 2.5-4.5 2.5z" fill="currentColor"></path>', 28),
  photo: svg('<rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="1.6"></circle><path d="m21 15-4.5-4.5L6 21"></path>', 28),
};
