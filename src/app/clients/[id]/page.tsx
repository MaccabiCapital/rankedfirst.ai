import ClientDetail from "./ClientDetail";

// For static export: generate a placeholder page that renders client-side
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function ClientDetailPage() {
  return <ClientDetail />;
}
