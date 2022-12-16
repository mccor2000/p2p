package ws

type Message struct {
	from    *Client
	payload []byte
}

func NewMessage(from *Client, payload []byte) Message {
	return Message{
		from:    from,
		payload: payload,
	}
}
