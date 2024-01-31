import { Database } from "./types/database.types";

declare global {
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  type Team = Database['public']['Tables']['teams']['Row']
  type Message = Database["public"]["Tables"]["messages"]["Row"];
}
