const readline = require('readline');
const { execSync } = require('child_process');
const { runAllMigrations, runOneMigration } = require('./migrate');

function askQuestion(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const action = await askQuestion(
    `What would you like to do? 
1) Create a migration
2) up:all
3) down:all
4) up-one
5) down-one
Enter your choice: `
  );

  switch (action.trim()) {
    case '1': {
      const migrationName = await askQuestion(
        'Please provide a migration name: '
      );
      execSync(`bash ./scripts/generate-migration.sh ${migrationName}`, {
        stdio: 'inherit'
      });
      break;
    }
    case '2': {
      await runAllMigrations('up');
      break;
    }
    case '3': {
      await runAllMigrations('down');
      break;
    }
    case '4': {
      const migrationName = await askQuestion(
        'Please provide the migration name to run up: '
      );
      await runOneMigration('up', migrationName);
      break;
    }
    case '5': {
      const migrationName = await askQuestion(
        'Please provide the migration name to run down: '
      );
      await runOneMigration('down', migrationName);
      break;
    }
    default: {
      console.error('Invalid choice.');
      process.exit(1);
    }
  }
}

main();
