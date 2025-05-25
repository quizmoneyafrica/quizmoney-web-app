import ClientPage from "./clientPage";

export default async function Page({ params }: { params: { id: string } }) {
  return <ClientPage gameId={params.id} />;
}
