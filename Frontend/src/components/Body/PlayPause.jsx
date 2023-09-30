import { FaPlayCircle } from 'react-icons/fa'

const PlayPause = ({handlePlay}) => (
    <FaPlayCircle 
    size={35}
    className='text-gray-300'
    onClick={handlePlay}
    />
)

export default PlayPause