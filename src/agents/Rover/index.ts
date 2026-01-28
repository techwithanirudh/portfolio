import { AgentWrapper } from '../../types';
import { agent } from './agent';
import { soundMp3 } from './sounds-mp3';
import { soundOgg } from './sounds-ogg';
import  roverImg  from './map.png'; 

const Rover: AgentWrapper = {
    name: 'Rover',
    image: roverImg,
    config: agent,
    soundMp3,
    soundOgg,
}

export default Rover;