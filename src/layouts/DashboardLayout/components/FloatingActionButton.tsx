// ============================================================================
// FloatingActionButton.tsx
// ============================================================================
import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from '../DashboardLayout.module.css';
import { useParentHoverLordIcon } from '../../../hooks/useParentHoverLordIcon';
import { LordIconElement } from '../../../types/lordicon';

export interface FabAction {
    id: string;
    icon: string;
    label: string;
    color: string;
    onClick: () => void;
}

interface FloatingActionButtonProps {
    actions: FabAction[];
    isVisible: boolean;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ actions, isVisible, showToast }) => {
    const [isFabOpen, setIsFabOpen] = useState(false);
    const fabRef = useRef<HTMLDivElement>(null);

    const fabParentRefs = useRef<Record<string, HTMLElement | null>>({});
    const fabIconRefs = useRef<Record<string, LordIconElement | null>>({});
    const fabIds = actions.map(action => action.id);

    useParentHoverLordIcon(fabParentRefs, fabIconRefs, fabIds);

    const toggleFab = useCallback(() => setIsFabOpen(prev => !prev), []);

    const handleActionClick = useCallback((action: FabAction) => {
        action.onClick();
        setIsFabOpen(false);
        showToast(`Đã chọn: ${action.label}`, 'info');
    }, [showToast]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
                setIsFabOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className={`${styles.fabContainer} ${isVisible ? styles.fabVisible : styles.fabHidden}`} ref={fabRef}>
                <div className={`${styles.fabActions} ${isFabOpen ? styles.fabActionsOpen : ''}`}>
                    {actions.map((action) => (
                        <button key={action.id} ref={(el) => { fabParentRefs.current[action.id] = el; }} className={styles.fabActionBtn} onClick={() => handleActionClick(action)}>
                            <div className={styles.fabActionIcon}>
                                
                                <lord-icon ref={(el: LordIconElement) => { fabIconRefs.current[action.id] = el; }} src={action.icon} trigger="hover" colors={`primary:${action.color}`} style={{ width: '32px', height: '32px' }} />
                            </div>
                            <span className={styles.fabActionLabel}>{action.label}</span>
                        </button>
                    ))}
                </div>
                <button className={`${styles.fabMainBtn} ${isFabOpen ? styles.fabMainBtnOpen : ''}`} onClick={toggleFab} aria-label={isFabOpen ? 'Đóng menu liên hệ' : 'Mở menu liên hệ'} aria-expanded={isFabOpen}>
                    <div className={styles.fabMainIcon}>
                        
                        <lord-icon src="https://cdn.lordicon.com/daeumrty.json" trigger="click" style={{ width: '70px', height: '70px' }} />
                    </div>
                    <div className={styles.fabPulse} />
                </button>
            </div>
            {isFabOpen && <div className={styles.fabOverlay} onClick={() => setIsFabOpen(false)} aria-hidden="true" />}
        </>
    );
};

export default FloatingActionButton;