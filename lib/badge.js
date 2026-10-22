// Recolours Claude's app icon for a profile and adds a letter badge.
// Usage: osascript -l JavaScript badge.js <src.icns|png> <out.png> <RRGGBB> <letter>
// JXA + AppKit only (macOS built-ins), headless: renders into a bitmap, no window.
//
// Everything stays inside Apple's standard icon shape (rounded square 100..924,
// radius ~185 on a 1024 canvas). macOS 26 shrinks icons that poke outside it
// into a grey frame, which made the old corner badge nearly invisible.
ObjC.import('AppKit');

const S = 1024, INSET = 100, SIDE = 824, RADIUS = 185;
const OP_SOURCE_OVER = 2, OP_COLOR = 27;  // NSCompositingOperation values (not bridged in JXA)

function run(argv) {
    const src = argv[0], out = argv[1], hex = argv[2], letter = argv[3] || '';

    const base = $.NSImage.alloc.initWithContentsOfFile(src);
    if (base.isNil()) throw new Error('cannot read ' + src);

    const rep = $.NSBitmapImageRep.alloc
        .initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
            null, S, S, 8, 4, true, false, $.NSDeviceRGBColorSpace, 0, 0);
    const ctx = $.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep);
    $.NSGraphicsContext.saveGraphicsState;
    $.NSGraphicsContext.setCurrentContext(ctx);

    base.drawInRectFromRectOperationFraction($.NSMakeRect(0, 0, S, S), $.NSZeroRect, OP_SOURCE_OVER, 1.0);

    const c = (i) => parseInt(hex.substr(i, 2), 16) / 255;
    const color = $.NSColor.colorWithSRGBRedGreenBlueAlpha(c(0), c(2), c(4), 1.0);
    const shape = $.NSBezierPath.bezierPathWithRoundedRectXRadiusYRadius(
        $.NSMakeRect(INSET, INSET, SIDE, SIDE), RADIUS, RADIUS);

    // 1. Tint: "color" blend keeps the icon's light/dark (white mark stays white)
    //    and takes hue + saturation from the profile colour.
    ctx.compositingOperation = OP_COLOR;
    color.setFill;
    shape.fill;
    ctx.compositingOperation = OP_SOURCE_OVER;

    // 2. Letter badge, bottom-right, fully inside the rounded corner.
    if (letter) {
        const d = 300, cx = INSET + SIDE - 190, cy = INSET + 190;
        const disc = $.NSMakeRect(cx - d / 2, cy - d / 2, d, d);
        $.NSColor.colorWithSRGBRedGreenBlueAlpha(0, 0, 0, 0.18).setFill;   // soft shadow
        $.NSBezierPath.bezierPathWithOvalInRect($.NSMakeRect(cx - d / 2, cy - d / 2 - 8, d, d)).fill;
        $.NSColor.whiteColor.setFill;
        $.NSBezierPath.bezierPathWithOvalInRect(disc).fill;

        const font = $.NSFont.systemFontOfSizeWeight(d * 0.6, 0.56);  // 0.56 = NSFontWeightHeavy
        // Raw keys: JXA doesn't bridge the AppKit attribute-name constants.
        const attrs = $.NSMutableDictionary.alloc.init;
        attrs.setObjectForKey(font, $('NSFont'));
        attrs.setObjectForKey(color, $('NSColor'));
        const str = $(letter);
        const size = str.sizeWithAttributes(attrs);
        str.drawAtPointWithAttributes($.NSMakePoint(cx - size.width / 2, cy - size.height / 2), attrs);
    }

    $.NSGraphicsContext.restoreGraphicsState;
    const png = rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $());
    if (!png.writeToFileAtomically(out, true)) throw new Error('cannot write ' + out);
}
