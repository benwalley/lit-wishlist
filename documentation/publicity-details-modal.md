# Publicity Details Modal

An instruction modal that explains the difference between public and private lists, helping users understand publicity settings.

## Usage

```html
<publicity-details-modal></publicity-details-modal>
```

Then trigger it with:

```javascript
window.dispatchEvent(new CustomEvent('open-publicity-details-modal'));
```

## Content

The modal explains:
- Public lists: visible to everyone, searchable, shareable
- Private lists: only visible to you and invited users
- When to use each type
- How to change publicity settings

## Features

- Responsive design
- Clear visual hierarchy
- Highlighted tip section
- Uses existing modal patterns