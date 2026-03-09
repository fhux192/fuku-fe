import React, { useEffect } from 'react';
import { BookOpen, RotateCcw, Play, Zap } from 'lucide-react';
import styles from './TaskList.module.css';

// ============================================================================
// Types & Interfaces
// ============================================================================

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

// ============================================================================
// Constants & Configurations
// ============================================================================

const SESSION_KEY = 'fuku_taskList_selectedTask';

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

// ============================================================================
// Main Component
// ============================================================================

const TaskList: React.FC<TaskListProps> = ({
                                               tasks,
                                               selectedTaskId,
                                               onTaskSelect,
                                               selectedLevel,
                                           }) => {

    // ------------------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------------------

    useEffect(() => {
        const savedTask = sessionStorage.getItem(SESSION_KEY);
        if (savedTask && !selectedTaskId && onTaskSelect) {
            const taskExists = tasks.find(t => t.id === savedTask);
            if (taskExists) {
                onTaskSelect(savedTask);
            }
        }
    }, [tasks, selectedTaskId, onTaskSelect]);

    // ------------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------------

    const handleTaskClick = (task: Task) => {
        if (!onTaskSelect) return;
        onTaskSelect(task.id);
        sessionStorage.setItem(SESSION_KEY, task.id);
    };

    // ------------------------------------------------------------------------
    // Logic
    // ------------------------------------------------------------------------

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    const isDefault = !selectedLevel;
    const headerColor = isDefault ? '#ffffff' : (LEVEL_COLORS[selectedLevel!] || '#94a3b8');

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    return (
        <section className={styles.container}>
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

                <div className={styles.progressContainer}>
                    <div className={styles.progressText}>
                        <span>Tiến độ học tập</span>
                        <span className={styles.progressPercent} style={{ color: headerColor }}>
                            {progressPercent}%
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
            </header>

            <div className={styles.taskGrid}>
                {tasks.length === 0 ? (
                    <div className={styles.emptyState}>Không có bài tập phù hợp.</div>
                ) : (
                    tasks.map((task, index) => {
                        const isSelected = task.id === selectedTaskId;
                        const isCompleted = task.status === 'completed';
                        const isInProgress = task.status === 'in_progress';

                        const currentTaskColor = (task.level && LEVEL_COLORS[task.level])
                            ? LEVEL_COLORS[task.level]
                            : (isDefault ? '#3b82f6' : headerColor);

                        const iconSrc = AVATAR_OPTIONS[index % AVATAR_OPTIONS.length];

                        return (
                            <div
                                key={task.id}
                                className={`${styles.taskCard} ${isSelected ? styles.selected : ''} ${isCompleted ? styles.completedCard : ''}`}
                                onClick={() => handleTaskClick(task)}
                            >
                                <div className={styles.cardHeader}>
                                    <span
                                        className={styles.badgeCode}
                                        style={{
                                            color: isCompleted ? '#94a3b8' : currentTaskColor,
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
                                        src={iconSrc}
                                        trigger="hover"
                                        style={{ width: '100px', height: '100px', filter: isCompleted ? 'grayscale(1)' : 'none' }}
                                    />
                                    {isInProgress && (
                                        <div className={styles.inProgressOverlay}>
                                            <div className={styles.overlayCircle}>
                                                <Play size={32} fill="white" color="white" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={`${styles.taskTitle} ${isCompleted ? styles.strikethrough : ''}`}>
                                        {task.title}
                                    </h3>
                                    {isCompleted ? (
                                        <div className={styles.stampCompleted}>ĐÃ HOÀN THÀNH</div>
                                    ) : (
                                        <p className={styles.statusLabel}>
                                            {isInProgress ? 'Đang làm' : 'Chưa làm'}
                                        </p>
                                    )}
                                </div>

                                <div className={styles.cardFooter}>
                                    {isCompleted ? (
                                        <button className={styles.btnRetake}>
                                            <RotateCcw size={16} />
                                            <span>Làm lại</span>
                                        </button>
                                    ) : isInProgress ? (
                                        <button className={styles.btnResume}>
                                            <Play size={16} fill="currentColor" />
                                            <span>Tiếp tục</span>
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
        </section>
    );
};

export default TaskList;