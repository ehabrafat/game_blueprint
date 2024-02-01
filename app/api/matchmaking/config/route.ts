import * as AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export const gameLift = new AWS.GameLift();

export const CONFIGRATION_NAME = "xsplashMatching";

export const TEAM_NAME = "cowboys";
