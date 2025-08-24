import { Podcast } from '@/types/content';

export const mockPodcasts: Podcast[] = [
  {
    id: '1',
    title: 'Frihedens Stemmer',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    description: 'Ugentlige samtaler om samfund, politik og kultur',
    category: 'Series',
    totalSeasons: 3,
    totalEpisodes: 45,
    audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    episodes: [
      {
        id: '1-1',
        title: 'Demokratiets udfordringer i 2024',
        description: 'En dybdegående diskussion om demokratiske processer',
        audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
        duration: 2400,
        publishedAt: '2024-01-15T12:00:00Z',
        seasonNumber: 3,
        episodeNumber: 5
      },
      {
        id: '1-2',
        title: 'Klimapolitik og fremtidens samfund',
        description: 'Hvordan klimaforandringer påvirker politiske beslutninger',
        audioUrl: 'https://file-examples.com/storage/fe68c8a7c4bb3b7c7277c83/2017/11/file_example_MP3_700KB.mp3',
        duration: 2700,
        publishedAt: '2024-01-08T12:00:00Z',
        seasonNumber: 3,
        episodeNumber: 4
      }
    ]
  },
  {
    id: '2',
    title: 'Kulturens Puls',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    description: 'Magasin om kunst, litteratur og kulturelle tendenser',
    category: 'Magasin',
    totalSeasons: 2,
    totalEpisodes: 28,
    audioUrl: 'https://file-examples.com/storage/fe68c8a7c4bb3b7c7277c83/2017/11/file_example_MP3_700KB.mp3',
    episodes: [
      {
        id: '2-1',
        title: 'Moderne kunst i Danmark',
        description: 'Samtale med kurator om nye kunstneriske udtryk',
        audioUrl: 'https://file-examples.com/storage/fe68c8a7c4bb3b7c7277c83/2017/11/file_example_MP3_700KB.mp3',
        duration: 1800,
        publishedAt: '2024-01-14T15:30:00Z',
        seasonNumber: 2,
        episodeNumber: 12
      },
      {
        id: '2-2',
        title: 'Litteraturens betydning i dag',
        description: 'Diskussion om moderne litteratur og dens samfundsrolle',
        audioUrl: 'https://sample-videos.com/zip/10/mp3/mp3-sample-1.mp3',
        duration: 2100,
        publishedAt: '2024-01-07T15:30:00Z',
        seasonNumber: 2,
        episodeNumber: 11
      }
    ]
  },
  {
    id: '3',
    title: 'Sandheden Bag',
    coverImage: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=400&fit=crop',
    description: 'Investigativ dokumentarserie om samfundets skjulte historier',
    category: 'Docuseries',
    totalSeasons: 1,
    totalEpisodes: 8,
    audioUrl: 'https://sample-videos.com/zip/10/mp3/mp3-sample-1.mp3',
    episodes: [
      {
        id: '3-1',
        title: 'Korruption i kommunerne - Del 1',
        description: 'Første del af undersøgelsen af kommunal korruption',
        audioUrl: 'https://sample-videos.com/zip/10/mp3/mp3-sample-1.mp3',
        duration: 3600,
        publishedAt: '2024-01-13T18:00:00Z',
        seasonNumber: 1,
        episodeNumber: 3
      },
      {
        id: '3-2',
        title: 'Korruption i kommunerne - Del 2',
        description: 'Anden del: Konsekvenserne af korruption for borgerne',
        audioUrl: 'https://sample-videos.com/zip/10/mp3/mp3-sample-2.mp3',
        duration: 3300,
        publishedAt: '2024-01-06T18:00:00Z',
        seasonNumber: 1,
        episodeNumber: 2
      }
    ]
  }
];