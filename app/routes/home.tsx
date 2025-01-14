import type { Route } from "./+types/home";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const Home = () => {
  return (
    <>
      <h1>Home</h1>
    </>
  );
};

export default Home;
