import ClientPage from "./clientPage";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <ClientPage gameId={`${id}`} />;
}
