import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { getPosts } from '../services/postServices';
import PostCard from '../components/PostCard/PostCard';
import { useLimit } from '../contexts/LimitContext';
import { usePosts } from '../contexts/PostsContext';
import useDebounceEffect from '../hooks/useDebounceEffect';
import ImageCarousel from '../components/ImageCarousel/ImageCarousel';
import LazyRenderedPostCard from '../components/PostCard/LazyRenderedPostCard';
import styles from './Home.module.css';

const Home = () => {
  const [error, setError] = useState(null);

  const [carouselPosts, setCarouselPosts] = useState([]);

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchPosts, setSearchPosts] = useState()

  const { posts, setPosts, fetchPosts, resetPosts, loading, setLoading } = usePosts();

  const { limit, setLimit } = useLimit();
  const { offset, setOffset } = useLimit();

  const scrollPosRef = useRef(0);
  // console.log(posts)

  const handleLoadMore = (e) => {
    e.preventDefault();
    scrollPosRef.current = window.scrollY;
    setLimit((prev) => prev + 10);
    setOffset(prevOffset => prevOffset + limit);
  };
  const [publishedFilter, setPublishedFilter] = useState(null);

  const filterPublished = (e) => {
    e.preventDefault();
    setPublishedFilter(prev => {
      if (prev === null || prev == false) return true;
      if (prev === true) return false;
    });
    resetPosts();
    setOffset(0);
    // setLimit(2);
  }

  const loadSearchedPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts({ query });
      setSearchPosts(data.posts || []);
      setError(null);
    } catch (err) {
      if (err.status !== 404) {
        console.error(err);
        setError('An error occurred while fetching posts');
      }
      setSearchPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeCarousel = async () => {
      try {
        const storedCarouselPosts = localStorage.getItem('carouselPosts');

        if (storedCarouselPosts) {
          setCarouselPosts(JSON.parse(storedCarouselPosts));
          return;
        }

        const data = await getPosts({ limit: 10 });
        const postsToShuffle = [...(data.posts || [])];
        for (let i = postsToShuffle.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [postsToShuffle[i], postsToShuffle[j]] = [postsToShuffle[j], postsToShuffle[i]];
        }

        const selectedPosts = postsToShuffle.slice(0, 3);
        setCarouselPosts(selectedPosts);
        localStorage.setItem('carouselPosts', JSON.stringify(selectedPosts));
      } catch (err) {
        console.log(err.message)
        setError(err.message)
        setCarouselPosts([]);
      }
    };

    window.onbeforeunload = () => {
      localStorage.removeItem('carouselPosts');
    };

    if (!localStorage.getItem('carouselPosts')) {
      initializeCarousel();
    } else {
      setCarouselPosts(JSON.parse(localStorage.getItem('carouselPosts')));
    }
  }, []);

  useDebounceEffect(() => {
    if (isSearching && query.trim() !== '') {
      loadSearchedPosts();
    }
  }, [query], 300);

  useDebounceEffect(() => {
    if (!isSearching) {
      fetchPosts({ offset, limit, published: publishedFilter })
    }
  }, [limit, offset, publishedFilter], 300)

  useEffect(() => {
    if (!isSearching) {
      setSearchPosts([]);
    }
  }, [isSearching]);

  useLayoutEffect(() => {
    if (scrollPosRef.current) {
      window.scrollTo(0, scrollPosRef.current + 50);
      scrollPosRef.current = 0;
    }
  }, [posts]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>
          <strong>Error:</strong> {error}
        </p>
      </div>
    );
  }

  // if(posts && posts.length < 1 && !isSearching){
  //   return <p>No posts to show... </p>
  // }

  return (
    <div className={styles.container}>
      <ImageCarousel posts={carouselPosts} />
      <div className={styles.content}>
        <div className={styles.searchSection}>
          <input
            type="text"
            value={query}
            placeholder="Search posts..."
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              setIsSearching(value.trim() !== '');
            }}
          />          <div>
            <h3>Filter: </h3>
            <button type='button' onClick={filterPublished}>
              Published
            </button>
          </div>
        </div>
        <div className={styles.postSection}>
          <div className={styles.postContainer}>
            {loading ? (
              <h3>Loading...</h3>
            ) : !isSearching ? (
              posts && posts.length !== 0 && (
                posts.map((post) => <LazyRenderedPostCard key={post.id} post={post} />)
              )
            ) : (
              searchPosts && searchPosts.length !== 0 ? (
                searchPosts.map((post) => <LazyRenderedPostCard key={post.id} post={post} />)

              ) : isSearching && (
                <h3>No posts found for your search...</h3>
              )
            )}
          </div>
          {!isSearching && posts.length > 0 && (
            <button type="button" onClick={handleLoadMore}>
              Load More...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
