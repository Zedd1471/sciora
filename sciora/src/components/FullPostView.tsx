import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface Post {
  id: string;
  title: string;
  author_name: string;
  content: string;
  video_url?: string;
  created_at: string;
}

interface Props {
  post: Post;
  onBack: () => void;
}

const FullPostContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95); /* Lighter background for better contrast */
  border-radius: 16px;
  color: #333; /* Darker text color */
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const BackButton = styled.button`
  background: #666; /* Darker button for contrast */
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-weight: bold;

  &:hover {
    background: #555;
  }
`;

const PostTitle = styled.h1`
  font-size: 3rem; /* Slightly larger title */
  margin-bottom: 1rem;
  color: #222; /* Even darker title */
`;

const PostMeta = styled.div`
  margin-bottom: 2rem;
  color: #555; /* Darker meta text */
`;

const PostBody = styled.div`
  font-size: 1.15rem; /* Slightly larger body font */
  line-height: 1.9; /* Increased line height for readability */
  color: #333; /* Darker body text */

  p, ul, ol {
    margin-bottom: 1.5rem;
  }

  a {
    color: #007bff; /* Standard link color */
    text-decoration: underline;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  background: #000;
  border-radius: 8px;
  margin: 2rem 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) { /* Invalid URL */ }
  return null;
};

const FullPostView: React.FC<Props> = ({ post, onBack }) => {
  const embedUrl = getYouTubeEmbedUrl(post.video_url);

  return (
    <FullPostContainer>
      <BackButton onClick={onBack}>← Back to All Posts</BackButton>
      <PostTitle>{post.title}</PostTitle>
      <PostMeta>
        By {post.author_name || 'Admin'} • {new Date(post.created_at).toLocaleDateString()}
      </PostMeta>
      {embedUrl && (
        <VideoWrapper>
          <iframe
            src={embedUrl}
            title={post.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      )}
      <PostBody>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
      </PostBody>
    </FullPostContainer>
  );
};

export default FullPostView;
