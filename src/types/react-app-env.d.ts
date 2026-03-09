/// <reference types="react-scripts" />

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const content: { [key: string]: string };
    export default content;
}

declare namespace JSX {
    interface IntrinsicElements {
        'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            src?: string;
            trigger?: string;
            colors?: string;
            delay?: string | number;
            state?: string;
            style?: React.CSSProperties;
            class?: string;
        };
    }
}

// ----------------------------------------------------------------------------
// Font Files
// ----------------------------------------------------------------------------

declare module '*.woff' {
    const src: string;
    export default src;
}

declare module '*.woff2' {
    const src: string;
    export default src;
}

declare module '*.ttf' {
    const src: string;
    export default src;
}