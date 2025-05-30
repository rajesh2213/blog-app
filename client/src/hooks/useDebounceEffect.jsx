import { useEffect } from "react";

export default function useDebounceEffect(effect, deps, delay) {
    useEffect(() => {
        const handler = setTimeout(() => {
            effect()
        }, delay)

        return () => clearTimeout(handler)
    }, [...(deps || []), delay])

}