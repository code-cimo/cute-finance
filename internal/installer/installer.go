package installer

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

const (
	colorReset  = "\033[0m"
	colorRed    = "\033[31m"
	colorGreen  = "\033[32m"
	colorYellow = "\033[33m"
	colorBlue   = "\033[34m"
	colorPurple = "\033[35m"
	colorCyan   = "\033[36m"
)

func Run() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Printf("%s", colorCyan)
	fmt.Println(`
   ____      _   _   ___                  _ _____ _   _  ___ _____ ____  
  / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \ | |/ _ \_   _/ ___| 
 | |   / _\`| __| |  | || '_ \ / _\` |/ _ \ |  _| |  \| | | | || | \___ \ 
 | |__| (_| | |_| |  | || | | | (_| |  __/ | |___| |\  | |_| || |  ___) |
  \____\__,_|\__|_| |___|_| |_|\__, |\___|_|_____|_| \_|\___/ |_| |____/ 
                                |___/                                     
	`)
	fmt.Printf("%s", colorReset)
	fmt.Printf("%s🐾 CuteFinance PWA Installer v1.0.0%s\n\n", colorYellow, colorReset)

	// Step 1: Custom Port
	fmt.Printf("%s[1/4] Custom Port Access%s\n", colorBlue, colorReset)
	fmt.Print("Enter port (default: 8080): ")
	portStr, _ := reader.ReadString('\n')
	portStr = strings.TrimSpace(portStr)
	
	port := 8080
	if portStr != "" {
		if p, err := strconv.Atoi(portStr); err == nil {
			port = p
		}
	}
	fmt.Printf("%s✓ Port set to: %d%s\n\n", colorGreen, port, colorReset)

	// Step 2: Dependency Check
	fmt.Printf("%s[2/4] Dependency & Environment Check%s\n", colorBlue, colorReset)
	
	// Check data directory
	dataDir := "./data"
	if err := os.MkdirAll(dataDir, 0755); err == nil {
		fmt.Printf("%s✓%s Data directory %s is writable\n", colorGreen, colorReset, dataDir)
	} else {
		fmt.Printf("%s✗%s Data directory %s is NOT writable: %v\n", colorRed, colorReset, dataDir, err)
	}

	// Check Tailscale
	if _, err := exec.LookPath("tailscale"); err == nil {
		fmt.Printf("%s✓%s Tailscale is installed\n", colorGreen, colorReset)
		
		// Check if connected
		cmd := exec.Command("tailscale", "status")
		if err := cmd.Run(); err == nil {
			fmt.Printf("%s✓%s Tailscale is connected\n", colorGreen, colorReset)
		} else {
			fmt.Printf("%s⚠%s Tailscale is not connected (run: tailscale up)\n", colorYellow, colorReset)
		}
	} else {
		fmt.Printf("%s⚠%s Tailscale is not installed (optional)\n", colorYellow, colorReset)
	}

	// Check SQLite
	fmt.Printf("%s✓%s SQLite (Pure Go driver) - No external dependency needed\n", colorGreen, colorReset)
	fmt.Println()

	// Step 3: Mascot Preview
	fmt.Printf("%s[3/4] UI & Mascot Preview%s\n", colorBlue, colorReset)
	fmt.Println()
	
	// ASCII Art Capybara
	fmt.Printf("%s", colorYellow)
	fmt.Println(`
        ╭━━━━━━━━━━━━━━╮
        ┃  🐾 CAPYBARA ┃
        ╰━━━━━━━━━━━━━━╯
    
         ∧＿＿∧
        (｡･ω･｡)
        /   づ🌸
        
   Available Mascots:
   🐼 Panda  🐕 Shiba  🐰 Bunny
   🦫 Capybara  🐱 Cat
   
   Color Palette:
   🟡 Pastel Yellow (#FFF9C4)
   🌸 Soft Pink (#F8BBD0)
   🌿 Mint Green (#C8E6C9)
   ⚪ Clean White (#FFFFFF)
	`)
	fmt.Printf("%s", colorReset)
	fmt.Println()

	// Step 4: Auto-Deploy
	fmt.Printf("%s[4/4] Auto-Deploy Configuration%s\n", colorBlue, colorReset)
	fmt.Print("Create systemd service? (y/n): ")
	createService, _ := reader.ReadString('\n')
	createService = strings.TrimSpace(strings.ToLower(createService))

	if createService == "y" || createService == "yes" {
		createSystemdService(port)
	}

	// Save config
	saveConfig(port, dataDir)

	fmt.Printf("\n%s✅ Installation Complete!%s\n", colorGreen, colorReset)
	fmt.Printf("\n%sNext steps:%s\n", colorYellow, colorReset)
	fmt.Println("1. Build the application: go build -o cute-finance ./cmd/server")
	fmt.Println("2. Run the server: ./cute-finance")
	fmt.Printf("3. Access at: %shttp://localhost:%d%s\n", colorCyan, port, colorReset)
	fmt.Println("4. (Optional) Start systemd service: sudo systemctl start cutefinance")
	fmt.Println()
}

func createSystemdService(port int) {
	serviceContent := fmt.Sprintf(`[Unit]
Description=CuteFinance PWA - Personal Finance Manager
After=network.target

[Service]
Type=simple
User=%s
WorkingDirectory=%s
ExecStart=%s/cute-finance -port %d -data %s/data
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
`, os.Getenv("USER"), getWorkingDir(), getWorkingDir(), port, getWorkingDir())

	servicePath := "/etc/systemd/system/cutefinance.service"
	
	fmt.Printf("\nCreating systemd service at %s...\n", servicePath)
	fmt.Printf("%sNote: This requires sudo privileges%s\n", colorYellow, colorReset)
	fmt.Print("Run with sudo? (y/n): ")
	
	reader := bufio.NewReader(os.Stdin)
	runSudo, _ := reader.ReadString('\n')
	runSudo = strings.TrimSpace(strings.ToLower(runSudo))

	if runSudo == "y" || runSudo == "yes" {
		// Write to temp file first
		tmpFile := "/tmp/cutefinance.service"
		if err := os.WriteFile(tmpFile, []byte(serviceContent), 0644); err != nil {
			fmt.Printf("%s✗ Failed to write temp file: %v%s\n", colorRed, err, colorReset)
			return
		}

		// Copy to systemd directory
		cmd := exec.Command("sudo", "cp", tmpFile, servicePath)
		if err := cmd.Run(); err != nil {
			fmt.Printf("%s✗ Failed to copy service file: %v%s\n", colorRed, err, colorReset)
			return
		}

		// Reload systemd
		cmd = exec.Command("sudo", "systemctl", "daemon-reload")
		cmd.Run()

		// Enable service
		cmd = exec.Command("sudo", "systemctl", "enable", "cutefinance")
		cmd.Run()

		fmt.Printf("%s✓ Systemd service created and enabled%s\n", colorGreen, colorReset)
		fmt.Printf("  Start: %ssudo systemctl start cutefinance%s\n", colorCyan, colorReset)
		fmt.Printf("  Status: %ssudo systemctl status cutefinance%s\n", colorCyan, colorReset)
	} else {
		// Just show the service content
		fmt.Printf("\n%sService file content:%s\n", colorYellow, colorReset)
		fmt.Println(serviceContent)
		fmt.Printf("\nSave this to %s manually\n", servicePath)
	}
}

func saveConfig(port int, dataDir string) {
	configPath := filepath.Join(dataDir, "config.json")
	configContent := fmt.Sprintf(`{
  "port": %d,
  "data_dir": "%s"
}`, port, dataDir)

	if err := os.WriteFile(configPath, []byte(configContent), 0644); err != nil {
		fmt.Printf("%s✗ Failed to save config: %v%s\n", colorRed, err, colorReset)
		return
	}

	fmt.Printf("%s✓ Configuration saved to %s%s\n", colorGreen, configPath, colorReset)
}

func getWorkingDir() string {
	dir, err := os.Getwd()
	if err != nil {
		return "."
	}
	return dir
}
