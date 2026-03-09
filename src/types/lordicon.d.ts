// ============================================================================
// src/types/lordicon.d.ts
// ============================================================================
import * as React from 'react';

export interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        stop: () => void;
        isPlaying: boolean;
    };
}

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                trigger?: string;
                colors?: string;
                delay?: string | number;
                state?: string;
                style?: React.CSSProperties;
                ref?: React.Ref<LordIconElement | null>;
                class?: string;
            };
        }
    }
}

declare module '@lordicon/element' {
    export function defineElement(loader?: any): void;
    export class Element extends HTMLElement {
        playerInstance?: {
            play: () => void;
            isPlaying: boolean;
        };
        static defineTrigger(name: string, trigger: any): void;
    }
}

declare module 'lottie-web' {
    const lottie: any;
    export default lottie;
}