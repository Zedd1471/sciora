import React from 'react';
import styled from 'styled-components';

interface Post {
  id: string;
  title: string;
  author_name: string;
  content: string;
  video_url?: string; // Add video_url to the Post interface
  created_at: string;
}

interface Props {
  post: Post;
  onClick: () => void;
}

const getYouTubeVideoId = (url: string) => {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^\[&\?\n]{11})(?:[\?&].*)?$/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
};

const getYouTubeThumbnail = (videoId: string | null) => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // You can change to mqdefault.jpg, sddefault.jpg, or maxresdefault.jpg
};

const ThumbnailImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
  object-fit: cover;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95); /* Lighter background for better contrast */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  color: #333; /* Darker text color */
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.98);
  }
`;

const PostTitle = styled.h3`
  font-size: 1.6rem; /* Slightly larger title */
  margin-bottom: 0.5rem;
  color: #222; /* Even darker title */
`;

const PostExcerpt = styled.p`
  font-size: 1.05rem; /* Slightly larger body font */
  line-height: 1.7; /* Increased line height for readability */
  color: #444; /* Darker body text */
`;

const PostMeta = styled.small`
  display: block;
  margin-top: 1rem;
  color: #666; /* Darker meta text */
`;

const PostPreviewCard: React.FC<Props> = ({ post, onClick }) => {
  const excerpt = post.content.length > 150 
    ? `${post.content.slice(0, 150)}...` 
    : post.content;

  const videoId = getYouTubeVideoId(post.video_url || '');
  const thumbnailUrl = getYouTubeThumbnail(videoId);

  return (
    <Card onClick={onClick}>
      {thumbnailUrl && <ThumbnailImage src={thumbnailUrl} alt="YouTube Thumbnail" />}
      <PostTitle>{post.title}</PostTitle>
      <PostExcerpt>{excerpt}</PostExcerpt>
      <PostMeta>
        By {post.author_name || 'Admin'} • {new Date(post.created_at).toLocaleDateString()}
      </PostMeta>
    </Card>
  );
};

export default PostPreviewCard;
