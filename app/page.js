
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSongs() {
    setLoading(true);
    setError("");

    try {
      const terms = [
        "rock", "pop", "hip hop", "indie",
        "metal", "jazz", "classical", "electronic",
        "country", "blues", "folk", "alternative",
        "soundtrack", "R&B", "reggae", "punk",
        "singer songwriter", "dance", "acoustic",
        "Indian music"
      ];

      const shuffled = [...terms].sort(
        () => Math.random() - 0.5
      );

      const collected = [];
      const seen = new Set();

      for (const term of shuffled) {
        const response = await fetch(
          `/api/search?term=${encodeURIComponent(term)}`
        );

        if (!response.ok) continue;

        const data = await response.json();

        for (const song of data.results || []) {
          if (!seen.has(song.trackId)) {
            seen.add(song.trackId);
            collected.push(song);
          }
        }

        if (collected.length >= 150) break;
      }

      if (!collected.length) {
        throw new Error("No songs available right now.");
      }

      for (let i = collected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [collected[i], collected[j]] =
          [collected[j], collected[i]];
      }

      setSongs(collected);
      setIndex(0);
    } catch (err) {
      setError(err.message || "Unable to load songs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSongs();
  }, []);

  const song = songs[index];

  function nextSong() {
    if (index < songs.length - 1) {
      setIndex(index + 1);
    } else {
      loadSongs();
    }
  }

  function previousSong() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <h1>♫ SoundSpace</h1>
        <p>Loading your music universe...</p>
      </main>
    );
  }

  if (error || !song) {
    return (
      <main className="page">
        <h1>♫ SoundSpace</h1>
        <p>{error || "No songs found."}</p>
        <button onClick={loadSongs}>Try Again</button>
      </main>
    );
  }

  return (
    <main className="page">
      <nav className="navbar">
        <h2>♫ SoundSpace</h2>
        <span>YOUR MUSIC UNIVERSE</span>
      </nav>

      <section className="player">
        <p className="eyebrow">NOW DISCOVERING</p>

        <div className="album">
          <img
            src={song.artworkUrl100?.replace(
              "100x100bb",
              "600x600bb"
            )}
            alt={song.collectionName || song.trackName}
          />
        </div>

        <p className="genre">
          {song.primaryGenreName || "Music"}
        </p>

        <h1>{song.trackName}</h1>
        <p className="singer">{song.artistName}</p>
        <p className="album-name">
          {song.collectionName || "Single"}
        </p>

        {song.previewUrl && (
          <audio
            key={song.trackId}
            controls
            src={song.previewUrl}
          />
        )}

        <div className="controls">
          <button
            onClick={previousSong}
            disabled={index === 0}
          >
            ⏮ Previous
          </button>

          <button onClick={nextSong}>
            Next ⏭
          </button>
        </div>

        <p className="counter">
          SONG {index + 1} OF {songs.length}
        </p>

        {song.trackViewUrl && (
          <a
            className="store-link"
            href={song.trackViewUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open song in Apple Music
          </a>
        )}
      </section>

      <footer>
        Discover something new · SoundSpace
      </footer>
    </main>
  );
}
