import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'

export default abstract class BaseCommand extends Command {
  static flags = {
    help: flags.help({char: 'h'}),
    word: flags.string({char: 'w', description: 'Word to search'}),
    file: flags.string({
      char: 'f',
      description: 'File containing whatsapp messages',
      required: true,
    }),
    'max-entries': flags.integer({char: 'M', default: 10, description: 'Number of entries to display'}),
    all: flags.boolean({char: 'M', default: false, description: 'Show all results'}),
    ...cli.table.flags(),
  };
}
