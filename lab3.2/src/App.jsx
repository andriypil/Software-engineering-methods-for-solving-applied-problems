import { useState } from "react";
import Form from "./Form";
import Report from "./Report";

export default function App() {
  const [page, setPage] = useState("form");

  return (
    <>
      {page === "form" && <Form goReport={() => setPage("report")} />}
      {page === "report" && <Report goBack={() => setPage("form")} />}
    </>
  );
}