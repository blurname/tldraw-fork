---
title: RTL Support
component: ./RTLExample.tsx
category: ui-components
priority: 1
keywords: [rtl, right-to-left, arabic, hebrew, internationalization, i18n, localization]
---

This example demonstrates how to use tldraw with RTL (Right-to-Left) language support.

---

## RTL Language Support

Tldraw supports RTL languages like Arabic and Hebrew through CSS direction properties. By setting `dir="rtl"` on the container element, the entire UI layout will be mirrored to accommodate RTL reading patterns.

### Key Features

- **Automatic UI Mirroring**: Toolbars, menus, and panels are automatically positioned for RTL layouts
- **Text Direction Support**: Text shapes and editing respect the RTL text direction
- **Menu and Dialog Support**: All popup menus, dialogs, and tooltips are properly positioned for RTL
- **Responsive Design**: RTL support works across all device sizes and orientations

### Implementation

To enable RTL support:

1. Set `dir="rtl"` on the container element
2. Optionally set `lang` attribute to specify the language (e.g., `lang="ar"` for Arabic)
3. The tldraw component will automatically adapt its layout and behavior

```tsx
<div className="tldraw__editor" dir="rtl" lang="ar">
  <Tldraw />
</div>
```

### CSS Classes

Tldraw includes built-in CSS classes for RTL support:

- `.tlui-main-toolbar--rtl`: RTL-specific toolbar styles
- `.tlui-style-panel--rtl`: RTL-specific style panel layout
- `[dir="rtl"]` selectors: Various UI components with RTL-specific positioning

These styles ensure that all UI elements are properly positioned and oriented for RTL languages.