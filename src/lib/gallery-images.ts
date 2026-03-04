// Shared gallery images used across 8gent
// Used by: Photos app, Desktop screensaver

export const GALLERY_IMAGES = [
  { src: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/FB394334-6F13-446C-8B43-57C993D05E01.png', alt: '8gent Vision' },
  { src: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/0505D0AD-9EBF-4675-B3AC-ABF92501F024.png', alt: '8gent Workspace' },
  { src: '/photos/aurora.jpeg', alt: 'Aurora' },
  { src: '/photos/Corballis.jpeg', alt: 'Corballis' },
  { src: '/photos/Donabatebeach.jpeg', alt: 'Donabate Beach' },
  { src: '/photos/Donabatebeach2.jpeg', alt: 'Donabate Beach' },
  { src: '/photos/Glenofthedowns.jpeg', alt: 'Glen of the Downs' },
  { src: '/photos/Mistysunrise.jpeg', alt: 'Misty Sunrise' },
  { src: '/photos/Nightsky.jpeg', alt: 'Night Sky' },
  { src: '/photos/Nightskytree.jpeg', alt: 'Night Sky Tree' },
  { src: '/photos/Portranedemense.jpeg', alt: 'Portrane Demesne' },
  { src: '/photos/Robin.jpeg', alt: 'Robin' },
  { src: '/photos/Skygrange.jpeg', alt: 'Sky Grange' },
  { src: '/photos/Sunriseoverhowth.jpeg', alt: 'Sunrise over Howth' },
  { src: '/photos/Sunriseportrane.jpeg', alt: 'Sunrise Portrane' },
  { src: '/photos/sunsetachill.jpeg', alt: 'Sunset Achill' },
  { src: '/photos/SunsetPortrane.jpeg', alt: 'Sunset Portrane' },
  { src: '/photos/SunsetSalvador.jpeg', alt: 'Sunset Salvador' },
] as const;

export type GalleryImage = typeof GALLERY_IMAGES[number];
