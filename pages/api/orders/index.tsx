import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";
import React from "react";

const handler = async (req: any, res: any) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("signin required");
  }
  //   const { user } = session;
  await db.connect();
  const newOrder = new Order({
    ...req.body,
    user: session.user?._id,
  });
  console.log(newOrder);
  const order = await newOrder.save();
  res.status(201).send(order);
};

export default handler;
