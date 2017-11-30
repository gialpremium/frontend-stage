const punycode = require('punycode');

// Для обратной совместимости со старым кодом
punycode.ToUnicode = punycode.toUnicode;
punycode.ToASCII = punycode.toASCII;

window.punycode = punycode;
