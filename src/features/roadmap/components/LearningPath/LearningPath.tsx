import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Map, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Course } from '../../../course/course.types';
import styles from './LearningPath.module.css';

// ============================================================================
// Types
// ============================================================================

interface LearningPathProps {
    courses: Course[];
    selectedLevel?: string;
    onLevelSelect?: (level: string) => void;
}

type NodeState = 'selected' | 'passed' | 'unselected';

// ============================================================================
// Constants & Configurations
// ============================================================================

const ICON_SELECTED = 'https://cdn.lordicon.com/hjrbjhnq.json';
const ICON_PASSED = 'https://cdn.lordicon.com/uvofdfal.json';
const ICON_UNSELECTED = 'https://cdn.lordicon.com/wjogzler.json';

const LEVELS = [
    'IELTS 4.0',
    'IELTS 5.0',
    'IELTS 6.0',
    'IELTS 6.5',
    'IELTS 7.0',
    'IELTS 7.5',
    'IELTS 8.0',
];

// Muted color palette to match dark backgrounds without being overly flashy
const LEVEL_CONFIG: Record<string, { theme: string; colorPrimary: string }> = {
    'IELTS 4.0': { theme: styles.theme40, colorPrimary: '#4ade80' }, // Original Green
    'IELTS 5.0': { theme: styles.theme50, colorPrimary: '#60a5fa' }, // Soft Blue
    'IELTS 6.0': { theme: styles.theme60, colorPrimary: '#c084fc' }, // Soft Purple
    'IELTS 6.5': { theme: styles.theme65, colorPrimary: '#fb7185' }, // Soft Pink
    'IELTS 7.0': { theme: styles.theme70, colorPrimary: '#fbbf24' }, // Soft Yellow
    'IELTS 7.5': { theme: styles.theme75, colorPrimary: '#fb923c' }, // Soft Orange
    'IELTS 8.0': { theme: styles.theme80, colorPrimary: '#2dd4bf' }, // Soft Teal
};

const SESSION_KEY = 'fuku_learningPath_selectedLevel';

// ============================================================================
// Utility Functions
// ============================================================================

const getNodeState = (courseIdx: number, displayIdx: number, targetIdx: number): NodeState => {
    if (displayIdx === -1) return 'unselected';
    if (courseIdx === targetIdx && displayIdx === targetIdx) return 'selected';
    if (courseIdx <= displayIdx) return 'passed';
    return 'unselected';
};

// ============================================================================
// Sub Components
// ============================================================================

const LordIconNode: React.FC<{
    nodeState: NodeState;
    colorPrimary: string;
}> = ({ nodeState,  colorPrimary }) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let iconSrc = ICON_UNSELECTED;
        if (nodeState === 'selected') iconSrc = ICON_SELECTED;
        if (nodeState === 'passed') iconSrc = ICON_PASSED;

        el.setAttribute('src', iconSrc);
        el.setAttribute('stroke', 'bold');

        const primaryColor = nodeState === 'unselected' ? '#64748b' : colorPrimary;
        const secondaryColor = nodeState === 'selected'
            ? '#ffffff'
            : nodeState === 'passed'
                ? '#1a1a2e'
                : '#94a3b8';

        el.setAttribute('colors', `primary:${primaryColor},secondary:${secondaryColor}`);
        el.setAttribute('style', 'width:30px;height:30px;display:block;flex-shrink:0');
        el.setAttribute('state', 'morph-book');
        el.setAttribute('delay', '3000');

        if (nodeState === 'selected') {
            el.setAttribute('trigger', 'loop');
        } else {
            el.setAttribute('trigger', 'none');
        }
    }, [nodeState,  colorPrimary]);

    // @ts-ignore
    return <lord-icon key={nodeState} ref={ref} />;
};

// ============================================================================
// Main Component
// ============================================================================

const LearningPath: React.FC<LearningPathProps> = ({
                                                       courses,
                                                       selectedLevel,
                                                       onLevelSelect,
                                                   }) => {
    // ------------------------------------------------------------------------
    // State & Refs
    // ------------------------------------------------------------------------

    const scrollRef = useRef<HTMLDivElement>(null);
    const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const userScrolled = useRef(false);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [bouncingLevel, setBouncingLevel] = useState<string | null>(null);
    const [displayIdx, setDisplayIdx] = useState<number>(-1);

    // ------------------------------------------------------------------------
    // Event Handlers
    // ------------------------------------------------------------------------

    const checkScrollButtons = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        scrollRef.current?.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth'
        });
    };

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

    const handleScroll = useCallback(() => {
        checkScrollButtons();
        if (!userScrolled.current) {
            userScrolled.current = true;
            if (hintTimer.current) clearTimeout(hintTimer.current);
        }
    }, [checkScrollButtons]);

    // ------------------------------------------------------------------------
    // Lifecycle & Effects
    // ------------------------------------------------------------------------

    useEffect(() => {
        const savedLevel = sessionStorage.getItem(SESSION_KEY);
        if (savedLevel && !selectedLevel && onLevelSelect) {
            onLevelSelect(savedLevel);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 650);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const targetIdx = selectedLevel ? LEVELS.indexOf(selectedLevel) : -1;

        if (displayIdx === targetIdx) return;

        if (displayIdx === -1 && targetIdx > -1) {
            setDisplayIdx(0);
            return;
        }

        const stepTime = targetIdx > displayIdx ? 150 : 70;

        const interval = setInterval(() => {
            setDisplayIdx((prev) => {
                const next = prev < targetIdx ? prev + 1 : prev - 1;
                if (next === targetIdx) {
                    clearInterval(interval);
                }
                return next;
            });
        }, stepTime);

        return () => clearInterval(interval);
    }, [selectedLevel, displayIdx]);

    useEffect(() => {
        if (!scrollRef.current) return;

        const targetElement = scrollRef.current.querySelector(
            `.${styles.statusSelected}, .${styles.statusPassed}:last-of-type`
        ) as HTMLElement | null;

        if (targetElement) {
            const containerWidth = scrollRef.current.clientWidth;
            const scrollTo = targetElement.offsetLeft - containerWidth / 2 + targetElement.clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }

        checkScrollButtons();
    }, [displayIdx, checkScrollButtons]);

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    const targetIdx = selectedLevel ? LEVELS.indexOf(selectedLevel) : -1;
    const selectedThemeConfig = selectedLevel ? LEVEL_CONFIG[selectedLevel] : null;

    return (
        <section className={styles.pathContainer}>
            {/* Header Section */}
            <header className={styles.pathHeader}>
                <div className={styles.headerTitle}>
                    <div className={styles.iconBox}>
                        <Map size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 style={{ textAlign: "left" }}>Cấp độ</h2>
                        <div className={styles.subtitleWrapper}>
                            {selectedLevel ? (
                                <>
                                    <span className={styles.subtitleText}>Đã chọn:</span>
                                    <div
                                        className={styles.currentBadge}
                                        style={selectedThemeConfig ? {
                                            color: selectedThemeConfig.colorPrimary,
                                            backgroundColor: `${selectedThemeConfig.colorPrimary}26`
                                        } : undefined}
                                    >
                                        <Zap size={14} fill="currentColor" />
                                        <span>{selectedLevel}</span>
                                    </div>
                                </>
                            ) : (
                                <span className={styles.subtitleText}>Chọn cấp độ bạn cần</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Track & Nodes Section */}
            <div className={styles.trackWrapper}>
                {/* Desktop Navigation */}
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

                {/* Main Scrollable Track */}
                <div
                    className={`${styles.trackScroll} ${isMobile ? styles.trackScrollMobile : ''}`}
                    ref={scrollRef}
                    onScroll={handleScroll}
                >
                    {courses.map((course, index) => {
                        const courseIdx = LEVELS.indexOf(course.lv);
                        const nodeState = getNodeState(courseIdx, displayIdx, targetIdx);
                        const isBouncing = course.lv === bouncingLevel;
                        const isLastItem = index === courses.length - 1;
                        const isConnectorActive = courseIdx < displayIdx;
                        const baseThemeConfig = LEVEL_CONFIG[course.lv] || { theme: '', colorPrimary: '#4ade80' };

                        const themeConfig = ((nodeState === 'passed' || nodeState === 'selected') && selectedThemeConfig)
                            ? selectedThemeConfig
                            : baseThemeConfig;

                        const stateClass = {
                            selected: styles.statusSelected,
                            passed: styles.statusPassed,
                            unselected: styles.statusUnselected,
                        }[nodeState];

                        const circleClass = {
                            selected: styles.nodeCircleSelected,
                            passed: styles.nodeCirclePassed,
                            unselected: '',
                        }[nodeState];

                        return (
                            <div
                                key={course.id}
                                className={`${styles.pathItem} ${stateClass} ${themeConfig.theme}`}
                            >
                                <div
                                    className={`${styles.nodeWrapper} ${isBouncing ? styles.nodeBounce : ''}`}
                                    onClick={() => handleNodeClick(course.lv)}
                                    role="button"
                                    aria-pressed={nodeState === 'selected'}
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && handleNodeClick(course.lv)}
                                >
                                    <div className={styles.nodeCircleOuter}>
                                        <div className={`${styles.nodeCircle} ${circleClass}`}>
                                            <LordIconNode
                                                nodeState={nodeState}
                                                colorPrimary={themeConfig.colorPrimary}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.nodeInfo}>
                                        <span className={styles.nodeLabel}>{course.lv}</span>
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {!isLastItem && (
                                    <div
                                        className={`${styles.connector} ${isConnectorActive ? styles.connectorActive : ''}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default LearningPath;