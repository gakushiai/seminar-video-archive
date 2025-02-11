import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Video } from "@/data/videos";
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCSV(videos: Video[]): string {
  const headers = ["id", "title", "description", "url", "category", "tags", "date", "thumbnailUrl"];
  const csvRows = [headers];

  videos.forEach(video => {
    csvRows.push([
      video.id,
      `"${video.title.replace(/"/g, '""')}"`,
      `"${video.description.replace(/"/g, '""')}"`,
      video.url,
      video.category,
      `"${video.tags.join(',')}"`,
      video.date,
      video.thumbnailUrl
    ]);
  });

  return csvRows.map(row => row.join(",")).join("\n");
}

export function parseCSV(csvText: string): Partial<Video>[] {
  const rows = csvText.split("\n").map(row => {
    const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    return matches.map(value => value.replace(/^"(.*)"$/, "$1").replace(/""/g, '"'));
  });

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const video: Partial<Video> = {};
    headers.forEach((header, index) => {
      if (header === "tags") {
        video[header] = row[index] ? row[index].split(",").map(tag => tag.trim()) : [];
      } else {
        video[header] = row[index];
      }
    });
    return video;
  });
}

export function exportToXLSX(videos: Video[]): Blob {
  // データを整形
  const data = videos.map(video => ({
    ID: video.id,
    タイトル: video.title,
    説明: video.description,
    URL: video.url,
    カテゴリー: video.category,
    タグ: video.tags.join(', '),
    公開日: video.date,
    サムネイルURL: video.thumbnailUrl
  }));

  // ワークブックを作成
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // 列幅の設定
  const colWidths = [
    { wch: 10 },  // ID
    { wch: 40 },  // タイトル
    { wch: 50 },  // 説明
    { wch: 40 },  // URL
    { wch: 20 },  // カテゴリー
    { wch: 30 },  // タグ
    { wch: 15 },  // 公開日
    { wch: 50 },  // サムネイルURL
  ];
  ws['!cols'] = colWidths;

  // ワークシートをワークブックに追加
  XLSX.utils.book_append_sheet(wb, ws, "動画一覧");

  // BLOBとして出力
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function getYouTubeThumbnailUrl(
  videoId: string,
  type: 'video' | 'playlist' | 'live',
  firstVideoId: string | null = null
): string {
  // 動画IDから余分な文字を削除
  const cleanVideoId = videoId.replace(/^v=/, '');
  
  switch (type) {
    case 'video':
    case 'live':
      // 通常の動画とライブ配信は maxresdefault を試し、失敗したら hqdefault を使用
      return `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`;
    case 'playlist':
      // プレイリストの場合、firstVideoIdがある場合はその動画のサムネイルを使用
      if (firstVideoId) {
        const cleanFirstVideoId = firstVideoId.replace(/^v=/, '');
        return `https://img.youtube.com/vi/${cleanFirstVideoId}/hqdefault.jpg`;
      }
      // プレイリスト用のデフォルトアイコン
      return '/assets/playlist-default.svg';
    default:
      return '';
  }
}

export function parseYouTubeUrl(url: string): { videoId: string | null; type: 'video' | 'playlist' | 'live' | null; firstVideoId: string | null } {
  try {
    const urlObj = new URL(url);
    
    // youtu.be形式のURLを処理
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      return {
        videoId,
        type: 'video',
        firstVideoId: videoId
      };
    }

    // www.youtube.com形式のURLを処理
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      // 通常の動画
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return {
          videoId,
          type: 'video',
          firstVideoId: videoId
        };
      }

      // プレイリスト
      const playlistId = urlObj.searchParams.get('list');
      if (playlistId) {
        // プレイリストの場合、最初の動画のIDも取得（あれば）
        const firstVideoId = urlObj.searchParams.get('v');
        return {
          videoId: playlistId,
          type: 'playlist',
          firstVideoId
        };
      }

      // ライブ配信
      if (urlObj.pathname.includes('/live/')) {
        const liveId = urlObj.pathname.split('/live/')[1].split('?')[0];
        return {
          videoId: liveId,
          type: 'live',
          firstVideoId: liveId
        };
      }
    }

    return {
      videoId: null,
      type: null,
      firstVideoId: null
    };
  } catch (error) {
    console.error('YouTube URL解析エラー:', error);
    return {
      videoId: null,
      type: null,
      firstVideoId: null
    };
  }
}
