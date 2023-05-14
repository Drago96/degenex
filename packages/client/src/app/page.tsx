import Typography from "../components/typography";

export default async function Home() {
  await new Promise((res) => setTimeout(() => res(null), 50000));

  return <Typography>Welcome to Degenex!</Typography>;
}
