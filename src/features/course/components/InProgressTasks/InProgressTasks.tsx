import React from 'react';
import { Play, Zap } from 'lucide-react';
import styles from './InProgressTasks.module.css';

export type TaskStatus = 'completed' | 'in_progress' | 'not_started';

export interface Task {
    id: string;
    code: string;
    title: string;
    status: TaskStatus;
    score?: number;
    level?: string;
}

interface InProgressTasksProps {
    tasks: Task[];
    selectedTaskId?: string;
    onTaskSelect?: (taskId: string) => void;
}

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

const InProgressTasks: React.FC<InProgressTasksProps> = ({
                                                             tasks,
                                                             selectedTaskId,
                                                             onTaskSelect,
                                                         }) => {

    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');

    const handleTaskClick = (task: Task) => {
        if (!onTaskSelect) return;
        onTaskSelect(task.id);
        sessionStorage.setItem(SESSION_KEY, task.id);
    };

    if (inProgressTasks.length === 0) {
        return null;
    }

    const headerColor = '#eab308';

    return (
        <section className={styles.container}>
            <header className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <Play size={24} strokeWidth={2} fill="#ffffff" />
                    </div>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>Bài tập đang làm</h2>
                        <div
                            className={styles.currentBadge}
                            style={{
                                color: headerColor,
                                backgroundColor: `${headerColor}1A`,
                                borderColor: `${headerColor}33`
                            }}
                        >
                            <Zap size={12} fill="currentColor" />
                            <span>Chưa đạt yêu cầu</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.sliderContainer}>
                <div className={styles.sliderTrack}>
                    {inProgressTasks.map((task, index) => {
                        const isSelected = task.id === selectedTaskId;
                        const currentTaskColor = task.level && LEVEL_COLORS[task.level]
                            ? LEVEL_COLORS[task.level]
                            : '#3b82f6';

                        const iconSrc = AVATAR_OPTIONS[index % AVATAR_OPTIONS.length];

                        return (
                            <div
                                key={task.id}
                                className={`${styles.taskCard} ${isSelected ? styles.selected : ''}`}
                                onClick={() => handleTaskClick(task)}
                            >
                                <div className={styles.cardHeader}>
                                    <span
                                        className={styles.badgeCode}
                                        style={{
                                            color: currentTaskColor,
                                            backgroundColor: `${currentTaskColor}15`,
                                        }}
                                    >
                                        {task.code}
                                    </span>
                                </div>

                                <div className={styles.iconWrapper}>
                                    <lord-icon
                                        src={iconSrc}
                                        trigger="hover"
                                        style={{ width: '90px', height: '90px' }}
                                    />
                                    <div className={styles.inProgressOverlay}>
                                        <div className={styles.overlayCircle}>
                                            <Play size={28} fill="white" color="white" />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.taskTitle}>
                                        {task.title}
                                    </h3>
                                    <p className={styles.statusLabel}>Đang làm</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default InProgressTasks;