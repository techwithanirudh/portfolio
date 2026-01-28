import Agent from './agent'
import { agents } from './agents';
import { AgentWrapper, LoadOptions } from './types';

export const load = (options: LoadOptions) => {
    const {
        name,
        successCb,
        failCb,
        selector,
    } = options || {};

    // wrapper to the success callback
    agents[name]().then((agentConfig: AgentWrapper) => {
        const a = new Agent({
            agent: agentConfig,
            selector
        });
        if (successCb) successCb(a);
    }).catch((error: any) => {
        if (failCb) failCb(error);
    });

}