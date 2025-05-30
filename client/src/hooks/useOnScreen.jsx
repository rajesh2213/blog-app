import { useState, useEffect, useRef } from 'react'

const useOnScreen = (options) => {
    const ref = useRef()
    const [isIntersecting, setIntersecting] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting)
        })

        if(ref.current){
            observer.observe(ref.current)
        }

        return () => {
            if(ref.current) observer.unobserve(ref.current)
        }

    }, [ref, options])

    return [ref, isIntersecting]
}

export default useOnScreen