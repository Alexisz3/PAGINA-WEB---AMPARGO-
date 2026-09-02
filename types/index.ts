import { ReactNode } from "react";

export type PageProps<T extends string = ""> = {
  params: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  children?: ReactNode;
};
