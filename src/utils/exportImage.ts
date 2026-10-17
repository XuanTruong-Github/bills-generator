import { toPng, toBlob } from 'html-to-image';

export interface ExportImageOptions {
  filename?: string;
  targetWidth?: number; // Default 1320px matching bill.JPG
  quality?: number;
}

const DEFAULT_TARGET_WIDTH = 1320;
const DEFAULT_FALLBACK_PIXEL_RATIO = 2;

/**
 * Calculates the required pixel ratio to render the DOM node at targetWidth (default 1320px).
 */
function calculatePixelRatio(node: HTMLElement, targetWidth: number): number {
  const nodeWidth =
    node.offsetWidth ||
    node.clientWidth ||
    (typeof node.getBoundingClientRect === 'function' ? node.getBoundingClientRect().width : 0);

  return nodeWidth > 0 ? targetWidth / nodeWidth : DEFAULT_FALLBACK_PIXEL_RATIO;
}

/**
 * Triggers a high-resolution flat PNG download of the given bill preview element.
 *
 * @param node The flat bill preview container element
 * @param options Filename string or ExportImageOptions
 * @returns Promise<boolean> True if download was triggered successfully, false otherwise
 */
export async function downloadBillImage(
  node: HTMLElement,
  options?: string | ExportImageOptions
): Promise<boolean> {
  if (!node) {
    return false;
  }

  const resolvedOptions: ExportImageOptions =
    typeof options === 'string' ? { filename: options } : (options ?? {});

  const filename = resolvedOptions.filename || `vcb-bill-${Date.now()}.png`;
  const targetWidth = resolvedOptions.targetWidth ?? DEFAULT_TARGET_WIDTH;
  const pixelRatio = calculatePixelRatio(node, targetWidth);

  try {
    const dataUrl = await toPng(node, {
      pixelRatio,
      ...(resolvedOptions.quality !== undefined ? { quality: resolvedOptions.quality } : {}),
    });

    if (!dataUrl) {
      return false;
    }

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;

    if (document.body) {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      link.click();
    }

    return true;
  } catch (error) {
    console.error('Failed to export bill image:', error);
    return false;
  }
}

/**
 * Copies the bill preview as an image blob directly to the system clipboard.
 *
 * @param node The flat bill preview container element
 * @param options ExportImageOptions
 * @returns Promise<boolean> True if copied successfully, false otherwise
 */
export async function copyBillImageToClipboard(
  node: HTMLElement,
  options?: ExportImageOptions
): Promise<boolean> {
  if (!node) {
    return false;
  }

  if (
    typeof navigator === 'undefined' ||
    !navigator.clipboard ||
    typeof navigator.clipboard.write !== 'function'
  ) {
    console.warn('Clipboard API is not supported in this environment');
    return false;
  }

  if (typeof ClipboardItem === 'undefined') {
    console.warn('ClipboardItem is not supported in this environment');
    return false;
  }

  const resolvedOptions = options ?? {};
  const targetWidth = resolvedOptions.targetWidth ?? DEFAULT_TARGET_WIDTH;
  const pixelRatio = calculatePixelRatio(node, targetWidth);

  try {
    const blob = await toBlob(node, {
      pixelRatio,
      ...(resolvedOptions.quality !== undefined ? { quality: resolvedOptions.quality } : {}),
    });

    if (!blob) {
      return false;
    }

    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    console.error('Failed to copy bill image to clipboard:', error);
    return false;
  }
}
