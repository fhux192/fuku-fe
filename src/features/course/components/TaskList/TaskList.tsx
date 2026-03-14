import React, { useEffect, useState, useRef, useMemo } from 'react';
import { BookOpen, RefreshCw, Play, Zap, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './TaskList.module.css';
import { useParentHoverLordIcon } from '../../../../hooks/useParentHoverLordIcon';
import { LordIconElement } from '../../../../types/lordicon';
import TaskRequirementModal from '../TaskRequirementModal/TaskRequirementModal';

export type TaskStatus = 'completed' | 'in_progress' | 'not_started';

export interface Task {
    id: string;
    code: string;
    title: string;
    status: TaskStatus;
    score?: number;
    level?: string;
}

interface TaskListProps {
    tasks: Task[];
    selectedTaskId?: string;
    onTaskSelect?: (taskId: string) => void;
    selectedLevel?: string;
}

const SESSION_KEY = 'fuku_taskList_selectedTask';
const TASKS_PER_PAGE = 16;

const LEVEL_COLORS: Record<string, string> = {
    'IELTS 4.0': '#4ade80',
    'IELTS 5.0': '#3b82f6',
    'IELTS 6.0': '#a855f7',
    'IELTS 6.5': '#f43f5e',
    'IELTS 7.0': '#eab308',
    'IELTS 7.5': '#f97316',
    'IELTS 8.0': '#14b8a6',
};

const AVATAR_OPTIONS = [
    'https://cdn.lordicon.com/dznelzdk.json',
    'https://cdn.lordicon.com/czcsywgo.json',
    'https://cdn.lordicon.com/ajzwsrcs.json',
    'https://cdn.lordicon.com/sgtmgpft.json',
    'https://cdn.lordicon.com/edplgash.json',
    "https://cdn.lordicon.com/nwfpiryp.json",
    "https://cdn.lordicon.com/rhmhivzj.json",
    "https://cdn.lordicon.com/hwfggmas.json",
    "https://cdn.lordicon.com/bhvzarpg.json",
    "https://cdn.lordicon.com/uvhtrvux.json",
    "https://cdn.lordicon.com/vqkaxtlm.json",
    "https://cdn.lordicon.com/emjmgjnt.json",
    "https://cdn.lordicon.com/qaeqyqcc.json",
    "https://cdn.lordicon.com/tzovitfd.json",
    "https://cdn.lordicon.com/drdlomqk.json",
    "https://cdn.lordicon.com/snsyzslg.json",
    "https://cdn.lordicon.com/gcpjssdi.json",
    "https://cdn.lordicon.com/ejdrjrvy.json",
    "https://cdn.lordicon.com/tdbbbqzo.json",
    "https://cdn.lordicon.com/jlhrsjqp.json",
    "https://cdn.lordicon.com/cadyhyeo.json",
    "https://cdn.lordicon.com/etuixrny.json"
];

const TaskList: React.FC<TaskListProps> = ({
                                               tasks,
                                               selectedTaskId,
                                               onTaskSelect,
                                               selectedLevel,
                                           }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showRequirementModal, setShowRequirementModal] = useState(false);
    const [modalTask, setModalTask] = useState<Task | null>(null);
    const [modalIconSrc, setModalIconSrc] = useState<string>('');

    const searchWrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLElement>(null);

    const cardParentRefs = useRef<Record<string, HTMLElement | null>>({});
    const iconRefs = useRef<Record<string, LordIconElement | null>>({});

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const completedCount = filteredTasks.filter(t => t.status === 'completed').length;
    const totalTasks = filteredTasks.length;
    const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    const isDefault = !selectedLevel;
    const headerColor = isDefault ? '#ffffff' : (LEVEL_COLORS[selectedLevel!] || '#64748b');

    const gridTasks = filteredTasks.filter(task => task.status !== 'in_progress');

    const totalPages = Math.ceil(gridTasks.length / TASKS_PER_PAGE);
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    const paginatedTasks = gridTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

    const visibleTaskIds = useMemo(() =>
            paginatedTasks
                .filter(task => task.status !== 'completed')
                .map(t => t.id),
        [paginatedTasks]
    );

    useParentHoverLordIcon(cardParentRefs, iconRefs, visibleTaskIds);

    useEffect(() => {
        const currentIds = new Set(visibleTaskIds);
        Object.keys(cardParentRefs.current).forEach(id => {
            if (!currentIds.has(id)) {
                cardParentRefs.current[id] = null;
                delete cardParentRefs.current[id];
            }
        });
        Object.keys(iconRefs.current).forEach(id => {
            if (!currentIds.has(id)) {
                iconRefs.current[id] = null;
                delete iconRefs.current[id];
            }
        });
    }, [visibleTaskIds]);

    useEffect(() => {
        const savedTask = sessionStorage.getItem(SESSION_KEY);
        if (savedTask && !selectedTaskId && onTaskSelect) {
            const taskExists = tasks.find(t => t.id === savedTask);
            if (taskExists) {
                onTaskSelect(savedTask);
            }
        }
    }, [tasks, selectedTaskId, onTaskSelect]);

    const handleTaskClick = (task: Task, iconSrc: string) => {
        if (!onTaskSelect) return;
        if (task.status === 'completed') {
            onTaskSelect(task.id);
            sessionStorage.setItem(SESSION_KEY, task.id);
        } else {
            setModalTask(task);
            setModalIconSrc(iconSrc);
            setShowRequirementModal(true);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchFocus = () => {
        // Chỉ tự động scroll khi trên thiết bị di động (chiều rộng <= 768px)
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            setTimeout(() => {
                if (searchWrapperRef.current) {
                    searchWrapperRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 150);
        }
    };

    const handleSearchBlur = () => {
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    };

    const getPageNumbers = (current: number, total: number) => {
        if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const handleStartTask = () => {
        if (modalTask && onTaskSelect) {
            onTaskSelect(modalTask.id);
            sessionStorage.setItem(SESSION_KEY, modalTask.id);
        }
        setShowRequirementModal(false);
        setModalTask(null);
    };

    return (
        <section className={styles.container} ref={containerRef}>
            <header className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <BookOpen size={24} strokeWidth={2} />
                    </div>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>Danh sách bài tập</h2>
                        <div
                            className={styles.currentBadge}
                            style={{
                                color: headerColor,
                                backgroundColor: `${headerColor}1A`,
                                borderColor: `${headerColor}33`
                            }}
                        >
                            <Zap size={12} fill={isDefault ? "none" : "currentColor"} />
                            <span>{selectedLevel || 'Phổ biến'}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.searchWrapper} ref={searchWrapperRef}>
                    <div className={styles.searchContainer}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài tập..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            </header>

            <div className={styles.progressWrapper}>
                <div className={styles.progressContainer}>
                    <div className={styles.progressText}>
                        <span>Tiến độ học tập</span>
                        <span className={styles.progressPercent} style={{ color: headerColor }}>
                            {completedCount}/{totalTasks}
                        </span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{
                                width: `${progressPercent}%`,
                                backgroundColor: headerColor
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.taskGrid}>
                {paginatedTasks.length === 0 ? (
                    <div className={styles.emptyState}>Không có bài tập phù hợp.</div>
                ) : (
                    paginatedTasks.map((task, index) => {
                        const isSelected = task.id === selectedTaskId;
                        const isCompleted = task.status === 'completed';

                        const currentTaskColor = (task.level && LEVEL_COLORS[task.level])
                            ? LEVEL_COLORS[task.level]
                            : (isDefault ? '#3b82f6' : headerColor);

                        const absoluteIndex = startIndex + index;
                        const iconSrc = AVATAR_OPTIONS[absoluteIndex % AVATAR_OPTIONS.length];

                        return (
                            <div
                                key={task.id}
                                ref={(el) => { cardParentRefs.current[task.id] = el; }}
                                className={`${styles.taskCard} ${isSelected ? styles.selected : ''} ${isCompleted ? styles.completedCard : ''}`}
                                onClick={() => handleTaskClick(task, iconSrc)}
                            >
                                <div className={styles.cardHeader}>
                                    <span
                                        className={styles.badgeCode}
                                        style={{
                                            color: isCompleted ? '#64748b' : currentTaskColor,
                                            backgroundColor: isCompleted ? 'rgba(148, 163, 184, 0.1)' : `${currentTaskColor}15`,
                                        }}
                                    >
                                        {task.code}
                                    </span>
                                    {isCompleted && task.score !== undefined && (
                                        <div className={styles.scoreTag}>
                                            <span>{task.score} Điểm</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.iconWrapper}>
                                    <lord-icon
                                        ref={(el: unknown) => { iconRefs.current[task.id] = el as LordIconElement; }}
                                        src={iconSrc}
                                        trigger={isCompleted ? undefined : "hover"}
                                        className={styles.lordIcon}
                                    />
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={`${styles.taskTitle} ${isCompleted ? styles.strikethrough : ''}`}>
                                        {task.title}
                                    </h3>
                                    {isCompleted ? (
                                        <div className={styles.stampCompleted}>ĐÃ HOÀN THÀNH</div>
                                    ) : (
                                        <p className={styles.statusLabel}>Chưa làm</p>
                                    )}
                                </div>

                                <div className={styles.cardFooter}>
                                    {isCompleted ? (
                                        <button className={styles.btnRetake}>
                                            <RefreshCw size={16} />
                                            <span>Làm lại</span>
                                        </button>
                                    ) : (
                                        <button className={styles.btnStart}>
                                            <Play size={16} fill="currentColor" />
                                            <span>Bắt đầu</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                        <span className={styles.pageText}>Trước</span>
                    </button>

                    <div className={styles.pageNumbers}>
                        {getPageNumbers(currentPage, totalPages).map((page, index) => (
                            <button
                                key={index}
                                className={`${styles.numberBtn} ${page === currentPage ? styles.activePage : ''} ${page === '...' ? styles.dots : ''}`}
                                onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                                disabled={page === '...'}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        className={styles.pageBtn}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <span className={styles.pageText}>Sau</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <TaskRequirementModal
                isOpen={showRequirementModal}
                onClose={() => {
                    setShowRequirementModal(false);
                    setModalTask(null);
                }}
                task={modalTask}
                iconSrc={modalIconSrc}
                onStartTask={handleStartTask}
            />
        </section>
    );
};

export default TaskList;