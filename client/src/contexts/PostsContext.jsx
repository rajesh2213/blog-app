import { createContext, useContext, useState, useRef } from "react";
import { getPosts } from "../services/postServices";

const PostsContext = createContext()

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);

    const fetchedKeyref = useRef(new Set())
      const fetchPosts = async ({ offset, limit, published }) => {
        const key = `${offset}-${limit}`
        if(fetchedKeyref.current.has(key)) return;
        try{            
            const data = await getPosts({ offset, limit, published })
            setPosts(prev => [...prev,...(data.posts || [])])
            fetchedKeyref.current.add(key)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const resetPosts = () => {
        setPosts([])
        fetchedKeyref.current.clear();
    }

    return (
        <PostsContext.Provider value={{ posts, setPosts, fetchPosts, resetPosts, loading, setLoading }}>
            {children}
        </PostsContext.Provider>
    )
}

export const usePosts = () => useContext(PostsContext)