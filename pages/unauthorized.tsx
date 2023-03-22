import React from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized Page">
      <>
        <h1>Access Denied</h1>
        {message ? <div className="mb-4 text-red-500">{message}</div> : ""}
      </>
    </Layout>
  );
}

export default Unauthorized;
