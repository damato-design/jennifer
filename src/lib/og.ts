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

export type DescPart = string | { text: string; squiggle: true };

export type OgContent = {
    /** Small mono eyebrow, e.g. "Case study · 2023" */
    label: string;
    title: string;
    /**
     * Optional subtext under the title; omitted entirely when absent. A string
     * may use \n for a hard break. Pass parts to give a word the wavy accent
     * underline the Chaos component draws on the site.
     */
    desc?: string | DescPart[];
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
                            ...(desc
                                ? [
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
                                                  whiteSpace: 'pre-line',
                                              },
                                              children:
                                                  typeof desc === 'string'
                                                      ? desc
                                                      : desc.map((part) =>
                                                            typeof part === 'string'
                                                                ? // Each part is its own flex item, so Satori trims
                                                                  // the spaces at its edges; non-breaking ones survive.
                                                                  { type: 'span', props: { children: part.replace(/^ | $/g, '\u00a0') } }
                                                                : {
                                                                      type: 'span',
                                                                      props: {
                                                                          style: {
                                                                              textDecorationLine: 'underline',
                                                                              textDecorationStyle: 'wavy',
                                                                              textDecorationColor: accent,
                                                                              // Matches the Chaos component's offset, scaled to 29px
                                                                              textUnderlineOffset: '8px',
                                                                          },
                                                                          children: part.text,
                                                                      },
                                                                  },
                                                        ),
                                          },
                                      },
                                  ]
                                : []),
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        // Bottom-aligned so the URL lines up with the last row of
                                        // chips when they wrap
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between',
                                        // Pins the row to the bottom of the frame
                                        marginTop: 'auto',
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                // Long role lists wrap onto a second row rather than
                                                // squeezing each chip's label onto two lines.
                                                style: { display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, marginRight: '32px' },
                                                children: tags.slice(0, 4).map((tag) => ({
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            lineHeight: 1,
                                                            fontFamily: 'JetBrains Mono',
                                                            fontSize: '20px',
                                                            letterSpacing: '0.08em',
                                                            textTransform: 'uppercase',
                                                            color: INK,
                                                            border: `2px solid ${INK}`,
                                                            // The label is uppercase, so it has no descenders, but
                                                            // the line box still reserves descender space below the
                                                            // baseline. Centering the box therefore leaves the
                                                            // letters high, by about 1px per side at 15px. Scaled to
                                                            // 20px, 11/8 evens it out without changing the chip's
                                                            // height.
                                                            padding: '11px 16px 8px',
                                                            whiteSpace: 'nowrap',
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
                                                    fontSize: '20px',
                                                    letterSpacing: '0.08em',
                                                    color: INK,
                                                    flexShrink: 0,
                                                    // Centers the URL against a chip's height
                                                    marginBottom: '9px',
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
export function clip(text = '', max = 150) {
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
