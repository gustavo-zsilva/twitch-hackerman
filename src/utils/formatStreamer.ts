type Follower = {
  followed_at: Date,
  from_id: string,
  from_name: string,
  to_id: string,
}

type StreamerProps = {
  broadcaster_language: string,
  display_name: string,
  game_id: string,
  id: string,
  is_live: boolean,
  tags_ids: string[],
  thumbnail_url: string,
  title: string,
  started_at: Date,
  created_at: Date,
  view_count: number,
  email: string,
  followers: Follower[],
}

export function formatStreamer(streamer: StreamerProps) {
  return {
    language: streamer.broadcaster_language,
    name: streamer.display_name,
    gameId: streamer.game_id,
    id: streamer.id,
    isLive: streamer.is_live,
    tagsIds: streamer.tags_ids,
    thumbnailUrl: streamer.thumbnail_url,
    title: streamer.title,
    startedAt: streamer.started_at,
    createdAt: streamer.created_at,
    viewCount: streamer.view_count,
    email: streamer.email,
    followers: streamer.followers,
  }
}