type TitleProps = {
  text: string;
  subtitle?: string;
};

export default function Title({ text, subtitle }: TitleProps) {
  return (
    <div
      style={{
        width: "100%",
        containerType: "inline-size",
        marginBottom: 40,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          textAlign: "center",
          color: "#007A97",
          fontWeight: 700,
          fontSize: "clamp(2rem, 10cqw, 4rem)",
          lineHeight: 1.1,
        }}
      >
        {text}
      </h1>

      {subtitle && (
        <p
          style={{
            marginTop: 12,
            marginBottom: 0,
            color: "#8C766A",

            fontSize: "clamp(1rem, 3cqw, 1.2rem)",
            lineHeight: 1.6,
            fontWeight: 300,
            maxWidth: 600,
            marginInline: "auto",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
