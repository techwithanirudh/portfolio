import { AgentType } from '../types';

function loadAgent (name: AgentType) {
    return new Promise<any>((resolve, reject) => {
        import(`./agents/${name}.js`).then(module => {
            resolve(module.default);
        }).catch(err => {
            reject(err);
        });
    });
}

export const agents: Record<string, any> = {
    Bonzi: () => loadAgent('Bonzi'),
    Clippy: () => loadAgent('Clippy'),
    F1: () => loadAgent('F1'),
    Genie: () => loadAgent('Genie'),
    Genius: () => loadAgent('Genius'),
    Links: () => loadAgent('Links'),
    Merlin: () => loadAgent('Merlin'),
    Peedy: () => loadAgent('Peedy'),
    Rocky: () => loadAgent('Rocky'),
    Rover: () => loadAgent('Rover'),
};