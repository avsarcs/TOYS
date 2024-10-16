import { useRouteError } from "react-router-dom";

interface GenericError {
  status?: number,
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as GenericError;
  console.error(error);

  return (
    <div>
      <h1>{error.statusText || error.status}</h1>
      <h2>{error.message}</h2>
    </div>
  )
}