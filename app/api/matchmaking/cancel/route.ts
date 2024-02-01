import { NextResponse } from "next/server";
import { gameLift } from "../config/route";

export async function POST(req: Request) {
  const { ticketId } = await req.json();
  gameLift.stopMatchmaking(
    {
      TicketId: ticketId,
    },
    (error, result) => {
      if (error) return console.error(error);
      return console.log(result);
    }
  );
  return NextResponse.json("ok", { status: 200 });
}
