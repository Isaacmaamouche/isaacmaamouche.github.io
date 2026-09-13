import type { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
};

export const Title = ({ children }: TitleProps) => {
  return <h1 className="text-2xl font-semibold">{children}</h1>;
};
