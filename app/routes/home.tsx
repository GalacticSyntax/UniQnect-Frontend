import { cn } from "~/lib/utils";
import type { Route } from "./+types/home";
import { InteractiveGridPattern } from "~/components/ui/interactive-grid-pattern";
import { InteractiveHoverButton } from "~/components/ui/interactive-hover-button";
import { Link } from "react-router";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const Home = () => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 z-10 text-center px-5 py-3">
        <h1 className="text-3xl sm:text-6xl font-black text-black dark:text-white">
          Welcome to UniQnect
        </h1>
        <p className="text-gray-700">
          Welcome to UniQnect, the platform designed to streamline academic and
          administrative tasks at North East University. Whether you're a
          student, teacher, or staff member, UniQnect makes it easy to manage
          results, courses, and university resources. Access everything you need
          in one place with a user-friendly dashboard and real-time updates.
        </p>

        <Link to="/dashboard">
          <InteractiveHoverButton>
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight dark:from-white dark:to-slate-900/10 lg:text-lg">
              Enter Dashboard
            </span>
          </InteractiveHoverButton>
        </Link>
      </div>
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
        )}
        width={20}
        height={20}
        squares={[80, 80]}
        squaresClassName="hover:fill-blue-500"
      />
    </div>
  );
};

export default Home;
