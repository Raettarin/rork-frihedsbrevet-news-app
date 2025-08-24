import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';

export interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  type: 'article' | 'podcast';
  coverImage?: string;
  duration?: number;
  category?: string;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  playTrack: (track: AudioTrack) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  isFullPlayerOpen: boolean;
  dismissMiniPlayer: () => void;
  isMiniPlayerDismissed: boolean;
}

export const [AudioPlayerProvider, useAudioPlayer] = createContextHook(() => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [isMiniPlayerDismissed, setIsMiniPlayerDismissed] = useState<boolean>(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const positionUpdateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      if (Platform.OS !== 'web') {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
        } catch (error) {
          console.error('Error setting up audio:', error);
        }
      }
    };

    setupAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (positionUpdateRef.current) {
        clearInterval(positionUpdateRef.current);
      }
    };
  }, []);

  const startPositionUpdates = useCallback(() => {
    if (positionUpdateRef.current) {
      clearInterval(positionUpdateRef.current);
    }

    positionUpdateRef.current = setInterval(async () => {
      if (Platform.OS === 'web' && isPlaying) {
        // Mock position updates for web
        setPosition(prev => Math.min(prev + 1000, duration));
      } else if (soundRef.current && isPlaying) {
        try {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
          }
        } catch (error) {
          console.error('Error getting playback status:', error);
        }
      }
    }, 1000);
  }, [isPlaying, duration]);

  const stopPositionUpdates = useCallback(() => {
    if (positionUpdateRef.current) {
      clearInterval(positionUpdateRef.current);
      positionUpdateRef.current = null;
    }
  }, []);

  const playTrack = useCallback(async (track: AudioTrack) => {
    try {
      setIsLoading(true);
      
      // Stop current track if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        stopPositionUpdates();
      }

      // Reset mini player dismissed state when playing new track
      setIsMiniPlayerDismissed(false);

      // For web, we'll use a simple HTML5 audio approach
      if (Platform.OS === 'web') {
        console.log('Playing track on web:', track.title);
        setCurrentTrack(track);
        setIsPlaying(true);
        setIsLoading(false);
        // Set mock duration for web
        setDuration(180000); // 3 minutes
        startPositionUpdates();
        return;
      }

      // Validate audio URL
      if (!track.audioUrl) {
        throw new Error('No audio URL provided');
      }

      // Check if URL is accessible with better error handling
      try {
        const response = await fetch(track.audioUrl, { method: 'HEAD' });
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(`Access denied to audio file (403). The audio source may have restricted access.`);
          } else if (response.status === 404) {
            throw new Error(`Audio file not found (404). The audio may have been moved or deleted.`);
          } else {
            throw new Error(`Audio file not accessible (${response.status})`);
          }
        }
      } catch (fetchError) {
        console.warn('Could not verify audio URL accessibility:', fetchError);
        // Try with GET request as fallback
        try {
          const getResponse = await fetch(track.audioUrl, { method: 'GET', headers: { 'Range': 'bytes=0-1' } });
          if (!getResponse.ok && getResponse.status === 403) {
            throw new Error(`Access denied to audio file (403). The audio source may have restricted access.`);
          }
        } catch (getFetchError) {
          console.warn('GET request also failed:', getFetchError);
          // Continue anyway as some servers may have CORS issues but still work with expo-av
        }
      }

      console.log('Loading audio from:', track.audioUrl);

      // Load and play new track with better error handling
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { 
          shouldPlay: true,
          progressUpdateIntervalMillis: 1000,
          positionMillis: 0,
          volume: 1.0,
          rate: 1.0,
          shouldCorrectPitch: true,
        },
        (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
            
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
              stopPositionUpdates();
            }
          } else if (status.error) {
            console.error('Audio playback error:', status.error);
            setIsLoading(false);
            setIsPlaying(false);
          }
        }
      );

      soundRef.current = sound;
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsLoading(false);
      startPositionUpdates();

      console.log('Successfully loaded and playing track:', track.title);
    } catch (error) {
      console.error('Error playing track:', error);
      setIsLoading(false);
      setIsPlaying(false);
      
      // Show user-friendly error message based on error type
      if (error instanceof Error) {
        if (error.message.includes('403') || error.message.includes('Access denied')) {
          console.log('Access denied: The audio source has restricted access. Please try a different track.');
        } else if (error.message.includes('404') || error.message.includes('not found')) {
          console.log('Audio file not found. This track may no longer be available.');
        } else if (error.message.includes('extractors')) {
          console.log('Audio format not supported. Please try a different track.');
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          console.log('Network error. Please check your internet connection and try again.');
        } else {
          console.log('Audio playback failed. Please try a different track.');
        }
      }
    }
  }, [startPositionUpdates, stopPositionUpdates]);

  const pauseTrack = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        setIsPlaying(false);
        stopPositionUpdates();
        console.log('Paused track on web');
        return;
      }

      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        stopPositionUpdates();
        console.log('Paused track');
      }
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  }, [stopPositionUpdates]);

  const resumeTrack = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        setIsPlaying(true);
        startPositionUpdates();
        console.log('Resumed track on web');
        return;
      }

      if (soundRef.current) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        startPositionUpdates();
        console.log('Resumed track');
      }
    } catch (error) {
      console.error('Error resuming track:', error);
    }
  }, [startPositionUpdates]);

  const stopTrack = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        setCurrentTrack(null);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        stopPositionUpdates();
        console.log('Stopped track on web');
        return;
      }

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      
      setCurrentTrack(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      stopPositionUpdates();
      console.log('Stopped track');
    } catch (error) {
      console.error('Error stopping track:', error);
    }
  }, [stopPositionUpdates]);

  const seekTo = useCallback(async (newPosition: number) => {
    try {
      if (Platform.OS === 'web') {
        setPosition(Math.max(0, Math.min(newPosition, duration)));
        console.log('Seeked to position on web:', newPosition);
        return;
      }

      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.setPositionAsync(newPosition);
          setPosition(newPosition);
          console.log('Seeked to position:', newPosition);
        }
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, [duration]);

  const openFullPlayer = useCallback(() => {
    setIsFullPlayerOpen(true);
  }, []);

  const closeFullPlayer = useCallback(() => {
    setIsFullPlayerOpen(false);
  }, []);

  const dismissMiniPlayer = useCallback(() => {
    setIsMiniPlayerDismissed(true);
  }, []);

  return useMemo(() => ({
    currentTrack,
    isPlaying,
    isLoading,
    position,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    seekTo,
    openFullPlayer,
    closeFullPlayer,
    isFullPlayerOpen,
    dismissMiniPlayer,
    isMiniPlayerDismissed,
  }), [currentTrack, isPlaying, isLoading, position, duration, playTrack, pauseTrack, resumeTrack, stopTrack, seekTo, openFullPlayer, closeFullPlayer, isFullPlayerOpen, dismissMiniPlayer, isMiniPlayerDismissed]);
});