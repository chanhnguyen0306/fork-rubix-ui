package humanize

import (
	"fmt"
	"testing"
)

type name struct {
	AA string `json:"im_aa"`
	BB string `json:"ImBB"`
	CC string `json:"imCC"`
	DD string `json:"im dd"`
}

func TestHumanize(t *testing.T) {

	fmt.Println(Humanize(name{AA: "hey", BB: "hey", CC: "hey", DD: "hey"}))

}
