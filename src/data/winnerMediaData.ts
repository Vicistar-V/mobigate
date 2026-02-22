// Mock gallery and video data for quiz winners

export interface GalleryFolder {
  id: string;
  name: string;
  coverUrl: string;
  items: GalleryMediaItem[];
}

export interface GalleryMediaItem {
  id: string;
  url: string;
  thumbnail?: string;
  caption?: string;
  date?: string;
}

export interface VideoFolder {
  id: string;
  name: string;
  coverUrl: string;
  items: VideoHighlightItem[];
}

export interface VideoHighlightItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  duration: string;
  views: number;
  date?: string;
}

// Generate gallery folders per winner
export function getWinnerGalleryFolders(winnerId: string): GalleryFolder[] {
  return [
    {
      id: `${winnerId}-quiz-moments`,
      name: "Quiz Moments",
      coverUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop",
      items: [
        { id: "g1", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop", caption: "Winning moment 🏆", date: "Jun 2025" },
        { id: "g2", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop", caption: "Team celebration", date: "Jun 2025" },
        { id: "g3", url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop", caption: "On stage", date: "Jun 2025" },
        { id: "g4", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop", caption: "With the crew", date: "Jun 2025" },
        { id: "g5", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop", caption: "Backstage prep", date: "Jun 2025" },
        { id: "g6", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop", caption: "Fan meetup", date: "Jun 2025" },
      ],
    },
    {
      id: `${winnerId}-trophy-pics`,
      name: "Trophy & Awards",
      coverUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=400&fit=crop",
      items: [
        { id: "t1", url: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop", caption: "The trophy 🥇", date: "Jul 2025" },
        { id: "t2", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop", caption: "Award ceremony", date: "Jul 2025" },
        { id: "t3", url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop", caption: "Press conference", date: "Jul 2025" },
      ],
    },
    {
      id: `${winnerId}-personal`,
      name: "Personal",
      coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop",
      items: [
        { id: "p1", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop", caption: "Chilling 😎", date: "May 2025" },
        { id: "p2", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop", caption: "At the studio", date: "May 2025" },
        { id: "p3", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop", caption: "Weekend vibes", date: "Apr 2025" },
        { id: "p4", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop", caption: "With friends", date: "Apr 2025" },
      ],
    },
  ];
}

export function getWinnerVideoFolders(winnerId: string): VideoFolder[] {
  return [
    {
      id: `${winnerId}-highlights`,
      name: "Game Highlights",
      coverUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
      items: [
        { id: "v1", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop", title: "Final Round Highlights", duration: "2:45", views: 12400, date: "Jun 2025" },
        { id: "v2", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop", title: "Best Answers Compilation", duration: "3:12", views: 8900, date: "Jun 2025" },
        { id: "v3", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop", title: "Winning Streak", duration: "1:58", views: 15200, date: "Jun 2025" },
      ],
    },
    {
      id: `${winnerId}-interviews`,
      name: "Interviews",
      coverUrl: "https://images.unsplash.com/photo-1587825140708-dfaf18c4c06a?w=400&h=400&fit=crop",
      items: [
        { id: "v4", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailUrl: "https://images.unsplash.com/photo-1587825140708-dfaf18c4c06a?w=400&h=300&fit=crop", title: "Post-Win Interview", duration: "5:30", views: 6700, date: "Jul 2025" },
        { id: "v5", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop", title: "TV Feature Appearance", duration: "8:15", views: 23100, date: "Jul 2025" },
      ],
    },
    {
      id: `${winnerId}-fan-content`,
      name: "Fan Content",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      items: [
        { id: "v6", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", title: "Fan Reactions Montage", duration: "4:02", views: 18500, date: "Jun 2025" },
        { id: "v7", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop", title: "Community Celebration", duration: "2:20", views: 9400, date: "Jun 2025" },
      ],
    },
  ];
}
