type TitleProps = {
  text: string;
};

export default function Title({ text }: TitleProps) {
  return (
    <header
      style={{
        marginBottom: 16,
        width: "100%",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: 64,
          fontWeight: 700,
          margin: 0,
          justifyContent: "center",
          color: "#007A97",
        }}
      >
        {text}
      </h1>
    </header>
  );
}
