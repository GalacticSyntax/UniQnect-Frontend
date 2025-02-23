import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import useModifyQueryParams from "~/hooks/use-modify-query-params";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";

const SearchWithUrlSync = ({ label = "Search" }: { label: string }) => {
  const [searchTerm, setSearcTerm] = useState("");
  let [serchParams, setSearchParams] = useSearchParams();
  const { modifyParams } = useModifyQueryParams();

  useEffect(() => {
    if (serchParams.get("searchTerm"))
      setSearcTerm(serchParams.get("searchTerm") ?? "");
    else setSearchParams(modifyParams("delete", "searchTerm"));
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUrl = modifyParams("set", "searchTerm", searchTerm);
    setSearchParams(updatedUrl);
  };

  const clearForm = () => {
    setSearcTerm("");
    const updatedUrl = modifyParams("delete", "searchTerm");
    setSearchParams(updatedUrl);
  };

  return (
    <form
      className="flex rounded-sm border pl-3 ml-auto"
      onSubmit={handleSubmit}
    >
      <input
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearcTerm(e.target.value)
        }
        className="outline-none bg-transparent w-full"
        placeholder={label}
      />
      <div className="size-9">
        {searchTerm && (
          <Button
            type="button"
            size={"icon"}
            variant={"ghost"}
            onClick={clearForm}
          >
            <X />
          </Button>
        )}
      </div>
      <Button className="flex-shrink-0 rounded-l-none border">
        <Search />
      </Button>
    </form>
  );
};

export default SearchWithUrlSync;
