import { getSession } from "next-auth/react";

const handler = async (req: any, res: any) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("signin required");
  }
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
};
export default handler;
