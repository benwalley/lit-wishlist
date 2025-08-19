# Image Selector with Navigation

A reusable component that provides image selection with navigation and AI generation capabilities.

## Features

- **Image Upload**: Direct file upload via drag-and-drop or file picker
- **AI Generation**: Generate custom, abstract, or animal images using AI
- **Navigation**: Browse through selected/generated images with arrow buttons  
- **History Tracking**: Maintains history of all selected images
- **Avatar Display**: Integrates with existing avatar system

## Usage

```javascript
import './components/global/image-selector-with-nav.js';
```

### Basic Usage

```html
<image-selector-with-nav
    imageId="123"
    username="John Doe"
    size="120"
    @image-changed="${this._onImageChanged}">
</image-selector-with-nav>
```

### With AI and Navigation Disabled

```html
<image-selector-with-nav
    imageId="123"
    username="John Doe"
    size="80"
    .showAi="${false}"
    .allowNavigation="${false}"
    @image-changed="${this._onImageChanged}">
</image-selector-with-nav>
```

### With Slot Content

```html
<image-selector-with-nav
    imageId="123"
    username="John Doe"
    @image-changed="${this._onImageChanged}">
    <p>Click the camera or AI button to change your image</p>
</image-selector-with-nav>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `imageId` | Number | 0 | Current selected image ID |
| `username` | String | '' | Username for avatar display |
| `size` | Number | 120 | Avatar size in pixels |
| `showAi` | Boolean | true | Show AI generation button and UI |
| `allowNavigation` | Boolean | true | Show navigation arrows and counter |

## Events

### image-changed

Dispatched when the selected image changes.

```javascript
_onImageChanged(e) {
    console.log('New image ID:', e.detail.imageId);
}
```

**Event Detail:**
- `imageId` (Number): The new selected image ID

## Slots

The component accepts slotted content that will be displayed below the image selector.

## AI Image Generation

When `showAi` is true, users can:
- Click the AI button to show generation options
- Enter custom prompts for image generation
- Generate random abstract images
- Generate random cartoon animal images

Generated images are automatically added to the navigation history.

## Navigation

When `allowNavigation` is true and multiple images exist:
- Left/right arrow buttons appear
- Image counter shows current position (e.g., "2 of 5")  
- Navigation wraps around (first ↔ last)
- Arrows are disabled at boundaries

## Image History

The component maintains an internal history of all selected images:
- **Automatically includes current image**: If a user has an existing image (passed via `imageId` prop), it's automatically added to the history so they can navigate back to it after selecting/generating new images
- Prevents duplicate images in history
- Navigates to existing images instead of adding duplicates
- Preserves history when switching between images
- Resets when image is removed (ID = 0)
- Updates when `imageId` prop changes from parent component

## Example Integration

```javascript
class MyForm extends LitElement {
    static properties = {
        selectedImageId: {type: Number}
    };

    constructor() {
        super();
        this.selectedImageId = 0;
    }

    _onImageChanged(e) {
        this.selectedImageId = e.detail.imageId;
        // Save to database, update state, etc.
    }

    render() {
        return html`
            <image-selector-with-nav
                imageId="${this.selectedImageId}"
                username="${this.currentUser?.name}"
                @image-changed="${this._onImageChanged}">
                <span>Choose your profile picture</span>
            </image-selector-with-nav>
        `;
    }
}
```