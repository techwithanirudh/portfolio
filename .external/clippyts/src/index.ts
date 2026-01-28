import type Agent from './agent'
import type Animator from './animator'
import type Queue from './queue'
import type Balloon from './balloon'
import { load } from './load'
import { AgentType, AgentWrapper, Clippy } from './types'
import "./clippy.css";

const clippy: Clippy = {
    load,
    agents: {} as Record<AgentType, AgentWrapper>,
}

export type { Agent, Animator, Queue, Balloon };
export default clippy;
