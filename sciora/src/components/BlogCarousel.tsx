import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  author_name: string;
  content: string;
  created_at: string;
}

const CarouselContainer = styled.section`
  padding: 2rem 1rem; /* Adjusted padding for mobile */
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  color: #fff;
  text-align: center;
  border-radius: 16px;
  margin: 2rem auto;
  max-width: 500px; /* Default for larger screens */
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);

  @media (max-width: 768px) {
    max-width: 90%; /* Adjust max-width for tablets */
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    max-width: 95%; /* Adjust max-width for phones */
    padding: 1rem;
  }
`;

const CarouselContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem; /* Default padding */
  min-height: 180px; /* Slightly reduced min-height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 480px) {
    padding: 0.8rem; /* Smaller padding for phones */
    min-height: 160px;
  }
`;

const PostTitle = styled.h3`
  font-size: 1.8rem; /* Default font size */
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.5rem; /* Smaller font size for phones */
  }
`;

const PostMeta = styled.p`
  font-size: 0.9rem; /* Default font size */
  color: #d1d5db;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    font-size: 0.8rem; /* Smaller font size for phones */
  }
`;

const PostExcerpt = styled.p`
  font-size: 1.1rem; /* Default font size */
  line-height: 1.6;
  color: #e2e8f0;

  @media (max-width: 480px) {
    font-size: 0.95rem; /* Smaller font size for phones */
  }
`;

const getYouTubeVideoId = (url: string) => {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^\[\]\\&\?\n]{11})(?:[\?&].*)?$/;
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

const BlogCarousel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, author_name, content, video_url, created_at') // Include video_url
        .order('created_at', { ascending: false })
        .limit(5); // Limit to a few posts for the carousel

      if (error) {
        console.error('Error fetching blog posts:', error);
      } else {
        setPosts(data as Post[]);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 5000); // Change post every 5 seconds
    return () => clearInterval(interval);
  }, [posts]);

  if (posts.length === 0) return null;

  const currentPost = posts[current];
  const excerpt = currentPost.content.length > 150 
    ? `${currentPost.content.slice(0, 150)}...` 
    : currentPost.content;

  const handlePostClick = () => {
    navigate(`/blog/${currentPost.id}`);
  };

  const videoId = getYouTubeVideoId(currentPost.video_url || '');
  const thumbnailUrl = getYouTubeThumbnail(videoId);

  return (
    <CarouselContainer>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Latest from Our Blog</h2>
      <AnimatePresence mode="wait">
        <CarouselContent
          key={currentPost.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          onClick={handlePostClick}
        >
          {thumbnailUrl && <ThumbnailImage src={thumbnailUrl} alt="YouTube Thumbnail" />}
          <PostTitle>{currentPost.title}</PostTitle>
          <PostMeta>
            By {currentPost.author_name || 'Admin'} • {new Date(currentPost.created_at).toLocaleDateString()}
          </PostMeta>
          <PostExcerpt>{excerpt}</PostExcerpt>
        </CarouselContent>
      </AnimatePresence>
    </CarouselContainer>
  );
};

export default BlogCarousel;