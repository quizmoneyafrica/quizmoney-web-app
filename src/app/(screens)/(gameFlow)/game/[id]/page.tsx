import ClientPage from "./clientPage";

function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <ClientPage gameId={params.id} />
    </>
  );
}

export default Page;
