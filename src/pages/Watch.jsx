import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineDownload,
  AiOutlineShareAlt,
} from "react-icons/ai";

const API_KEY = "AIzaSyA4mHA7uBQN9-s594jRJhK4ul2NsNZQ2cw";
const COMMENTS_API = "https://683f24371cd60dca33de6ad4.mockapi.io/comments";

function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
    } else {
      const likedVideos = JSON.parse(
        localStorage.getItem("likedVideos") || "{}"
      );
      setLiked(likedVideos[id] || false);
    }
  }, [id]);

  useEffect(() => {
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
      )
      .then((res) => {
        const videoData = res.data.items[0];
        setVideo(videoData);

        axios
          .get(
            `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${videoData.snippet.channelId}&key=${API_KEY}`
          )
          .then((channelRes) => {
            setChannel(channelRes.data.items[0]);
          });
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=30&regionCode=US&key=${API_KEY}`
      )
      .then((res) => {
        setRelatedVideos(res.data.items);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`${COMMENTS_API}?videoId=${id}`)
      .then((res) => setComments(res.data));
  }, [id]);

  const handleLike = () => {
    const likedVideos = JSON.parse(localStorage.getItem("likedVideos") || "{}");
    likedVideos[id] = !liked;
    localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
    setLiked(!liked);
  };

  const handleCommentSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !newComment.trim()) return;
    axios
      .post(COMMENTS_API, {
        videoId: id,
        user: user.username,
        comment: newComment,
        createdAt: new Date().toISOString(),
      })
      .then((res) => {
        setComments([res.data, ...comments]);
        setNewComment("");
      });
  };

  if (!video) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-4 bg-zinc-950 min-h-screen text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {id && (
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${id}`}
                title={video.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-xl w-full h-[360px] md:h-[480px]"
              ></iframe>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <h2 className="text-xl font-semibold">{video.snippet.title}</h2>

            <div className="flex items-center gap-3">
              {channel?.snippet?.thumbnails?.default?.url && (
                <img
                  src={channel.snippet.thumbnails.default.url}
                  alt={video.snippet.channelTitle}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{video.snippet.channelTitle}</p>
                <p className="text-sm text-zinc-500">Channel</p>
              </div>
            </div>

            <p className="text-sm text-zinc-500">
              {Number(video.statistics.viewCount).toLocaleString()} views
            </p>

            <div className="flex flex-wrap gap-4 mt-2 text-zinc-300 text-lg">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 hover:text-white transition"
              >
                <AiOutlineLike className={liked ? "text-blue-700" : ""} /> <span className={liked ? "text-blue-700" : ""}>Like</span>
              </button>
              <button className="flex items-center gap-1 hover:text-white transition">
                <AiOutlineDislike />
              </button>
              <button className="flex items-center gap-1 hover:text-white transition">
                <AiOutlineShareAlt /> Share
              </button>
              <button className="flex items-center gap-1 hover:text-white transition">
                <AiOutlineDownload /> Download
              </button>
            </div>

            <p className="text-sm text-zinc-300 mt-4 whitespace-pre-wrap">
              {video.snippet.description}
            </p>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Comments ({comments.length})
              </h3>
              <div className="flex flex-col gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="bg-blue-600 px-4 py-2 rounded w-fit text-white"
                >
                  Submit
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {comments.map((c) => (
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-800 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                      {c.user.slice(0, 2).toUpperCase()}
                    </div>
                    <div key={c.id} className="border-b border-zinc-700 pb-2 w-full">
                      <p className="font-medium">{c.user}</p>
                      <p className="text-sm text-zinc-300">{c.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="bg-white text-black font-bold p-4 rounded-xl">
            <a
              href="https://www.linkedin.com/in/thamer-alanazi-0546572b5/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.uconnectlabs.com/wp-content/uploads/sites/46/2022/08/Linkedin-Logo-e1660320077673.png"
                alt=""
              />
            </a>
          </div>

          <h3 className="text-lg font-semibold mb-2">Related Videos</h3>
          {relatedVideos.map((vid) => (
            <Link
              to={`/watch/${vid.id}`}
              key={vid.id}
              className="flex gap-2 hover:bg-zinc-800 p-2 rounded-lg transition"
            >
              <img
                src={vid.snippet.thumbnails.medium.url}
                alt={vid.snippet.title}
                className="w-32 h-20 rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2">
                  {vid.snippet.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  {vid.snippet.channelTitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Watch;
