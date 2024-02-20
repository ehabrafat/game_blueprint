import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import GameLift, {
  MatchmakingAcceptanceTimeoutInteger,
  StartMatchmakingOutput,
} from "aws-sdk/clients/gamelift";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // check for api key that you give to aws gamelift

  // after that here you sure that it's an aws event
  const event: MatchmakingEvent = await req.json();

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  if (event.detail.type === "MatchmakingSucceeded") {
    // send to database & client listen to it
    const players = event.detail.gameSessionInfo.players;
    const matchId = event.detail.matchId;
    const type = event.detail.type;
    for (const player of players) {
      const channel = supabase.channel(`user_${player.playerId}`);
      channel.subscribe((state) => {
        if (state != "SUBSCRIBED") return;
        channel.send({
          type: "broadcast",
          event: type,
          payload: {
            players,
            matchId,
          },
        });
      });
    }
    console.log(players);
  }
  return NextResponse.json("go");
}
