import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                trigger?: string;
                colors?: string;
                delay?: string | number;
                state?: string;
                style?: React.CSSProperties;
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
