// Draws a coloured disc with a letter onto an app icon.
// Usage: osascript -l JavaScript badge.js <src.icns|png> <out.png> <RRGGBB> <letter>
// JXA + AppKit only (macOS built-ins), headless: renders into a bitmap, no window.
ObjC.import('AppKit');

function run(argv) {
    const src = argv[0], out = argv[1], hex = argv[2], letter = argv[3] || '';
    const S = 1024;

    const base = $.NSImage.alloc.initWithContentsOfFile(src);
    if (base.isNil()) throw new Error('cannot read ' + src);

    const rep = $.NSBitmapImageRep.alloc
        .initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
            null, S, S, 8, 4, true, false, $.NSDeviceRGBColorSpace, 0, 0);
    const ctx = $.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep);
    $.NSGraphicsContext.saveGraphicsState;
    $.NSGraphicsContext.setCurrentContext(ctx);

    base.drawInRectFromRectOperationFraction(
        $.NSMakeRect(0, 0, S, S), $.NSZeroRect, $.NSCompositingOperationSourceOver, 1.0);

    // Badge sits bottom-right, inside the standard macOS icon margin.
    const d = 420, ring = 28;
    const x = S - d - 70, y = 70;
    const c = (i) => parseInt(hex.substr(i, 2), 16) / 255;
    const fill = $.NSColor.colorWithSRGBRedGreenBlueAlpha(c(0), c(2), c(4), 1.0);

    $.NSColor.whiteColor.setFill;
    $.NSBezierPath.bezierPathWithOvalInRect($.NSMakeRect(x - ring, y - ring, d + 2 * ring, d + 2 * ring)).fill;
    fill.setFill;
    $.NSBezierPath.bezierPathWithOvalInRect($.NSMakeRect(x, y, d, d)).fill;

    if (letter) {
        const font = $.NSFont.systemFontOfSizeWeight(d * 0.58, 0.56);  // 0.56 = NSFontWeightHeavy
        // Raw keys: JXA doesn't bridge the AppKit attribute-name constants.
        const attrs = $.NSMutableDictionary.alloc.init;
        attrs.setObjectForKey(font, $('NSFont'));
        attrs.setObjectForKey($.NSColor.whiteColor, $('NSColor'));
        const str = $(letter);
        const size = str.sizeWithAttributes(attrs);
        str.drawAtPointWithAttributes(
            $.NSMakePoint(x + (d - size.width) / 2, y + (d - size.height) / 2), attrs);
    }

    $.NSGraphicsContext.restoreGraphicsState;
    const png = rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $());
    if (!png.writeToFileAtomically(out, true)) throw new Error('cannot write ' + out);
}
