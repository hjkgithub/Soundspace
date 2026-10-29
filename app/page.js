
"use client";

import { useEffect, useState } from "react";

const genres = [
  "rock", "pop", "hip hop", "indie", "metal",
  "jazz", "classical", "electronic", "country",
  "blues", "folk", "alternative", "soundtrack",
  "R&B", "reggae", "punk", "dance", "acoustic",
  "Indian music", "soul", "disco", "K-pop",
  "Latin music", "world music", "ambient"
];

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batch, setBatch] = useState(0);
  const [history, setHistory] = useState([]);

  async function loadMore() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const collected = [];
      const seen = new Set(
        songs.map((song) => song.trackId)
      );

      // Try different genres on each batch.
      const start = (batch * 5) % genres.length;
      const selected = Array.from(
        { length: 5 },
        (_, i) => genres[(start + i) % genres.length]
      );

      for (const term of selected) {
        const response = await fetch(
          `/api/search?term=${encodeURIComponent(term)}`
        );

        if (!response.ok) continue;

        const data = await response.json();

        for (const song of data.results || []) {
          if (
            song.trackId &&
            !seen.has(song.trackId)
          ) {
            seen.add(song.trackId);
            collected.push(song);
          }
        }
      }

      // Shuffle the new batch.
      for (let i = collected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [collected[i], collected[j]] =
          [collected[j], collected[i]];
      }

      if (collected.length === 0) {
        setError(
          "No new songs found in this batch. Tap Next to try again."
        );
      } else {
        setSongs((previous) => [
          ...previous,
          ...collected
        ]);
        setBatch((previous) => previous + 1);
      }
    } catch {
      setError("Could not load more songs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initialLoad() {
      setLoading(true);

      try {
        const response = await fetch(
          "/api/search?term=popular%20music"
        );
        const data = await response.json();

        if (data.results?.length) {
          setSongs(data.results);
        } else {
          setError("Could not find songs.");
        }
      } catch {
        setError("Could not connect to the music catalogue.");
      } finally {
        setLoading(false);
      }
    }

    initialLoad();
  }, []);

  async function nextSong() {
    if (index < songs.length - 1) {
      setHistory((previous) => [...previous, index]);
      setIndex((previous) => previous + 1);
      return;
    }

    // At the end: fetch the next batch.
    await loadMore();
  }

  function previousSong() {
    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  }

  const song = songs[index];

  return (
    <main className="page">
      <nav className="navbar">
        <h2>♫ SoundSpace</h2>
        <span>YOUR MUSIC UNIVERSE</span>
      </nav>

      <section className="player">
        <p className="eyebrow">NOW DISCOVERING</p>

        {loading && !song ? (
          <p>Loading music...</p>
        ) : song ? (
          <>
            <div className="album">
              <img
                src={song.artworkUrl100?.replace(
                  "100x100bb",
                  "600x600bb"
                )}
                alt={song.trackName}
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

              <button
                onClick={nextSong}
                disabled={loading}
              >
                {loading ? "Loading..." : "Next ⏭"}
              </button>
            </div>

            <p className="counter">
              SONG {index + 1} · {songs.length} LOADED
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
          </>
        ) : (
          <p>No songs available.</p>
        )}

        {error && <p>{error}</p>}
      </section>

      <footer>
        Discover more music · SoundSpace
      </footer>
    </main>
  );
}
