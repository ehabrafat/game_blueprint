import { NextResponse } from "next/server";
import { PlayFabMultiplayer, PlayFabClient, PlayFabServer } from "playfab-sdk";

export async function GET() {
  return new NextResponse("get success");
}

export async function POST(req: Request) {
  PlayFabServer.LoginWithServerCustomId({
    ServerCustomId: "68204774BFC2A5A",
    CreateAccount: false
  }, (e, r)=>{

  });



  /*PlayFabMultiplayer.CreateMatchmakingTicket(
    {
      Creator: {
        Entity: {
          Id: "1234",
        },
      },
      GiveUpAfterSeconds: 120,
      QueueName: "XSplash",
    },
    (error, result) => {
      if (error) console.log("error while creating match ", error);
      else console.log("match created ", result);
    }
  );*/
}
