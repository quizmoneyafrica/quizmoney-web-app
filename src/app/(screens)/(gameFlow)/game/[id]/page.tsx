import ClientPage from "./clientPage";
import { use } from "react";

export default function Page(
  paramsPromise: Promise<{ params: { id: string } }>
) {
  const { params } = use(paramsPromise);
  const { id } = params;

  return <ClientPage gameId={id} />;
}
