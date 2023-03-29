# html-text-formater

Wtyczka VS Code formatująca treści zawarte w pliku HTML. Cała zawartość pliku jest edytowana i&nbsp;wklejana w&nbsp;miejsce poprzedniej treści.

## Features

Wtyczka pobiera zawartośc tagu <body> następnie znajduje elementy tekstowe i&nbsp;usuwa 'sierotki'. W przypadku wystąpienia tekstu pomiędzy znakami '@@...@@@' wtyczka pakuje zawartość w tag `<strong>`.

## Requirements

Node.js

## Extension Settings

Wtyczka aktywowana jest skrótem klawiszowym CMD+SHIFT+I (CTRL+SHIFT+I), bądź poprzed naciśnięcie PPM na plik i wybraniu opcji 'Format HTML Text'.

## Release Notes

### 1.0.0

Initial release of extension.

### 1.0.1

Checking if file type matches HTML.

### 1.0.2

Fixing numbers next to other exceptions, and characters neighboring tags

### 1.0.3

Adding `<!DOCTYPE HTML>` to the beginning of the formetted file.

### 1.0.4

Now script gathers text nodes and puts them into an array. It no longers stringifies the whole body.
Then the array is filter (white space only entries are removed) and the rest is formatted as usual.

### 1.0.5

The script removes any new line characters and duplicate whitespace white characters within the replaced text.
The formatted text is returned in one line.