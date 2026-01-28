import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import genieImg from './map.png';

const Genie: AgentWrapper = {
    name: 'Genie',
    image: genieImg,
    config: agent,
    soundMp3,
    soundOgg,
}

export default Genie;