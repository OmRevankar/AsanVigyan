import astronaut from '../Assets/astronaut.png'
import bear from '../Assets/bear.png'
import chicken from '../Assets/chicken.png'
import giraffe from '../Assets/giraffe.png'
import knight from '../Assets/knight.png'
import meerkat from '../Assets/meerkat.png'
import ninja from '../Assets/ninja.png'
import panda from '../Assets/panda.png'
import rabbit from '../Assets/rabbit.png'
import robot from '../Assets/robot.png'

const avatarFunction = (avatar) => {
  switch (avatar) {
    case 'astronaut':
      return astronaut
    case 'bear':
      return bear
    case 'chicken':
      return chicken
    case 'giraffe':
      return giraffe
    case 'knight':
      return knight
    case 'meerkat':
      return meerkat
    case 'ninja':
      return ninja
    case 'panda':
      return panda
    case 'rabbit':
      return rabbit
    case 'robot':
      return robot
    default:
      return null;
  }
}

export {avatarFunction}