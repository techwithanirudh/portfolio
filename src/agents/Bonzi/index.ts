import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import bonziImg from './map.png';

const Bonzi: AgentWrapper = {
    name: 'Bonzi',
    image: bonziImg,
    config: agent,
    soundMp3,
    soundOgg,
}

export default Bonzi;