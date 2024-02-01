import { NextResponse } from "next/server";
import { gameLift } from "../config/route";

export async function POST(req: Request) {
  const { ticketId } = await req.json();
  gameLift.describeMatchmaking(
    {
      TicketIds: [ticketId],
    },
    (error, result) => {
      if (error) console.error(error);
      console.log(result);
    }
  );

  return NextResponse.json("ok", { status: 200 });
}
