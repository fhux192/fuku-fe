/// <reference types="react-scripts" />

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const content: { [key: string]: string };
    export default content;
}

// ----------------------------------------------------------------------------
// Audio Files
// ----------------------------------------------------------------------------

declare module '*.mp3' {
    const src: string;
    export default src;
}

declare module '*.wav' {
    const src: string;
    export default src;
}

declare module '*.ogg' {
    const src: string;
    export default src;
}

// ----------------------------------------------------------------------------
// Image Files
// ----------------------------------------------------------------------------

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

// ----------------------------------------------------------------------------
// Video Files
// ----------------------------------------------------------------------------

declare module '*.mp4' {
    const src: string;
    export default src;
}

declare module '*.webm' {
    const src: string;
    export default src;
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