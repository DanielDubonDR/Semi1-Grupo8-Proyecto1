import { FaEye, FaPauseCircle } from 'react-icons/fa'

const PlayPause = ({ isPlaying, activeSong, song, handlePause, handlePlay}) => (isPlaying && activeSong?.title === song.name ? (
    <FaPauseCircle 
    size={35}
    className='text-gray-300'
    onClick={handlePause}
    />
) : (
    <FaEye 
    size={35}
    className='text-gray-300'
    onClick={handlePlay}
    />
))

export default PlayPause