import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Map, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Course } from '../../../course/course.types';
import styles from './LearningPath.module.css';

// === Icons ===
const ICON_SELECTED   = 'https://cdn.lordicon.com/vdjwmfqs.json';
const ICON_PASSED     = 'https://cdn.lordicon.com/guqkthkk.json';
const ICON_UNSELECTED = 'https://cdn.lordicon.com/yhtmwrae.json';

interface LearningPathProps {
    courses: Course[];
    selectedLevel?: string;
    onLevelSelect?: (level: string) => void;
}

// === Levels ===
const LEVELS = [
    'IELTS 3.0',
    'IELTS 4.0',
    'IELTS 5.0',
    'IELTS 6.0',
    'IELTS 6.5',
    'IELTS 7.0',
    'IELTS 7.5',
    'IELTS 8.0',
];

const HINT_INTERVAL = 12000;
const HINT_NUDGE    = 70;
const HINT_STEP_MS  = 500;
const SESSION_KEY   = 'fuku_learningPath_selectedLevel';

type NodeState = 'selected' | 'passed' | 'unselected';

const getNodeState = (courseLv: string, selectedLevel?: string): NodeState => {
    if (!selectedLevel) return 'unselected';
    const selectedIdx = LEVELS.indexOf(selectedLevel);
    const courseIdx   = LEVELS.indexOf(courseLv);
    if (courseIdx === -1)           return 'unselected';
    if (courseLv === selectedLevel) return 'selected';
    if (courseIdx < selectedIdx)    return 'passed';
    return 'unselected';
};

// === LordIconNode ===
const LordIconNode: React.FC<{
    nodeState: NodeState;
    isHovered: boolean;
}> = ({ nodeState, isHovered }) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let iconSrc = ICON_UNSELECTED;
        if (nodeState === 'selected') iconSrc = ICON_SELECTED;
        if (nodeState === 'passed')   iconSrc = ICON_PASSED;

        el.setAttribute('src', iconSrc);
        el.setAttribute('stroke', 'bold');

        el.setAttribute('colors', nodeState === 'selected'
            ? 'primary:#4ade80,secondary:#ffffff'
            : nodeState === 'passed'
                ? 'primary:#4ade80,secondary:#1a1a2e'
                : 'primary:#64748b,secondary:#94a3b8'
        );
        el.setAttribute('style', 'width:28px;height:28px;display:block;flex-shrink:0');

        if (nodeState === 'selected') {
            el.setAttribute('trigger', 'loop');
        } else if (isHovered) {
            el.setAttribute('trigger', 'loop');
        } else {
            el.setAttribute('trigger', 'none');
        }
    }, [nodeState, isHovered]);

    // @ts-ignore
    return <lord-icon key={nodeState} ref={ref} />;
};

// === Main Component ===
const LearningPath: React.FC<LearningPathProps> = ({
                                                       courses,
                                                       selectedLevel,
                                                       onLevelSelect,
                                                   }) => {
    const scrollRef    = useRef<HTMLDivElement>(null);
    const hintTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
    const userScrolled = useRef(false);

    const [canScrollLeft,  setCanScrollLeft]  = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isMobile,       setIsMobile]       = useState(false);
    const [showSwipeHint,  setShowSwipeHint]  = useState(false);
    const [bouncingLevel,  setBouncingLevel]  = useState<string | null>(null);
    const [hoveredLevel,   setHoveredLevel]   = useState<string | null>(null);

    // === Restore State ===
    useEffect(() => {
        const savedLevel = sessionStorage.getItem(SESSION_KEY);
        if (savedLevel && !selectedLevel && onLevelSelect) {
            onLevelSelect(savedLevel);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // === Detect Mobile ===
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 650);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // === Scroll Button State ===
    const checkScrollButtons = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }, []);

    // === Auto Scroll ===
    useEffect(() => {
        if (!scrollRef.current) return;
        const selectedEl = scrollRef.current.querySelector(`.${styles.statusSelected}`) as HTMLElement | null;
        if (selectedEl) {
            const containerWidth = scrollRef.current.clientWidth;
            const scrollTo = selectedEl.offsetLeft - containerWidth / 2 + selectedEl.clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
        checkScrollButtons();
    }, [courses, selectedLevel, checkScrollButtons]);

    const scroll = (direction: 'left' | 'right') => {
        scrollRef.current?.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth'
        });
    };

    // === Handle Click ===
    const handleNodeClick = (lv: string) => {
        if (!onLevelSelect) return;

        setBouncingLevel(lv);
        setTimeout(() => setBouncingLevel(null), 500);

        const newLevel = selectedLevel === lv ? '' : lv;
        onLevelSelect(newLevel);

        if (newLevel) {
            sessionStorage.setItem(SESSION_KEY, newLevel);
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    };

    // === Swipe Hint ===
    const playHint = useCallback(() => {
        if (!scrollRef.current || userScrolled.current) return;
        const el     = scrollRef.current;
        const origin = el.scrollLeft;
        el.scrollTo({ left: origin + HINT_NUDGE, behavior: 'smooth' });
        setTimeout(() => {
            el.scrollTo({ left: origin, behavior: 'smooth' });
        }, HINT_STEP_MS);
    }, []);

    useEffect(() => {
        if (!isMobile) return;
        const showTimer = setTimeout(() => setShowSwipeHint(true),  3500);
        const hideTimer = setTimeout(() => setShowSwipeHint(false), 7500);
        return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }, [isMobile]);

    useEffect(() => {
        if (!isMobile) return;
        const schedule = () => {
            hintTimer.current = setTimeout(() => {
                if (!userScrolled.current) { playHint(); schedule(); }
            }, HINT_INTERVAL);
        };
        hintTimer.current = setTimeout(() => {
            if (!userScrolled.current) { playHint(); schedule(); }
        }, 10000);
        return () => { if (hintTimer.current) clearTimeout(hintTimer.current); };
    }, [isMobile, playHint]);

    const handleScroll = useCallback(() => {
        checkScrollButtons();
        if (!userScrolled.current) {
            userScrolled.current = true;
            setShowSwipeHint(false);
            if (hintTimer.current) clearTimeout(hintTimer.current);
        }
    }, [checkScrollButtons]);

    return (
        <section className={styles.pathContainer}>
            {/* === Header === */}
            <header className={styles.pathHeader}>
                <div className={styles.headerTitle}>
                    <div className={styles.iconBox}>
                        <Map size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 style={{textAlign:"left"}}>Level Selection</h2>
                        <div className={styles.subtitleWrapper}>
                            {selectedLevel ? (
                                <>
                                    <span className={styles.subtitleText}>Selected:</span>
                                    <div className={styles.currentBadge}>
                                        <Zap size={14} fill="currentColor" />
                                        <span>{selectedLevel}</span>
                                    </div>
                                </>
                            ) : (
                                <span className={styles.subtitleText}>Choose your target level</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* === Track Area === */}
            <div className={styles.trackWrapper}>
                {!isMobile && canScrollLeft && (
                    <button
                        className={`${styles.navBtn} ${styles.navPrev}`}
                        onClick={() => scroll('left')}
                        aria-label="Previous level"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
                {!isMobile && canScrollRight && (
                    <button
                        className={`${styles.navBtn} ${styles.navNext}`}
                        onClick={() => scroll('right')}
                        aria-label="Next level"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}

                <div
                    className={`${styles.trackScroll} ${isMobile ? styles.trackScrollMobile : ''}`}
                    ref={scrollRef}
                    onScroll={handleScroll}
                >
                    {courses.map((course, index) => {
                        const nodeState  = getNodeState(course.lv, selectedLevel);
                        const isBouncing = course.lv === bouncingLevel;
                        const isHovered  = course.lv === hoveredLevel;
                        const isLastItem = index === courses.length - 1;

                        const stateClass = {
                            selected:   styles.statusSelected,
                            passed:     styles.statusPassed,
                            unselected: styles.statusUnselected,
                        }[nodeState];

                        const circleClass = {
                            selected:   styles.nodeCircleSelected,
                            passed:     styles.nodeCirclePassed,
                            unselected: '',
                        }[nodeState];

                        return (
                            <div
                                key={course.id}
                                className={`${styles.pathItem} ${stateClass}`}
                            >
                                <div
                                    className={`${styles.nodeWrapper} ${isBouncing ? styles.nodeBounce : ''}`}
                                    onClick={() => handleNodeClick(course.lv)}
                                    onMouseEnter={() => setHoveredLevel(course.lv)}
                                    onMouseLeave={() => setHoveredLevel(null)}
                                    role="button"
                                    aria-pressed={nodeState === 'selected'}
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && handleNodeClick(course.lv)}
                                >
                                    <div className={styles.nodeCircleOuter}>
                                        <div className={`${styles.nodeCircle} ${circleClass}`}>
                                            <LordIconNode
                                                nodeState={nodeState}
                                                isHovered={isHovered}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.nodeInfo}>
                                        <span className={styles.nodeLabel}>{course.lv}</span>
                                    </div>
                                </div>

                                {!isLastItem && (
                                    <div
                                        className={`${styles.connector} ${nodeState !== 'unselected' ? styles.connectorActive : ''}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {isMobile && canScrollRight && (
                    <div className={`${styles.swipeHint} ${showSwipeHint ? styles.swipeHintVisible : ''}`}>
                        <span>Swipe to explore</span>
                        <span className={styles.swipeArrow}>→</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LearningPath;