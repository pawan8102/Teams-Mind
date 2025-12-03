

"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  username: string;
  team: string;
};

type Post = {
  id: string;
  user_id: string;
  content: string;
  visibility: "public" | "private";
  created_at: string;
  username: string;
  team: string;
  likes: string[];
  comments: {
    id: string;
    user_id: string;
    username: string;
    content: string;
  }[];
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) return alert(error.message);
      setProfile(profileData);
    }
    fetchProfile();
  }, [router]);

  // Fetch posts
  useEffect(() => {
    if (!profile) return;

    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles(username, team),
          likes(user_id),
          comments(id, user_id, content)
        `
        )
        .order("created_at", { ascending: false });

      if (error) return alert(error.message);

      const visiblePosts = data.filter(
        (p: any) =>
          p.visibility === "public" ||
          p.profiles?.team === profile?.team || // FIXED
          p.user_id === profile?.id // FIXED
      );

      const mappedPosts = visiblePosts.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        content: p.content,
        visibility: p.visibility,
        created_at: p.created_at,
        username: p.profiles?.username ?? "Unknown",
        team: p.profiles?.team ?? "Unknown",
        likes: p.likes?.map((l: any) => l.user_id) ?? [],
        comments:
          p.comments?.map((c: any) => ({
            id: c.id,
            user_id: c.user_id,
            username: c.user_id === profile?.id ? "You" : "Unknown", // FIXED
            content: c.content,
          })) ?? [],
      }));

      setPosts(mappedPosts);
    }

    fetchPosts();
  }, [profile]);

  // Create new post
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !profile) return;

    const { data, error } = await supabase
      .from("posts")
      .insert({ user_id: profile.id, content: message, visibility })
      .select()
      .single();

    if (error) return alert(error.message);

    const newPost: Post = {
      ...data,
      username: profile.username,
      team: profile.team,
      likes: [],
      comments: [],
    };

    setMessage("");
    setPosts([newPost, ...posts]);
  };

  // Like/Unlike
  const handleLike = async (postId: string) => {
    if (!profile) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const hasLiked = post.likes.includes(profile.id);

    if (hasLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", profile.id);

      if (error) return alert(error.message);

      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, likes: p.likes.filter((uid) => uid !== profile.id) }
            : p
        )
      );
    } else {
      const { error } = await supabase
        .from("likes")
        .upsert({ post_id: postId, user_id: profile.id })
        .select();

      if (error) return alert(error.message);

      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, likes: [...p.likes, profile.id] } : p
        )
      );
    }
  };

  // Comment
  const handleComment = async (postId: string) => {
    if (!profile) return;
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: profile.id, content })
      .select()
      .single();

    if (error) return alert(error.message);

    setCommentInputs({ ...commentInputs, [postId]: "" });

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { ...data, username: "You" }, // consistent
              ],
            }
          : post
      )
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-900 border-b-2 border-pink-500/50 shadow-[0_0_10px_rgba(255,20,147,0.5)]">
        <div className="flex items-center space-x-4">
          <span className="text-white font-bold">
            Username: {profile?.username}
          </span>
          <span className="px-3 py-1 border-2 border-pink-500 rounded-lg text-pink-400 shadow-[0_0_5px_rgba(255,20,147,0.5)]">
            {profile?.team}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="bg-red-600 px-4 py-2 rounded hover:shadow-[0_0_10px_red] transition"
        >
          Sign Out
        </button>
      </div>

      {/* New Post */}
      <div className="max-w-xl mx-auto mt-6 p-6 rounded-3xl bg-gray-900 border-4 border-pink-500/60 shadow-[0_0_30px_rgba(255,20,147,0.8)]">
        <form onSubmit={handlePost} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-[0_0_10px_rgba(255,20,147,0.5)] transition"
          />
          <div className="flex justify-between items-center">
            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "public" | "private")
              }
              className="bg-gray-800 text-white px-3 py-2 rounded-xl border border-pink-500 shadow-[0_0_10px_rgba(255,20,147,0.5)]"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(255,20,147,0.9)] transition neon-button"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posts */}
      <div className="max-w-xl mx-auto mt-6 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-2xl bg-gray-800 border border-pink-500/50 shadow-[0_0_20px_rgba(255,20,147,0.5)]"
          >
            <div className="flex justify-between text-sm mb-2 neon-text">
              <span className="font-bold">{post.username}</span>
              <span className="text-gray-400">{post.visibility}</span>
            </div>

            <p className="mb-2">{post.content}</p>

            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{post.likes.length} Likes</span>
              <span>{post.comments.length} Comments</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleLike(post.id)}
                className="bg-blue-500 px-2 py-1 rounded hover:shadow-[0_0_20px_rgba(0,191,255,0.7)] transition neon-button"
              >
                Like
              </button>

              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[post.id] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [post.id]: e.target.value,
                  })
                }
                className="flex-1 px-2 py-1 rounded bg-gray-700 text-white focus:outline-none border border-pink-500 shadow-[0_0_10px_rgba(255,20,147,0.5)]"
              />

              <button
                onClick={() => handleComment(post.id)}
                className="bg-green-500 px-2 py-1 rounded hover:shadow-[0_0_20px_rgba(0,255,127,0.7)] transition neon-button"
              >
                Comment
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {post.comments.map((c) => (
                <div
                  key={c.id}
                  className="text-sm text-gray-300 pl-2 border-l border-pink-500/30 neon-text"
                >
                  <span className="font-bold">{c.username}: </span>
                  {c.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 5px #ff1493, 0 0 10px #ff1493, 0 0 20px #ff1493,
            0 0 40px #ff1493;
        }
        .neon-button {
          text-shadow: 0 0 5px #ff1493, 0 0 10px #ff1493;
        }
      `}</style>
    </div>
  );
}
