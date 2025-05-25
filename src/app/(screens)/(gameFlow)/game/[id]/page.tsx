import ClientPage from "./clientPage";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <ClientPage gameId={`${id}`} />;
}
