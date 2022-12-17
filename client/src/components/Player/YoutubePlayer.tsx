import YouTube, { YouTubeProps } from "react-youtube"

export const YoutubePlayer = ({ id }: { id: string }) => {
    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
    }

    return (
        <YouTube
            videoId={id}
            opts={opts}
            onReady={(e) => e.target.pauseVideo()}
        />
    )
}