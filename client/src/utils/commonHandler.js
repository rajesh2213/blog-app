

export const debounce = (fn, delay=500) => {
    let timeoutId 
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(()=>{
            fn(...args)

        },delay)
    }
}