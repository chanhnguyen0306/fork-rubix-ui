package ping

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"net"
	"strings"
	"time"
)

func CheckHTTP(address string) string {
	if !strings.HasPrefix(address, "http://") && !strings.HasPrefix(address, "https://") {
		return "http://" + address
	}
	return address
}

func Do(url string, port int) (found bool) {
	ip := fmt.Sprintf("%s:%d", url, port)
	conn, err := net.DialTimeout("tcp", ip, 300*time.Millisecond)
	if err == nil {
		conn.Close()
		return true
	}
	logrus.Errorln("run task ping error:", err)
	return false
}
