import React, { useRef, useEffect, useState, useCallback } from 'react'; // Thêm useCallback
import { Map, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Course } from '../../course.types';
import styles from './LearningPath.module.css';

// ============================================================================
// Types & Interfaces
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

const LEVELS = ['IELTS 4.0', 'IELTS 5.0', 'IELTS 6.0', 'IELTS 6.5', 'IELTS 7.0', 'IELTS 7.5', 'IELTS 8.0'];

const LEVEL_CONFIG: Record<string, { theme: string; colorPrimary: string }> = {
    'IELTS 4.0': { theme: styles.theme40, colorPrimary: '#4ade80' },
    'IELTS 5.0': { theme: styles.theme50, colorPrimary: '#3b82f6' },
    'IELTS 6.0': { theme: styles.theme60, colorPrimary: '#a855f7' },
    'IELTS 6.5': { theme: styles.theme65, colorPrimary: '#f43f5e' },
    'IELTS 7.0': { theme: styles.theme70, colorPrimary: '#eab308' },
    'IELTS 7.5': { theme: styles.theme75, colorPrimary: '#f97316' },
    'IELTS 8.0': { theme: styles.theme80, colorPrimary: '#14b8a6' },
};

const SESSION_KEY = 'fuku_learningPath_selectedLevel';

// ============================================================================
// Utilities
// ============================================================================

const getNodeState = (courseIdx: number, displayIdx: number, targetIdx: number): NodeState => {
    if (displayIdx === -1) return 'unselected';
    if (courseIdx === targetIdx && displayIdx === targetIdx) return 'selected';
    if (courseIdx <= displayIdx) return 'passed';
    return 'unselected';
};

// ============================================================================
// Sub-Components
// ============================================================================

const LordIconNode: React.FC<{ nodeState: NodeState; colorPrimary: string }> = ({ nodeState, colorPrimary }) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let iconSrc = nodeState === 'selected' ? ICON_SELECTED : nodeState === 'passed' ? ICON_PASSED : ICON_UNSELECTED;

        el.setAttribute('src', iconSrc);
        el.setAttribute('stroke', 'bold');

        const primaryColor = nodeState === 'unselected' ? '#94a3b8' : colorPrimary;
        const secondaryColor = nodeState === 'selected' ? '#ffffff' : nodeState === 'passed' ? '#1a1a2e' : '#cbd5e1';

        el.setAttribute('colors', `primary:${primaryColor},secondary:${secondaryColor}`);
        el.setAttribute('style', 'width:30px;height:30px;display:block;flex-shrink:0');
        el.setAttribute('state', 'morph-book');
        el.setAttribute('delay', '3000');

        el.setAttribute('trigger', nodeState === 'selected' ? 'loop' : '');
    }, [nodeState, colorPrimary]);

    return <lord-icon key={nodeState} ref={ref as any} />;
};

// ============================================================================
// Main Component
// ============================================================================

const LearningPath: React.FC<LearningPathProps> = ({ courses, selectedLevel, onLevelSelect }) => {

    // ------------------------------------------------------------------------
    // State & Refs
    // ------------------------------------------------------------------------

    const scrollRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [displayIdx, setDisplayIdx] = useState<number>(-1);
    const [isMobile, setIsMobile] = useState(false);
    const [bouncingLevel, setBouncingLevel] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    const shouldAutoClose = useRef<boolean>(true);

    // ------------------------------------------------------------------------
    // Handlers (Dùng useCallback để ổn định reference)
    // ------------------------------------------------------------------------

    const handleToggleExpand = useCallback((forceState?: boolean, isUserManualClick: boolean = false) => {
        if (isUserManualClick) {
            shouldAutoClose.current = false;
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }

        // Dùng functional update của state để tránh phụ thuộc vào biến isExpanded bên ngoài
        setIsExpanded((prevExpanded) => {
            const nextState = typeof forceState === 'boolean' ? forceState : !prevExpanded;

            if (nextState) {
                setIsVisible(true);
                // Giữ nguyên logic timeout nhẹ để đảm bảo animation chạy mượt
                return true;
            } else {
                // Khi đóng, chúng ta set false ngay cho animation, sau đó mới ẩn DOM
                setTimeout(() => setIsVisible(false), 400);
                return false;
            }
        });
    }, []);

    // ------------------------------------------------------------------------
    // Lifecycle & Effects
    // ------------------------------------------------------------------------

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 650);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const targetIdx = selectedLevel ? LEVELS.indexOf(selectedLevel) : -1;
        if (displayIdx === targetIdx) return;
        if (displayIdx === -1 && targetIdx > -1) { setDisplayIdx(0); return; }

        const stepTime = targetIdx > displayIdx ? 150 : 70;
        const interval = setInterval(() => {
            setDisplayIdx((prev) => {
                const next = prev < targetIdx ? prev + 1 : prev - 1;
                if (next === targetIdx) clearInterval(interval);
                return next;
            });
        }, stepTime);
        return () => clearInterval(interval);
    }, [selectedLevel, displayIdx]);

    useEffect(() => {
        if (!scrollRef.current || !isExpanded) return;
        const targetElement = scrollRef.current.querySelector(`.${styles.statusSelected}, .${styles.statusPassed}:last-of-type`) as HTMLElement | null;
        if (targetElement) {
            setTimeout(() => {
                if (scrollRef.current) {
                    const containerWidth = scrollRef.current.clientWidth;
                    const scrollTo = targetElement.offsetLeft - containerWidth / 2 + targetElement.clientWidth / 2;
                    scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
                }
            }, 300);
        }
    }, [displayIdx, isExpanded]);

    // Effect này trước đây gây ra cảnh báo ESLint
    useEffect(() => {
        const targetIdx = selectedLevel ? LEVELS.indexOf(selectedLevel) : -1;
        if (displayIdx === targetIdx && targetIdx !== -1) {
            if (timerRef.current) clearTimeout(timerRef.current);

            if (shouldAutoClose.current) {
                timerRef.current = setTimeout(() => {
                    handleToggleExpand(false, false);
                    timerRef.current = null;
                }, 2500);
            }
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [displayIdx, selectedLevel, handleToggleExpand]);

    // ------------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------------

    const handleNodeClick = (e: React.MouseEvent, lv: string) => {
        e.stopPropagation();
        if (!onLevelSelect) return;

        shouldAutoClose.current = true;

        setBouncingLevel(lv);
        setTimeout(() => setBouncingLevel(null), 500);

        const newLevel = selectedLevel === lv ? '' : lv;
        onLevelSelect(newLevel);

        if (newLevel) {
            sessionStorage.setItem(SESSION_KEY, newLevel);
            handleToggleExpand(true, false);
        } else {
            sessionStorage.removeItem(SESSION_KEY);
            handleToggleExpand(true, false);
        }
    };

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    const targetIdx = selectedLevel ? LEVELS.indexOf(selectedLevel) : -1;
    const selectedThemeConfig = selectedLevel ? LEVEL_CONFIG[selectedLevel] : null;

    return (
        <section className={styles.pathContainer}>
            <header className={styles.pathHeader} onClick={() => handleToggleExpand(undefined, true)}>
                <div className={styles.headerTitle}>
                    <div className={styles.iconBox}><Map size={24} strokeWidth={2} /></div>
                    <div className={styles.headerTextGroup}>
                        <h2 className={styles.title}>Cấp độ học</h2>
                        <div className={styles.subtitleWrapper}>
                            {selectedLevel ? (
                                <>
                                    <span className={styles.subtitleText}>Đã chọn:</span>
                                    <div className={styles.currentBadge} style={selectedThemeConfig ? { color: selectedThemeConfig.colorPrimary, backgroundColor: `${selectedThemeConfig.colorPrimary}1A`, borderColor: `${selectedThemeConfig.colorPrimary}33` } : undefined}>
                                        <Zap size={12} fill="currentColor" />
                                        <span>{selectedLevel}</span>
                                    </div>
                                </>
                            ) : <span className={styles.subtitleText}>Hãy chọn cấp độ</span>}
                        </div>
                    </div>
                </div>
                <button
                    className={styles.toggleButton}
                    onClick={(e) => { e.stopPropagation(); handleToggleExpand(undefined, true); }}
                    aria-label={isExpanded ? "Thu gọn lộ trình" : "Mở rộng lộ trình"}
                >
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
            </header>

            {isVisible && (
                <div className={`${styles.trackWrapper} ${isExpanded ? styles.trackExpanded : styles.trackCollapsed}`}>
                    <div className={`${styles.trackScroll} ${isMobile ? styles.trackScrollMobile : ''}`} ref={scrollRef}>
                        {courses.map((course, index) => {
                            const courseIdx = LEVELS.indexOf(course.lv);
                            const nodeState = getNodeState(courseIdx, displayIdx, targetIdx);

                            const themeConfig = ((nodeState === 'passed' || nodeState === 'selected') && selectedThemeConfig)
                                ? selectedThemeConfig
                                : (LEVEL_CONFIG[course.lv] || { theme: '', colorPrimary: '#4ade80' });

                            const nodeCircleDynamicStyle = (nodeState === 'selected' || nodeState === 'passed')
                                ? {
                                    backgroundColor: `${themeConfig.colorPrimary}1A`,
                                    borderColor: `${themeConfig.colorPrimary}33`
                                }
                                : undefined;

                            return (
                                <div key={course.id} className={`${styles.pathItem} ${nodeState === 'selected' ? styles.statusSelected : nodeState === 'passed' ? styles.statusPassed : styles.statusUnselected} ${themeConfig.theme}`}>
                                    <div className={`${styles.nodeWrapper} ${course.lv === bouncingLevel ? styles.nodeBounce : ''}`} onClick={(e) => handleNodeClick(e, course.lv)}>
                                        <div className={styles.nodeCircleOuter}>
                                            <div
                                                className={`${styles.nodeCircle} ${nodeState === 'selected' ? styles.nodeCircleSelected : nodeState === 'passed' ? styles.nodeCirclePassed : ''}`}
                                                style={nodeCircleDynamicStyle}
                                            >
                                                <LordIconNode nodeState={nodeState} colorPrimary={themeConfig.colorPrimary} />
                                            </div>
                                        </div>
                                        <div className={styles.nodeInfo}>
                                            <span
                                                className={styles.nodeLabel}
                                                style={nodeState === 'selected' ? { color: themeConfig.colorPrimary, fontWeight: '800' } : undefined}
                                            >
                                                {course.lv}
                                            </span>
                                        </div>
                                    </div>
                                    {index < courses.length - 1 && <div className={`${styles.connector} ${courseIdx < displayIdx ? styles.connectorActive : ''}`} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default LearningPath;