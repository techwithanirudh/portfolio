import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import rockyImg from './map.png';

const Rocky: AgentWrapper = {
    name: 'Rocky',
    image: rockyImg,
    config: agent,
    soundMp3,
    soundOgg,
}
export default Rocky;