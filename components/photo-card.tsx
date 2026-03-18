import Image from "next/image";

import type { Photo } from "@/lib/types";

const aspectRatioClassName = {
  portrait: "photoCardMedia portrait",
  landscape: "photoCardMedia landscape",
  square: "photoCardMedia square",
};

type PhotoCardProps = {
  photo: Photo;
  priority?: boolean;
};

export function PhotoCard({ photo, priority = false }: PhotoCardProps) {
  const imageClassName = aspectRatioClassName[photo.aspectRatio];

  return (
    <article className="photoCard">
      <div className={imageClassName}>
        {photo.imageUrl ? (
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            priority={priority}
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="photoImage"
          />
        ) : (
          <div className="photoPlaceholder" aria-hidden="true">
            <span>{photo.series}</span>
            <strong>{photo.title}</strong>
          </div>
        )}
      </div>

      <div className="photoCardBody">
        <div className="photoCardMeta">
          <span>{photo.location}</span>
          <span>{new Date(photo.shotOn).getFullYear()}</span>
        </div>
        <h3>{photo.title}</h3>
        <p>{photo.description}</p>
        <div className="photoCardFooter">
          <span>{photo.camera}</span>
          <span>{photo.lens}</span>
        </div>
      </div>
    </article>
  );
}
