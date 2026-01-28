import type Agent from './agent'

export type AgentType = 'Clippy' | 'Bonzi' | 'F1' | 'Genie' | 'Genius' | 'Links' | 'Merlin' | 'Peedy' | 'Rocky' | 'Rover';
export interface AgentConfig {
    overlayCount: number;
    framesize: Array<number>;
    sounds: Array<string>;
    animations: Record<string, ClippyAnimation>;
}

export interface AgentWrapper {
    name: string;
    image: string;
    config: AgentConfig;
    soundMp3: Record<string, string>;
    soundOgg: Record<string, string>;
}


export interface ClippyBranch {
    branches?: Array<string>;
    frameIndex: number;
    weight: number;
}

export interface ClippyFrame {
    images?: Array<Array<number>>;
    duration?: number;
    branching?: {
        branches: Array<ClippyBranch>
    },
    useExitBranching?: boolean;
    exitBranch?: number;
    sound?: any;
}

export interface ClippyAnimation {
    useExitBranching?: boolean;
    frames: Array<ClippyFrame>;
}

export interface ClippySound {
    name: string;
    index: string;
    data: string;
}

export interface LoadOptions {
    name: string;
    successCb?: (agent: Agent) => void;
    failCb?: (error: any) => void;
    selector?: string;
}

export interface Clippy {
    load: (data: LoadOptions) => void;
    agents: Record<AgentType, AgentWrapper>;
}

declare global {
    interface Window {
        clippy: Clippy
    }
}