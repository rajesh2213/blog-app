
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import styles from './Expandable.module.css'

const Expandable = ({
    children,
    defaultExpanded = false,
    expandableContainer = 'Expand',
}) => {

    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const [contentHeight, setContentHeight] = useState(0)
    const containerRef = useRef(null)

    useEffect(() => {
        if (containerRef.current) {
            setContentHeight(containerRef.current.scrollHeight)
        }
    }, [children])

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
        console.log('CONTENT HEIGHT: ', contentHeight, ' isExpanded: ', isExpanded)
    }

    return (
        <div className={styles.expandableContainer}>
            <button className={styles.expandableButton} onClick={toggleExpand}>
                <span>{expandableContainer}</span>
                <span className={styles.expandableIcon}>{isExpanded ? "▼" : "►"}</span>
            </button>
            <div
                className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}
                ref={containerRef}
                style={{
                    maxHeight: isExpanded ? `${contentHeight + 32}px` : '0', // 1rem top + 1rem bottom = ~32px
                    padding: isExpanded ? '1rem' : '0',
                    opacity: isExpanded && 1,
                }}>
                {children}
            </div>
        </div>
    )
}

Expandable.prototypes = {
    children: PropTypes.node.isRequired,
    defaultExpanded: PropTypes.bool,
    expandableContainer: PropTypes.string
}

export default Expandable;
