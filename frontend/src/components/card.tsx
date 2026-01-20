import styles from "./card_styles.module.css";
import Image from "next/image";

type CardProps = {
  name: string;
  occupation: string;
  gradYear: number;
  location: string;
  tags: string[];
  imageUrl?: string;
  onConnect?: () => void;
  onTagClick?: (tag: string) => void;
};

export default function Card({
  name,
  occupation,
  gradYear,
  location,
  tags,
  imageUrl,
  onConnect,
  onTagClick,
}: CardProps) {
  const shownTags = tags.slice(0, 3);

  return (
    <section className="relative box-border flex h-[330px] w-[395px] flex-col overflow-hidden rounded-[24px] border-2 border-[#774c3d] bg-[#fafaf5] pb-[10px]">
      <div className={styles.top}>
        <button type="button" className={styles.connectBtn} onClick={onConnect}>
          Connect
        </button>

        <Image
          src={imageUrl ?? "/profile_icon.png"}
          alt={`${name} profile`}
          fill
          className={styles.photoImg}
        />
      </div>

      {/* Alumni Info */}
      <div className={styles.bottom}>
        <div className={styles.left}>
          <p className={styles.name}>{name}</p>
          <p className={styles.occupation}>{occupation}</p>
        </div>

        <div className={styles.right}>
          <p className={styles.grad}>Class of {gradYear}</p>
          <p className={styles.location}>{location}</p>
        </div>
      </div>

      {/* TAGS */}
      <div className={styles.tags}>
        {shownTags.map((tag) => (
          <button
            key={tag}
            className={styles.tag}
            type="button"
            onClick={() => onTagClick?.(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
