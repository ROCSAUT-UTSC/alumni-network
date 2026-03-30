type TitleProps = {
  text: string;
};

export default function Title({ text }: TitleProps) {
  return (
    <div
      style={{
        width: "100%",
        containerType: "inline-size", 
        marginBottom: 24,
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
    </div>
  );
}