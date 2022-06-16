package cmd

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use: "proxy",
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
	}
}

func init() {

}
