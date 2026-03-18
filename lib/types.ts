export type PhotoAspectRatio = "portrait" | "landscape" | "square";

export type Photo = {
  id: string;
  slug: string;
  title: string;
  description: string;
  series: string;
  location: string;
  shotOn: string;
  camera: string;
  lens: string;
  aspectRatio: PhotoAspectRatio;
  featured: boolean;
  tags: string[];
  imageUrl?: string;
  imagePath?: string;
};

export type PhotoRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  series: string;
  location: string;
  shot_on: string;
  camera: string;
  lens: string;
  aspect_ratio: string;
  featured: boolean;
  image_url: string | null;
  image_path: string | null;
  tags: string[] | null;
};

export type PortfolioDebugInfo = {
  hasSupabaseEnv: boolean;
  hasBucketEnv: boolean;
  bucket?: string;
  queryError?: string;
  fetchedRowCount: number;
  firstResolvedImageUrl?: string;
  firstImagePath?: string;
};
