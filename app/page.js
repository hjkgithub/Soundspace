"use client";

import { useState } from "react";

const songs = [
  {
    name: "In the End",
    singer: "Linkin Park",
    genre: "Alternative Rock",
    color: "#713c9c"
  },
  {
    name: "Numb",
    singer: "Linkin Park",
    genre: "Alternative Rock",
    color: "#245f85"
  },
  {
    name: "Bohemian Rhapsody",
    singer: "Queen",
    genre: "Classic Rock",
    color: "#9a4c36"
  },
  {
    name: "Smells Like Teen Spirit",
    singer: "Nirvana",
    genre: "Grunge",
    color: "#426b4a"
  }
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const song = songs[current];

  function previousSong() {
    setCurrent((current - 1 + songs.length) % songs.length);
  }

  function nextSong() {
    setCurrent((current + 1) % songs.length);
  }

  return (
    <main
      className="page"
      style={{ "--accent": song.color }}
    >
      <nav className="navbar">
        <h2>♫ SoundSpace</h2>
        <span>YOUR MUSIC UNIVERSE</span>
      </nav>

      <section className="player">
        <p className="eyebrow">NOW EXPLORING</p>

        <div className="album">
          <span>♫</span>
        </div>

        <p className="genre">{song.genre}</p>
        <h1>{song.name}</h1>
        <p className="singer">{song.singer}</p>

        <div className="progress">
          <span />
        </div>

        <div className="controls">
          <button onClick={previousSong}>
            ⏮ Previous
          </button>
          <button onClick={nextSong}>
            Next ⏭
          </button>
        </div>

        <p className="counter">
          TRACK {current + 1} OF {songs.length}
        </p>
      </section>

      <footer>
        Made for music lovers · SoundSpace
      </footer>
    </main>
  );
    }
        
