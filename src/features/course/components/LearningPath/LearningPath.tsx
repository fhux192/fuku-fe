import React, { useRef, useEffect, useState } from 'react';
import { Map, Zap } from 'lucide-react';
import { Course } from '../../course.types';
import styles from './LearningPath.module.css';

interface LearningPathProps {
    courses: Course[];
    selectedLevel?: string;
    onLevelSelect?: (level: string) => void;
}

type NodeState = 'selected' | 'passed' | 'unselected';

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

const getNodeState = (courseIdx: number, displayIdx: number, targetIdx: number): NodeState => {
    if (displayIdx === -1) return 'unselected';
    if (courseIdx === targetIdx && displayIdx === targetIdx) return 'selected';
    if (courseIdx <= displayIdx) return 'passed';
    return 'unselected';
};

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
        el.setAttribute('trigger', nodeState === 'selected' ? 'loop' : 'none');
    }, [nodeState, colorPrimary]);
    // @ts-ignore
    return <lord-icon key={nodeState} ref={ref} />;
};

const LearningPath: React.FC<LearningPathProps> = ({ courses, selectedLevel, onLevelSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [displayIdx, setDisplayIdx] = useState<number>(-1);
    const [isMobile, setIsMobile] = useState(false);
    const [bouncingLevel, setBouncingLevel] = useState<string | null>(null);

    const handleNodeClick = (lv: string) => {
        if (!onLevelSelect) return;
        setBouncingLevel(lv);
        setTimeout(() => setBouncingLevel(null), 500);
        const newLevel = selectedLevel === lv ? '' : lv;
        onLevelSelect(newLevel);
        if (newLevel) sessionStorage.setItem(SESSION_KEY, newLevel);
        else sessionStorage.removeItem(SESSION_KEY);
    };

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
        if (!scrollRef.current) return;
        const targetElement = scrollRef.current.querySelector(`.${styles.statusSelected}, .${styles.statusPassed}:last-of-type`) as HTMLElement | null;
        if (targetElement) {
            const containerWidth = scrollRef.current.clientWidth;
            const scrollTo = targetElement.offsetLeft - containerWidth / 2 + targetElement.clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    }, [displayIdx]);

    const targetIdx = selectedLevel ? LEVELS.indexOf(selectedLevel) : -1;
    const selectedThemeConfig = selectedLevel ? LEVEL_CONFIG[selectedLevel] : null;

    return (
        <section className={styles.pathContainer}>
            <header className={styles.pathHeader}>
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
                            ) : <span className={styles.subtitleText}>Hãy chọn một cấp độ</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.trackWrapper}>
                <div className={`${styles.trackScroll} ${isMobile ? styles.trackScrollMobile : ''}`} ref={scrollRef}>
                    {courses.map((course, index) => {
                        const courseIdx = LEVELS.indexOf(course.lv);
                        const nodeState = getNodeState(courseIdx, displayIdx, targetIdx);
                        const themeConfig = ((nodeState === 'passed' || nodeState === 'selected') && selectedThemeConfig) ? selectedThemeConfig : (LEVEL_CONFIG[course.lv] || { theme: '', colorPrimary: '#4ade80' });

                        return (
                            <div key={course.id} className={`${styles.pathItem} ${nodeState === 'selected' ? styles.statusSelected : nodeState === 'passed' ? styles.statusPassed : styles.statusUnselected} ${themeConfig.theme}`}>
                                <div className={`${styles.nodeWrapper} ${course.lv === bouncingLevel ? styles.nodeBounce : ''}`} onClick={() => handleNodeClick(course.lv)}>
                                    <div className={styles.nodeCircleOuter}>
                                        <div className={`${styles.nodeCircle} ${nodeState === 'selected' ? styles.nodeCircleSelected : nodeState === 'passed' ? styles.nodeCirclePassed : ''}`}>
                                            <LordIconNode nodeState={nodeState} colorPrimary={themeConfig.colorPrimary} />
                                        </div>
                                    </div>
                                    <div className={styles.nodeInfo}><span className={styles.nodeLabel}>{course.lv}</span></div>
                                </div>
                                {index < courses.length - 1 && <div className={`${styles.connector} ${courseIdx < displayIdx ? styles.connectorActive : ''}`} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LearningPath;