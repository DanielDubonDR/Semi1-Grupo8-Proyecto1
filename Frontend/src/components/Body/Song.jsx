function Song({order, track}){
    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4">
                <p>{order +1}</p>
                <img 
                className="h-10 w-10" 
                src="https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/22/c8/9f/22c89f2d-9989-1996-c608-36e089a3767d/18UMGIM23645.rgb.jpg/1200x1200bb.jpg" 
                alt="" 
                />

                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{track.name}</p>
                    <p>{track.artist}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 hidden md:inline">{track.album}</p>
                <p>{track.duration}</p>
            </div>
        </div>
    )
}

export default Song;