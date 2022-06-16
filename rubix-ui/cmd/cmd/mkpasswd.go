package cmd

import (
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/na4ma4/config"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

var cmdMakePassword = &cobra.Command{
	Use:    "pass <username> [password]",
	Short:  "Generate a compatible hash for the legacy password",
	Run:    makePasswordCommand,
	Args:   cobra.MinimumNArgs(1),
	Hidden: true,
}

func init() {
	rootCmd.AddCommand(cmdMakePassword)
}

// Added for future legacy support of bcrypted passwords
func makePasswordCommand(cmd *cobra.Command, args []string) {
	cfg := config.NewViperConfigFromViper(viper.GetViper(), "auth-proxy")

	username := args[0]
	password := ""

	if len(args) > 1 {
		// Password was specified on the command line
		password = args[1]
	} else {
		// Ask for password at prompt
		prompt := promptui.Prompt{
			Label: "Enter Password: ",
			Mask:  '*',
		}
		var err error

		if password, err = prompt.Run(); err != nil {
			fmt.Println("password entry failure", zap.Error(err))
			return
		}
	}

	pw, err := bcrypt.GenerateFromPassword([]byte(password), cfg.GetInt("auth.mincost"))
	if err != nil {
		fmt.Println("generate password failure", zap.Error(err))
	}

	fmt.Printf("%s:%s\n", username, pw)
}
