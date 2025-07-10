import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

// Enhanced Post type
type Post = {
  id: string;
  author_name: string;
  title: string;
  content: string;
  video_url?: string;
  tags?: string[];
  like_count?: number;
  created_at: string;
};

// Styled Components for a more blog-like appearance
const BlogFeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const PostCard = styled.article`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  color: #f1f1f1;
  text-align: left;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
`;

const PostTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const PostMeta = styled.div`
  font-size: 0.9rem;
  color: #d1d5db;
  margin-bottom: 1.5rem;
`;

const PostBody = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap; /* Respects newlines in the content */
  
  p {
    margin-bottom: 1rem;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  background: #000;
  border-radius: 8px;
  margin: 1.5rem 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const TagsContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.15);
  color: #e5e7eb;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
`;

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch (error) {
    console.error("Invalid video URL:", error);
    return null;
  }
  return null;
};

export default function BlogFeed({ limit }: { limit?: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: postData, error } = await query;

      if (error || !postData) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(postData as Post[]);
    };

    fetchPosts();
  }, [limit]);

  return (
    <BlogFeedContainer>
      {posts.map(post => {
        const embedUrl = getYouTubeEmbedUrl(post.video_url || '');
        return (
          <PostCard key={post.id} onClick={() => handlePostClick(post.id)}>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              By <strong>{post.author_name || 'Admin'}</strong> • {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {limit ? (post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content) : post.content}
              </ReactMarkdown>
            </PostBody>

            {post.tags && post.tags.length > 0 && (
              <TagsContainer>
                {post.tags.map(tag => tag && <Tag key={tag}>{tag}</Tag>)}
              </TagsContainer>
            )}
          </PostCard>
        );
      })}
    </BlogFeedContainer>
  );
}