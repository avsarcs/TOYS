const Force404: React.FC = () => {
  throw new Response("Not Found", {
    status: 404,
    statusText: "404 Not Found"
  });

  return <></>
}

export default Force404;