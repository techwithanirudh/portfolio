import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import peedyImg from './map.png';

const Peedy: AgentWrapper = {
    name: 'Peedy',
    image: peedyImg,
    config: agent,
    soundMp3,
    soundOgg,
}

export default Peedy;