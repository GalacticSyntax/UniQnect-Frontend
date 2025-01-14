import type { Route } from "./+types/result";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const ResultPage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">Result Page</h1>
    </>
  );
};

export default ResultPage;
