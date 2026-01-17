import { useState, useCallback } from 'react';

/**
 * Extracted selection logic to separate concerns and enable reuse
 * Also ensures selection state can be easily synced with URL params later
 */
export const useCourseSelection = (initialCourse: string | null = null) => {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(initialCourse);

    // useCallback prevents function recreation on every render
    // reducing unnecessary re-renders in child components
    const selectCourse = useCallback((id: string) => {
        setSelectedCourse(id);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedCourse(null);
    }, []);

    const isSelected = useCallback((id: string) => selectedCourse === id, [selectedCourse]);

    return {
        selectedCourse,
        selectCourse,
        clearSelection,
        isSelected,
    };
};