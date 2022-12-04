package torr

import (
	"errors"

	"github.com/anacrolix/torrent"
)

type Torrent struct {
	Title  string
	Poster string
	Data   string

	*torrent.TorrentSpec

	Timestamp int64
	Size      int64

	*torrent.Torrent
}

func NewTorrent(spec *torrent.TorrentSpec, client *torrent.Client) (*Torrent, error) {
	if client == nil {
		return nil, errors.New("missing torrent client")
	}

	return nil, nil
}
