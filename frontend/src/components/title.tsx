

type TitleProps = {
  text: string;
};

export default function Title({ text }: TitleProps) {
  return (
    <header style={{ marginBottom: 16, width: 1040, height: 70}}>
      <h1 style={{ fontSize: 64, fontWeight: 700, margin: 0, justifyContent: 'center'}}>Alumni Directory</h1>
    </header>
  );
}
