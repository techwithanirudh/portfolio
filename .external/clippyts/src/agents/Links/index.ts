import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import linksImg from './map.png';

const Links: AgentWrapper = {
    name: 'Links',
    image: linksImg,
    config: agent,
    soundMp3,
    soundOgg,
}

export default Links;