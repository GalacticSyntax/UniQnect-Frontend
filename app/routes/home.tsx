import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const Home = () => {
  return <Welcome />;
};

export default Home;
