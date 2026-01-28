import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import f1Img from './map.png';

const F1: AgentWrapper = {
    name: 'F1',
    image: f1Img,
    config: agent,
    soundMp3,
    soundOgg,
}

export default F1;