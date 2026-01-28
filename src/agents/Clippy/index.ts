import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import clippyImg from './map.png';

const Clippy: AgentWrapper = {
    name: 'Clippy',
    image: clippyImg,
    config: agent,
    soundMp3,
    soundOgg,
}

export default Clippy;