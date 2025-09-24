#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup script to help configure Claude Desktop with the translate-server MCP
 */

function getClaudeConfigPath() {
  const platform = os.platform();

  if (platform === 'darwin') {
    // macOS
    return path.join(os.homedir(), 'Library/Application Support/Claude/claude_desktop_config.json');
  } else if (platform === 'win32') {
    // Windows
    return path.join(os.homedir(), 'AppData/Roaming/Claude/claude_desktop_config.json');
  } else {
    // Linux (not officially supported but just in case)
    return path.join(os.homedir(), '.config/claude/claude_desktop_config.json');
  }
}

function generateConfig() {
  const serverPath = path.join(__dirname, 'dist', 'server.js');
  const absoluteServerPath = path.resolve(serverPath);

  const config = {
    mcpServers: {
      "translate-server": {
        command: "node",
        args: [absoluteServerPath],
        env: {
          OPENAI_API_KEY: "your-openai-api-key-here"
        }
      }
    }
  };

  return { config, absoluteServerPath };
}

function updateExistingConfig(existingConfig, newServerConfig) {
  if (!existingConfig.mcpServers) {
    existingConfig.mcpServers = {};
  }

  existingConfig.mcpServers["translate-server"] = newServerConfig["translate-server"];
  return existingConfig;
}

function main() {
  console.log('🚀 Claude Desktop MCP Configuration Helper');
  console.log('==========================================\n');

  const { config, absoluteServerPath } = generateConfig();
  const configPath = getClaudeConfigPath();

  console.log('📍 Configuration Details:');
  console.log(`   Server path: ${absoluteServerPath}`);
  console.log(`   Config file: ${configPath}`);
  console.log();

  // Check if server exists
  if (!fs.existsSync(absoluteServerPath)) {
    console.log('❌ ERROR: Server file not found!');
    console.log('   Please run: npm run build');
    console.log('   Then try this script again.');
    process.exit(1);
  }

  console.log('✅ Server file exists');

  // Check if config directory exists
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    console.log('📁 Creating Claude config directory...');
    fs.mkdirSync(configDir, { recursive: true });
  }

  let finalConfig = config;

  // Check if config file already exists
  if (fs.existsSync(configPath)) {
    console.log('📄 Existing config file found, merging...');
    try {
      const existingContent = fs.readFileSync(configPath, 'utf-8');
      const existingConfig = JSON.parse(existingContent);
      finalConfig = updateExistingConfig(existingConfig, config.mcpServers);
    } catch (error) {
      console.log('⚠️  Warning: Could not parse existing config, creating backup...');
      const backupPath = `${configPath}.backup.${Date.now()}`;
      fs.copyFileSync(configPath, backupPath);
      console.log(`   Backup saved to: ${backupPath}`);
    }
  }

  // Write the configuration
  console.log('💾 Writing configuration...');
  fs.writeFileSync(configPath, JSON.stringify(finalConfig, null, 2));

  console.log('\n✅ Configuration completed!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Edit the config file and replace "your-openai-api-key-here" with your actual API key');
  console.log('   2. Restart Claude Desktop');
  console.log('   3. Test the translate_blog_post tool');
  console.log();
  console.log('🔧 Config file location:');
  console.log(`   ${configPath}`);
  console.log();
  console.log('📖 Usage Examples:');
  console.log('   "Use the translate_blog_post tool to translate this article to Dutch:"');
  console.log('   [paste your blog post with frontmatter]');
  console.log();
  console.log('📚 For detailed instructions, see: USAGE_GUIDE.md');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateConfig, updateExistingConfig, getClaudeConfigPath };