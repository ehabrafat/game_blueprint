import { CONFIGRATION_NAME, gameLift } from "@/lib/aws";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { players, ticketId } = await req.json();

  gameLift.startMatchmaking(
    {
      ConfigurationName: CONFIGRATION_NAME,
      TicketId: ticketId,
      Players: players,
    },
    (error, result) => {
      if (error) console.error(error);
      return console.log(result);
    }
  );
  return NextResponse.json("ok", { status: 200 });
}
