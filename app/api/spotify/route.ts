import { NextResponse } from 'next/server';

const LASTFM_USERNAME = 'ghatak10';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export async function GET() {
  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`,
      { cache: 'no-store' }
    );

    const data = await res.json();
    const track = data.recenttracks?.track?.[0];

    if (!track) {
      return NextResponse.json({ isPlaying: false });
    }

    const isPlaying = track['@attr']?.nowplaying === 'true';
    const image =
      track.image?.[3]?.['#text'] ||
      track.image?.[2]?.['#text'] ||
      track.image?.[1]?.['#text'] ||
      '';

    return NextResponse.json({
      isPlaying,
      title: track.name,
      artist: track.artist['#text'],
      album: track.album['#text'],
      coverImage: image,
      songUrl: track.url,
    });
  } catch (error) {
    return NextResponse.json({ isPlaying: false });
  }
}