import React, { Suspense, useState, useEffect } from 'react';
import useOnScreen from '../../hooks/useOnScreen';
import styles from './LazyRenderedPostCard.module.css'

const LazyPostCard = React.lazy(() => import('./PostCard'));

const LazyRenderedPostCard = ({ post }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1, rootMargin: '50px' });
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    if (isVisible && !shouldRender) {
      setShouldRender(true);
    }
  }, [isVisible]);

  return (
    <div ref={ref} className={styles.lazyContainer}>
      <Suspense fallback={<div className={styles.skeleton}>...</div>}>
        {shouldRender ? <LazyPostCard post={post} /> : <div className={styles.skeleton}></div>}
      </Suspense>
    </div>
  );
};

export default LazyRenderedPostCard;
