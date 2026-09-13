import { Link, useRouter } from "@tanstack/react-router";

export const BackButton = () => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (router.history.length > 1) {
      e.preventDefault();
      router.history.back();
    }
  };

  return (
    <Link
      aria-label="Go back to the home page"
      className="text-sm underline"
      onClick={handleClick}
      to="/"
    >
      Back
    </Link>
  );
};
