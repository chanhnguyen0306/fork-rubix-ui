package title

import (
	"strings"
	"unicode"
)

func isWhitespace(r rune) bool {
	result := false
	switch r {
	case
		'\u0009', // horizontal tab
		'\u000A', // line feed
		'\u000B', // vertical tab
		'\u000C', // form feed
		'\u000D', // carriage return
		'\u0020', // space
		'\u0085', // next line
		'\u00A0', // no-break space
		'\u1680', // ogham space mark
		'\u180E', // mongolian vowel separator
		'\u2000', // en quad
		'\u2001', // em quad
		'\u2002', // en space
		'\u2003', // em space
		'\u2004', // three-per-em space
		'\u2005', // four-per-em space
		'\u2006', // six-per-em space
		'\u2007', // figure space
		'\u2008', // punctuation space
		'\u2009', // thin space
		'\u200A', // hair space
		'\u2028', // line separator
		'\u2029', // paragraph separator
		'\u202F', // narrow no-break space
		'\u205F', // medium mathematical space
		'\u3000': // ideographic space
		result = true
	default:
		result = false
	}
	return result
}

func toTitleCase(s string) string {
	prev := ' '
	result := strings.Map(
		func(r rune) rune {
			if isWhitespace(prev) || '_' == prev || '-' == prev {
				prev = r
				return unicode.ToTitle(r)
			} else {
				prev = r
				return unicode.ToLower(r)
			}
		},
		s)
	return result
}

func TitleCaseNoSpace(s string) string {
	prev := ' '
	result := strings.Map(
		func(r rune) rune {
			if isWhitespace(prev) || '_' == prev || '-' == prev {
				prev = r
				return unicode.ToTitle(r)
			} else {
				prev = r
				return unicode.ToLower(r)
			}
		},
		s)
	result = strings.Replace(result, "-", "", -1)
	return result
}
