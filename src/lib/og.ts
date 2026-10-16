import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Resolved against the project root rather than import.meta.url: this module
// gets bundled into dist/pages/ during the build, so a URL relative to itself
// would point at a directory the fonts were never copied into.
const font = (file: string) => readFile(join(process.cwd(), 'src/assets/fonts', file));

/**
 * Loaded once per build, on first render. Satori needs font buffers — it has no access to the
 * webfonts Head.astro pulls from Google, so the same families are vendored
 * into src/assets/fonts/ as static TTF instances.
 */
let fontCache: Awaited<ReturnType<typeof loadFonts>> | undefined;

const loadFonts = () => Promise.all([
    font('PlayfairDisplay-Black.ttf').then((data) => ({ name: 'Playfair Display', data, weight: 900 as const, style: 'normal' as const })),
    font('Inter-Regular.ttf').then((data) => ({ name: 'Inter', data, weight: 400 as const, style: 'normal' as const })),
    font('JetBrainsMono-Medium.ttf').then((data) => ({ name: 'JetBrains Mono', data, weight: 500 as const, style: 'normal' as const })),
]);

const WIDTH = 1200;
const HEIGHT = 630;
const INK = '#111111';
const PAPER = '#F9F9F7';
const MUTED_TEXT = '#595959';

export type OgContent = {
    /** Small mono eyebrow, e.g. "Case study · 2023" */
    label: string;
    title: string;
    desc: string;
    /** The page's accent color — drives the top rule, as it does in Header.astro */
    accent?: string;
    /** Role tags, rendered as bordered chips along the bottom */
    tags?: string[];
};

function template({ label, title, desc, accent = INK, tags = [] }: OgContent) {
    // Satori lays padding out *outside* a fixed-size root rather than inside it,
    // which pushes bottom-anchored content off the canvas. So the root carries
    // no padding: an explicitly sized frame with a margin does the insetting.
    const PAD_X = 72;
    const PAD_Y = 64;

    return {
        type: 'div',
        props: {
            style: {
                width: `${WIDTH}px`,
                height: `${HEIGHT}px`,
                display: 'flex',
                backgroundColor: PAPER,
                fontFamily: 'Inter',
            },
            children: [
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            width: `${WIDTH - PAD_X * 2}px`,
                            height: `${HEIGHT - PAD_Y * 2}px`,
                            margin: `${PAD_Y}px ${PAD_X}px`,
                        },
                        children: [
                            // Accent rule, matching the one above every page heading
                            { type: 'div', props: { style: { width: '100%', height: '10px', backgroundColor: accent } } },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        fontFamily: 'JetBrains Mono',
                                        fontSize: '20px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: MUTED_TEXT,
                                        marginTop: '38px',
                                    },
                                    children: label,
                                },
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        fontFamily: 'Playfair Display',
                                        fontWeight: 900,
                                        fontSize: title.length > 24 ? '68px' : '88px',
                                        lineHeight: 1.04,
                                        letterSpacing: '-0.03em',
                                        color: INK,
                                        marginTop: '26px',
                                    },
                                    children: title,
                                },
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        fontSize: '29px',
                                        lineHeight: 1.45,
                                        color: MUTED_TEXT,
                                        marginTop: '24px',
                                        maxWidth: '880px',
                                    },
                                    children: desc,
                                },
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        // Pins the row to the bottom of the frame
                                        marginTop: 'auto',
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: { display: 'flex' },
                                                children: tags.slice(0, 4).map((tag, i) => ({
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            display: 'flex',
                                                            fontFamily: 'JetBrains Mono',
                                                            fontSize: '15px',
                                                            letterSpacing: '0.08em',
                                                            textTransform: 'uppercase',
                                                            color: INK,
                                                            border: `1.5px solid ${INK}`,
                                                            padding: '7px 12px',
                                                            marginLeft: i === 0 ? '0px' : '10px',
                                                        },
                                                        children: tag,
                                                    },
                                                })),
                                            },
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    fontFamily: 'JetBrains Mono',
                                                    fontSize: '18px',
                                                    letterSpacing: '0.08em',
                                                    color: INK,
                                                },
                                                children: 'jennifer.damato.design',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };
}

/** Clip a description to something that fits two lines at 30px. */
export function clip(text: string, max = 150) {
    if (text.length <= max) return text;
    return `${text.slice(0, text.lastIndexOf(' ', max)).trimEnd()}…`;
}

export async function renderOgImage(content: OgContent): Promise<Uint8Array> {
    fontCache ??= await loadFonts();
    const svg = await satori(template(content) as Parameters<typeof satori>[0], {
        width: WIDTH,
        height: HEIGHT,
        fonts: fontCache,
    });
    return new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
}
