import { useParams } from "react-router-dom";

export function InfoPage() {
  const { id } = useParams<{ id: string }>();

  return <div>InfoPage: {id}</div>;
}
