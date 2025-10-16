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
  },

  manPage: `
NAAM
    echo - print tekst naar terminal

SYNOPSIS
    echo [TEXT...]

BESCHRIJVING
    Print de opgegeven tekst naar de terminal. Alle argumenten worden
    samengevoegd met spaties ertussen.

VOORBEELDEN
    echo Hello World
        Print: Hello World

    echo "Test met spaties"
        Print: Test met spaties

GEBRUIK
    Gebruik echo om tekst te tonen, variabelen te testen, of output
    te genereren die je kunt combineren met andere commands.

GERELATEERDE COMMANDO'S
    cat (toon bestandsinhoud)
`.trim()
};
