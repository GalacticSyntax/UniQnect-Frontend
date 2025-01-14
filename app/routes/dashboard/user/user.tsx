import type { Route } from "./+types/user";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const UserPage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">User Page</h1>
    </>
  );
};

export default UserPage;
