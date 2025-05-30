import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react';
import styles from "./ImageCarousel.module.css";

function ImageCarousel({ posts = [] }) {
    const imgContainerRef = useRef(null)
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0)
    const CAROUSEL_WIDTH = 800;

    useEffect(() => {
        if (imgContainerRef.current) {
            const carouselWrappers = Array.from(imgContainerRef.current.children);
            carouselWrappers.forEach(((carousel, idx) => {
                carousel.style.left = `${CAROUSEL_WIDTH * idx}px`
            }))
        }
    }, [posts]) 

    const handlePrevClick = () => {
        setCurrentSlideIdx(prev => ((prev - 1) + posts.length) % posts.length)
    }

    const handleNextClick = () => {
        setCurrentSlideIdx(prev => (prev + 1) % posts.length)
    }

    const handleSlider = (idx) => {
        setCurrentSlideIdx(idx)
    }

    return (
        <div>
            <div className={styles["carousel"]}>
                <div className={styles["img-container"]} ref={imgContainerRef} style={{ transform: `translateX(-${currentSlideIdx * CAROUSEL_WIDTH}px)` }}>
                    {posts && posts.length !== 0 && posts.map((post, idx) => (
                        <Link key={post.id} to={`/posts/${post.id}`} className={styles["carousel-wrapper"]}>
                            <img src={post.image} alt={post.title} className={styles["slide-img"]} />
                        </Link>
                    ))}
                </div>
            </div>
            <div>
                {posts && posts.length > 0 && posts.map((post, idx) => (
                    <button key={idx} onClick={() => handleSlider(idx)}>*</button>
                ))}
            </div>
            <div>
                <button onClick={handlePrevClick}>
                    <span>❮</span>
                </button>
                <button onClick={handleNextClick}>
                    <span>❯</span>
                </button>
            </div>
        </div>
    )
}

export default ImageCarousel;