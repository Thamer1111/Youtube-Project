import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

const API_KEY = "AIzaSyA4mHA7uBQN9-s594jRJhK4ul2NsNZQ2cw";

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function Home() {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=200&regionCode=US&key=${API_KEY}`
      )
      .then((res) => {
        const videoItems = res.data.items;
        setVideos(videoItems);

        const channelIds = [
          ...new Set(videoItems.map((v) => v.snippet.channelId)),
        ];

        axios
          .get(
            `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(
              ","
            )}&key=${API_KEY}`
          )
          .then((channelRes) => {
            const channelData = {};
            channelRes.data.items.forEach((ch) => {
              channelData[ch.id] = ch;
            });
            setChannels(channelData);
          })
          .catch((err) =>
            console.error(err)
          );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="p-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-zinc-950 text-white">
      {videos.map((video) => {
        const channel = channels[video.snippet.channelId];

        return (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="relative">
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
                className="w-full h-48 object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-xs px-1 rounded">
                ??:??
              </span>
            </div>
            <div className="flex p-3 gap-3">
              {channel?.snippet?.thumbnails && (
                <img
                  src={
                    channel.snippet.thumbnails.high?.url ||
                    channel.snippet.thumbnails.medium?.url ||
                    channel.snippet.thumbnails.default?.url
                  }
                  alt={channel.snippet.title}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <h3 className="text-sm font-bold leading-snug line-clamp-2">
                  {video.snippet.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  {video.snippet.channelTitle}
                </p>
                <p className="text-xs text-zinc-500">
                  {Number(video.statistics.viewCount).toLocaleString()} views •{" "}
                  {timeAgo(video.snippet.publishedAt)}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Home;
