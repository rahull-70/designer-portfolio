'use client';

import React, { useEffect, useState } from 'react';
import { AudioLinesIcon } from './audio-lines';

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  coverImage?: string;
  songUrl?: string;
}

interface MusicPlayerProps {
  iconSize?: number;
}

export default function MusicPlayer({ iconSize = 28 }: MusicPlayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyData>({
    isPlaying: false,
  });

  const [progressSeconds, setProgressSeconds] = useState(0);
  const totalDurationSeconds = 210;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify');
        const json = await res.json();

        setSpotifyData((prev) => {
          if (prev.title !== json.title) {
            setProgressSeconds(0);
          }
          return json;
        });
      } catch (err) {
        console.error('Failed to fetch Spotify status', err);
      }
    };

    fetchNowPlaying();
    interval = setInterval(fetchNowPlaying, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!spotifyData.isPlaying) return;

    const timer = setInterval(() => {
      setProgressSeconds((prev) =>
        prev >= totalDurationSeconds ? 0 : prev + 1,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [spotifyData.isPlaying]);

  const isPlaying = spotifyData.isPlaying;
  const coverImage =
    spotifyData.coverImage && spotifyData.coverImage.trim() !== ''
      ? spotifyData.coverImage
      : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const currentFormattedTime = isPlaying ? formatTime(progressSeconds) : '0:00';
  const durationFormattedTime = isPlaying
    ? formatTime(totalDurationSeconds)
    : '0:00';
  const progressPercent = isPlaying
    ? (progressSeconds / totalDurationSeconds) * 100
    : 0;

  return (
    <div
      className='relative flex flex-col items-end'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trigger Button */}
      <button
        type='button'
        aria-label='Toggle Music Status'
        className='p-2 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300 text-zinc-900 focus:outline-none'
      >
        <AudioLinesIcon size={iconSize} isPlaying={isPlaying} className='text-zinc-900' />
      </button>

      {/* Popover Container */}
      <div
        className={`absolute top-14 right-0 w-[240px] bg-[#E5E5E5] rounded-[36px] pb-6 px-5 shadow-2xl border border-white/60 flex flex-col items-center overflow-hidden transition-all duration-300 ease-out z-50 font-sans ${
          isHovered
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        {/* Vinyl Disc Container */}
        <div className='relative w-[250px] h-[250px] -mt-28 flex items-center justify-center shrink-0 z-10'>
          <div
            className={`relative w-full h-full rounded-full shadow-md overflow-hidden transition-transform duration-700 ease-out ${
              isPlaying ? 'animate-[spin_14s_linear_infinite]' : ''
            }`}
            style={{
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            {/* Direct HTML Image element (avoids domain restriction blocks) */}
            <img
              src={coverImage}
              alt='Album Cover'
              className='w-full h-full object-cover rounded-full'
            />

            {/* Groove Overlays */}
            <div className='absolute inset-0 rounded-full border-[10px] border-black/10 pointer-events-none' />

            {/* Center Vinyl Spindle Hole */}
            <div className='absolute inset-0 m-auto w-[28%] h-[28%] rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-center'>
              <div className='w-[82%] h-[82%] rounded-full bg-gradient-to-tr from-zinc-300 via-zinc-100 to-zinc-300 p-[2px] flex items-center justify-center shadow-sm'>
                <div className='w-full h-full rounded-full bg-zinc-200/90 border border-zinc-400/30 flex items-center justify-center'>
                  <div className='w-[48%] h-[48%] rounded-full bg-white shadow-inner border border-zinc-300' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Song Info & Timestamps */}
        <div className='w-full flex flex-col items-center mt-3 text-center font-sans z-20'>
          <div className='flex items-center justify-center mb-1'>
            <AudioLinesIcon size={14} isPlaying={isPlaying} className='text-zinc-700' />
          </div>

          <span className='text-zinc-500 text-[11px] font-medium tracking-tight truncate max-w-[180px]'>
            {isPlaying ? spotifyData.artist : 'offline'}
          </span>

          <h4 className='text-zinc-900 text-sm font-bold tracking-tight mt-0.5 truncate max-w-[190px]'>
            {isPlaying ? spotifyData.title : 'not playing'}
          </h4>

          {/* Progress Bar */}
          <div className='w-14 h-[3px] bg-zinc-300/80 rounded-full overflow-hidden my-2.5'>
            <div
              className='h-full bg-zinc-800 transition-all duration-300'
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Timestamp Display */}
          <div className='font-mono text-zinc-900 text-xs font-semibold tracking-wider flex items-center gap-1'>
            <span>{currentFormattedTime}</span>
            <span className='text-zinc-400'>/</span>
            <span className='text-zinc-400'>{durationFormattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}