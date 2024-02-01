import { NextResponse } from "next/server";
import { CONFIGRATION_NAME, gameLift } from "../config/route";


export async function POST(req: Request) {
  const { players, ticketId } = await req.json();

  gameLift.startMatchmaking(
    {
      ConfigurationName: CONFIGRATION_NAME,
      TicketId: ticketId,
      Players: players,
    },
    (error, result) => {
      if (error) return NextResponse.json({ error: error.message });
      return NextResponse.json(result);
    }
  );
  return NextResponse.json("ok", { status: 200 });
}
