export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  date: string;
}

export const videos: Video[] = [
  {
    id: "1",
    title: "【gakushi】生成AIで仕事に使えるプログラムをつくろう",
    description: "6月22日実施のAIプログラミング講座",
    url: "https://youtu.be/BT_zrgSH-FU",
    thumbnailUrl: "https://img.youtube.com/vi/BT_zrgSH-FU/maxresdefault.jpg",
    category: "Programming",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "【gakushi】非エンジニアが4週間でサブスクwebアプリをローンチする方法",
    description: "webアプリ開発のステップバイステップガイド",
    url: "https://youtu.be/nnZJqvu9-Cw",
    thumbnailUrl: "https://img.youtube.com/vi/nnZJqvu9-Cw/maxresdefault.jpg",
    category: "Programming",
    date: "2024-01-16",
  },
  {
    id: "3",
    title: "Introduction to React",
    description: "Learn the basics of React in this comprehensive tutorial",
    url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    thumbnailUrl: "https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg",
    category: "Programming",
    date: "2024-01-15",
  },
  {
    id: "4",
    title: "Web Development Full Course",
    description: "Complete web development bootcamp from scratch",
    url: "https://www.youtube.com/watch?v=Q33KBiDriJY",
    thumbnailUrl: "https://img.youtube.com/vi/Q33KBiDriJY/maxresdefault.jpg",
    category: "Programming",
    date: "2024-01-10",
  },
  {
    id: "5",
    title: "Cooking Basics",
    description: "Learn essential cooking techniques",
    url: "https://www.youtube.com/watch?v=1Gs8m6HCqZw",
    thumbnailUrl: "https://img.youtube.com/vi/1Gs8m6HCqZw/maxresdefault.jpg",
    category: "Cooking",
    date: "2024-01-05",
  },
];

export const categories = [...new Set(videos.map((video) => video.category))];