import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import geniusImg from './map.png';

const Genius: AgentWrapper = {
    name: 'Genius',
    image: geniusImg,
    config: agent,
    soundMp3,
    soundOgg,
}

export default Genius;