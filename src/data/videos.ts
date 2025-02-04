export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  date: string;
}

export const videos: Video[] = [];

export let categories: string[] = [];

export const addCategory = (newCategory: string) => {
  if (!categories.includes(newCategory)) {
    categories = [...categories, newCategory];
  }
};

export const removeCategory = (categoryToRemove: string) => {
  // そのカテゴリーを使用している動画が存在するかチェック
  const isInUse = videos.some(video => video.category === categoryToRemove);
  if (isInUse) {
    throw new Error("このカテゴリーは使用中のため削除できません");
  }
  categories = categories.filter(category => category !== categoryToRemove);
};
