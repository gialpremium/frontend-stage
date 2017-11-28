---
layout: page
title: 'b-dropdown'
---

## API

```html
<button onclick="$(selector).iDropdown('add', { value: '01', text: 'item add'})">add</button>
<button onclick="$(selector).iDropdown('add', { value: '02', text: 'item add at position', position: 0})">add position</button>
<button onclick="$(selector).iDropdown('add', { value: '03', text: 'item add and selected', selected: 1})">add selected</button>
<button onclick="$(selector).iDropdown('add', { value: '04', text: 'item with custom data', data: {trolo: 'lo', id: 1}})">add item with data</button>
<br />
<button onclick="$(selector).iDropdown('change', 1, { value: 'new_value', text: 'this item was change'})">change 1</button>
<button onclick="$(selector).iDropdown('change', 2, { value: 'new_value', text: 'this item was change and select', selected: 1})">change 2</button>
<br />
<button onclick="$(selector).iDropdown('remove', 0)">remove first</button>
<button onclick="$(selector).iDropdown('remove', 1)">remove second</button>
<br />
<button onclick="$(selector).iDropdown('selected', {position: 3})">selected 3</button>
<button onclick="$(selector).iDropdown('selected', {position: 0})">selected 0</button>
```