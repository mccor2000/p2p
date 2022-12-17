// import { useEffect, useState } from "react";
// import { validateLocaleAndSetLanguage } from "typescript";
// import {
//   WebTorrent,
//   Torrent,
//   TorrentFile,
//   Instance as WebTorrentInstance,
// } from "webtorrent";
// import config from "./config";
// const webtorrent: WebTorrent = require("webtorrent/webtorrent.min.js");

// const MEDIA_FILE_EXTENTIONS =
//   /.mkv$|.avi$|.mp4$|.wmv$|.vp8$|.mov$|.mpg$|.ts$|.m3u8$|.webm$|.flac$|.mp3$|.wav$|.wma$|.aac$|.ogg$/i;
// const SUBTITLES_FILE_EXTENIONS = /.rtc/;

// const getMovieFile = (files: TorrentFile[]) => {
//   console.log('add listners')
//   return files
//     .filter((f) => f.name.match(MEDIA_FILE_EXTENTIONS))
//     .reduce((result: TorrentFile | null, f) => {
//       if (!result) return f;

//       return result.length > f.length ? result : f;
//     }, null);
// };

// const getSubtitles = (files: TorrentFile[]) => {
//   return files.filter((f) => f.name.match(SUBTITLES_FILE_EXTENIONS));
// };

// const playVideo = (media: TorrentFile) => {
//   media.select();
//   media.appendTo("#player", { autoplay: true, controls: true });
// };

const Player = ({ torrentId }: { torrentId: string }) => {
  // const [video, setVideo] = useState<TorrentFile | null>();
  // const [subtitles, setSubtitles] = useState<TorrentFile[]>();

  // const client: WebTorrentInstance = new webtorrent(config.webtorrent);

  // useEffect(() => {
  //   const torrent = client.get(torrentId);

  //   if (torrent) {
  //     const files = torrent.files;
  //     setVideo(getMovieFile(files));
  //     // setSubtitles(getSubtitles(files));
  //   } else {
  //     client.add(torrentId, ({ files }: Torrent) => {
  //       setVideo(getMovieFile(files));
  //       // setSubtitles(getSubtitles(files));
  //     });
  //   }

  //   return () => {
  //     video?.removeAllListeners();
  //     subtitles?.forEach((f) => f.removeAllListeners());
  //     torrent?.removeAllListeners()
  //   };
  // }, []);

  return (
    <>
      <div id="player"></div>
      <div>
        {/* <h2>{video?.name}</h2>
        <button onClick={() => playVideo(video!)}>play</button> */}
      </div>
    </>
  );
};

// export default Player;
export * from "./YoutubePlayer"
