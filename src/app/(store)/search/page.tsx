import { Header } from "@/components/header";

export default async function Search() {

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <div>
      <Header />
      <h1>Search</h1>
    </div>
  );
}
