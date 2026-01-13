import styles from "./card_styles.module.css";

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
    <section className={styles.card}>
      <div className={styles.top}>
        <button type="button" className={styles.connectBtn} onClick={onConnect}>
          Connect
        </button>

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.photoImg} src={imageUrl} alt={`${name} profile`} />
        ) : (
          <div className={styles.photoPlaceholder} aria-label="Profile placeholder" />
        )}
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
