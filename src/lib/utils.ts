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
