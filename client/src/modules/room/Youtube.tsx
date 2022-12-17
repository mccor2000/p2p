import { useRef, useState } from "react"
import { YoutubePlayer } from "../../components/Player"


export const Youtube = () => {
  const videoUrl = useRef<string>("")
  const [videoID, setVideoID] = useState<string>("")

  const play = () => {
    setVideoID(videoUrl.current.split("=")[1])
  }

  return (
    <>
      <YoutubePlayer id={videoID} />
      <input
        type="text"
        placeholder="video link"
        value={videoUrl.current}
        onChange={e => videoUrl.current = e.target.value} />
      <button onClick={play}>Load video</button> */
    </>
  )

} 