export type UserProfile = Pick<
  Profile,
  "id" | "username" | "img_url" | "current_team" | "default_team"
>;


export type UserProfileWithTeamSize = UserProfile & {
  team_size: number
};

export type MessageWithSender = Pick<
  Message,
  "id" | "content" | "created_at"
> & {
  sender: Pick<Profile, "id" | "username" | "img_url">;
};


export type UserState = {
  userId: string;
};