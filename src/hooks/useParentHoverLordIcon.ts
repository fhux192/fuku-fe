// ============================================================================
// src/hooks/useParentHoverLordIcon.ts
// ============================================================================
import { useEffect } from 'react';
import { LordIconElement } from '../types/lordicon';

export const playLordIcon = (iconEl: LordIconElement | null) => {
    if (!iconEl?.playerInstance) return;
    iconEl.playerInstance.stop();
    iconEl.playerInstance.play();
};

export const useParentHoverLordIcon = (
    parentRefs: React.MutableRefObject<Record<string, HTMLElement | null>>,
    iconRefs: React.MutableRefObject<Record<string, LordIconElement | null>>,
    keys: string[]
) => {
    useEffect(() => {
        const cleanupFns: (() => void)[] = [];
        const timeoutId = setTimeout(() => {
            keys.forEach(key => {
                const parent = parentRefs.current[key];
                const icon = iconRefs.current[key];
                if (!parent || !icon) return;
                const handleMouseEnter = () => playLordIcon(icon);
                parent.addEventListener('mouseenter', handleMouseEnter);
                cleanupFns.push(() => parent.removeEventListener('mouseenter', handleMouseEnter));
            });
        }, 300);
        return () => {
            clearTimeout(timeoutId);
            cleanupFns.forEach(fn => fn());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys.join(',')]);
};