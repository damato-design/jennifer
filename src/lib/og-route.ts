/**
 * Where a given page's generated Open Graph image lives.
 *
 * Kept in its own module so Head.astro can import it without pulling Satori
 * and the font buffers into every page's module graph.
 */
export function ogRouteFor(pathname: string) {
    const path = pathname.replace(/\/+$/, '');
    return path === '' ? 'home' : path.replace(/^\//, '');
}
