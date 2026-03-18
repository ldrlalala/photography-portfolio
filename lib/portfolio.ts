import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";
import type { Photo, PhotoAspectRatio, PhotoRow } from "@/lib/types";

const TABLE_NAME = "photos";

const samplePhotos: Photo[] = [
  {
    id: "sample-01",
    slug: "tidal-breath",
    title: "Tidal Breath",
    description: "黎明潮线退去前，海风把光切成了柔软的层次。",
    series: "Sea Quiet",
    location: "Pingtan, Fujian",
    shotOn: "2025-10-08",
    camera: "Leica SL2-S",
    lens: "50mm Summicron-SL",
    aspectRatio: "portrait",
    featured: true,
    tags: ["sea", "dawn", "minimal"],
  },
  {
    id: "sample-02",
    slug: "glass-city",
    title: "Glass City",
    description: "雨后的霓虹被玻璃幕墙拉长，像城市自己的倒影。",
    series: "After Rain",
    location: "Shanghai, China",
    shotOn: "2025-09-21",
    camera: "Fujifilm GFX100S",
    lens: "80mm F1.7",
    aspectRatio: "landscape",
    featured: true,
    tags: ["city", "rain", "night"],
  },
  {
    id: "sample-03",
    slug: "burnt-orange",
    title: "Burnt Orange",
    description: "午后最后一束暖光落在墙角，时间像是突然慢了下来。",
    series: "Rooms of Summer",
    location: "Hangzhou, China",
    shotOn: "2025-08-14",
    camera: "Contax 645",
    lens: "80mm Planar",
    aspectRatio: "square",
    featured: true,
    tags: ["interior", "light", "film"],
  },
  {
    id: "sample-04",
    slug: "cold-ridge",
    title: "Cold Ridge",
    description: "高海拔的空气把山体压成更干净的轮廓，沉默而锋利。",
    series: "Altitude",
    location: "Yunnan, China",
    shotOn: "2025-07-03",
    camera: "Sony A7R V",
    lens: "70-200mm GM II",
    aspectRatio: "landscape",
    featured: true,
    tags: ["mountain", "travel", "texture"],
  },
  {
    id: "sample-05",
    slug: "red-window",
    title: "Red Window",
    description: "旧建筑里的红色窗格像一块被时间保留下来的胶片。",
    series: "Quiet Walls",
    location: "Xiamen, China",
    shotOn: "2025-06-18",
    camera: "Nikon Zf",
    lens: "40mm F2",
    aspectRatio: "portrait",
    featured: false,
    tags: ["architecture", "detail", "warm"],
  },
  {
    id: "sample-06",
    slug: "fog-script",
    title: "Fog Script",
    description: "河面起雾时，桥与人都像只写到一半的句子。",
    series: "Morning Notes",
    location: "Suzhou, China",
    shotOn: "2025-05-30",
    camera: "Canon EOS R5",
    lens: "24-70mm F2.8",
    aspectRatio: "landscape",
    featured: false,
    tags: ["fog", "river", "story"],
  },
];

function normalizeAspectRatio(value: string | null | undefined): PhotoAspectRatio {
  if (value === "portrait" || value === "square" || value === "landscape") {
    return value;
  }

  return "landscape";
}

function getImageUrl(
  row: PhotoRow,
  client: SupabaseClient,
  bucket: string | undefined,
) {
  if (row.image_url) {
    return row.image_url;
  }

  if (!row.image_path || !bucket) {
    return undefined;
  }

  const { data } = client.storage.from(bucket).getPublicUrl(row.image_path);
  return data.publicUrl;
}

function mapPhotoRow(
  row: PhotoRow,
  client: SupabaseClient,
  bucket: string | undefined,
): Photo {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    series: row.series,
    location: row.location,
    shotOn: row.shot_on,
    camera: row.camera,
    lens: row.lens,
    aspectRatio: normalizeAspectRatio(row.aspect_ratio),
    featured: row.featured,
    tags: row.tags ?? [],
    imagePath: row.image_path ?? undefined,
    imageUrl: getImageUrl(row, client, bucket),
  };
}

export async function getPortfolioData() {
  const client = getSupabaseClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;

  if (!client) {
    return {
      photos: samplePhotos,
      dataSource: "sample" as const,
    };
  }

  const { data, error } = await client
    .from(TABLE_NAME)
    .select(
      "id, slug, title, description, series, location, shot_on, camera, lens, aspect_ratio, featured, image_url, image_path, tags",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("shot_on", { ascending: false });

  if (error || !data?.length) {
    return {
      photos: samplePhotos,
      dataSource: "sample" as const,
    };
  }

  return {
    photos: (data as PhotoRow[]).map((row) => mapPhotoRow(row, client, bucket)),
    dataSource: "supabase" as const,
  };
}

export function getSeriesSummary(photos: Photo[]) {
  return [...photos.reduce((seriesMap, photo) => {
    const current = seriesMap.get(photo.series);

    if (current) {
      current.count += 1;
      return seriesMap;
    }

    seriesMap.set(photo.series, {
      name: photo.series,
      count: 1,
    });

    return seriesMap;
  }, new Map<string, { name: string; count: number }>()).values()];
}
