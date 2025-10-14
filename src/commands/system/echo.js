/**
 * echo - Print text to terminal
 */

export default {
  name: 'echo',
  description: 'Print tekst naar de terminal',
  category: 'system',
  usage: 'echo [text...]',

  execute(args, flags, context) {
    // Join all arguments with spaces
    return args.join(' ');
  }
};
