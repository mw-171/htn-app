// types.ts

// Define TEventType and TPermission types if not already defined
type TEventType = "workshop" | "activity" | "tech_talk";
type TPermission = "public" | "private";

// Define TSpeaker type if not already defined
export type TSpeaker = {
  name: string;
};

// Define TEvent type
export type TEvent = {
  id: number;
  name: string;
  event_type: TEventType;
  permission?: TPermission;

  start_time: number; // Unix timestamp (ms)
  end_time: number; // Unix timestamp (ms)

  description?: string;
  speakers: TSpeaker[];
  public_url?: string;
  private_url: string;
  related_events: number[];
};