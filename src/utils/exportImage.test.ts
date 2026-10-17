import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as htmlToImage from 'html-to-image';
import {
  downloadBillImage,
  copyBillImageToClipboard,
  ExportImageOptions,
} from './exportImage';

vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
  toBlob: vi.fn(),
}));

class MockClipboardItem {
  items: Record<string, Blob>;
  constructor(items: Record<string, Blob>) {
    this.items = items;
  }
}

describe('exportImage pipeline', () => {
  let dummyNode: HTMLElement;
  let clickedAnchor: HTMLAnchorElement | null = null;
  let clickSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();

    dummyNode = document.createElement('div');
    Object.defineProperty(dummyNode, 'offsetWidth', {
      configurable: true,
      value: 414,
    });

    clickedAnchor = null;
    clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        clickedAnchor = this;
      });

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        write: vi.fn().mockResolvedValue(undefined),
      },
    });

    (globalThis as any).ClipboardItem = MockClipboardItem;

    // Suppress expected console.error and console.warn during test failure paths
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
    vi.restoreAllMocks();
  });

  describe('downloadBillImage', () => {
    it('creates anchor, sets href and download filename, triggers click, and returns true', async () => {
      const mockDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA';
      vi.mocked(htmlToImage.toPng).mockResolvedValue(mockDataUrl);

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const result = await downloadBillImage(dummyNode, 'custom-bill.png');

      expect(result).toBe(true);
      expect(htmlToImage.toPng).toHaveBeenCalledTimes(1);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(clickedAnchor).not.toBeNull();
      expect(clickedAnchor?.download).toBe('custom-bill.png');
      expect(clickedAnchor?.href).toBe(mockDataUrl);
      expect(appendChildSpy).toHaveBeenCalledWith(clickedAnchor);
      expect(removeChildSpy).toHaveBeenCalledWith(clickedAnchor);
    });

    it('uses default filename matching vcb-bill-[timestamp].png when filename is omitted', async () => {
      vi.mocked(htmlToImage.toPng).mockResolvedValue('data:image/png;base64,test');

      const result = await downloadBillImage(dummyNode);

      expect(result).toBe(true);
      expect(clickedAnchor?.download).toMatch(/^vcb-bill-\d+\.png$/);
    });

    it('calculates pixelRatio targeting 1320px width based on node offsetWidth', async () => {
      vi.mocked(htmlToImage.toPng).mockResolvedValue('data:image/png;base64,test');

      // node offsetWidth is 414px, target is 1320px
      // pixelRatio = 1320 / 414 ≈ 3.188405797101449
      await downloadBillImage(dummyNode);

      expect(htmlToImage.toPng).toHaveBeenCalledWith(
        dummyNode,
        expect.objectContaining({
          pixelRatio: 1320 / 414,
        })
      );
    });

    it('accepts options object with custom targetWidth and quality', async () => {
      vi.mocked(htmlToImage.toPng).mockResolvedValue('data:image/png;base64,test');

      const options: ExportImageOptions = {
        filename: 'custom-scale.png',
        targetWidth: 2640,
        quality: 0.92,
      };

      const result = await downloadBillImage(dummyNode, options);

      expect(result).toBe(true);
      expect(clickedAnchor?.download).toBe('custom-scale.png');
      expect(htmlToImage.toPng).toHaveBeenCalledWith(
        dummyNode,
        expect.objectContaining({
          pixelRatio: 2640 / 414,
          quality: 0.92,
        })
      );
    });

    it('uses fallback pixel ratio when node width cannot be determined', async () => {
      vi.mocked(htmlToImage.toPng).mockResolvedValue('data:image/png;base64,test');

      const zeroWidthNode = document.createElement('div');
      Object.defineProperty(zeroWidthNode, 'offsetWidth', {
        configurable: true,
        value: 0,
      });

      const result = await downloadBillImage(zeroWidthNode);

      expect(result).toBe(true);
      expect(htmlToImage.toPng).toHaveBeenCalledWith(
        zeroWidthNode,
        expect.objectContaining({
          pixelRatio: expect.any(Number),
        })
      );
    });

    it('returns false and does not throw when node is null or undefined', async () => {
      expect(await downloadBillImage(null as any)).toBe(false);
      expect(await downloadBillImage(undefined as any)).toBe(false);
      expect(htmlToImage.toPng).not.toHaveBeenCalled();
    });

    it('returns false when toPng throws an error', async () => {
      vi.mocked(htmlToImage.toPng).mockRejectedValue(new Error('Canvas render failure'));

      const result = await downloadBillImage(dummyNode);

      expect(result).toBe(false);
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('returns false when toPng resolves to an empty string', async () => {
      vi.mocked(htmlToImage.toPng).mockResolvedValue('');

      const result = await downloadBillImage(dummyNode);

      expect(result).toBe(false);
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('copyBillImageToClipboard', () => {
    it('converts node to blob and copies to clipboard with ClipboardItem', async () => {
      const mockBlob = new Blob(['mock-binary-png'], { type: 'image/png' });
      vi.mocked(htmlToImage.toBlob).mockResolvedValue(mockBlob);

      const result = await copyBillImageToClipboard(dummyNode);

      expect(result).toBe(true);
      expect(htmlToImage.toBlob).toHaveBeenCalledWith(
        dummyNode,
        expect.objectContaining({
          pixelRatio: 1320 / 414,
        })
      );
      expect(navigator.clipboard.write).toHaveBeenCalledTimes(1);
      const callArg = vi.mocked(navigator.clipboard.write).mock.calls[0][0];
      expect(callArg).toHaveLength(1);
      expect((callArg[0] as any).items).toEqual({ 'image/png': mockBlob });
    });

    it('accepts custom targetWidth and quality options', async () => {
      const mockBlob = new Blob(['mock-binary-png'], { type: 'image/png' });
      vi.mocked(htmlToImage.toBlob).mockResolvedValue(mockBlob);

      const result = await copyBillImageToClipboard(dummyNode, {
        targetWidth: 800,
        quality: 0.8,
      });

      expect(result).toBe(true);
      expect(htmlToImage.toBlob).toHaveBeenCalledWith(
        dummyNode,
        expect.objectContaining({
          pixelRatio: 800 / 414,
          quality: 0.8,
        })
      );
    });

    it('returns false when node is null or undefined', async () => {
      expect(await copyBillImageToClipboard(null as any)).toBe(false);
      expect(await copyBillImageToClipboard(undefined as any)).toBe(false);
      expect(htmlToImage.toBlob).not.toHaveBeenCalled();
    });

    it('returns false when toBlob resolves to null', async () => {
      vi.mocked(htmlToImage.toBlob).mockResolvedValue(null);

      const result = await copyBillImageToClipboard(dummyNode);

      expect(result).toBe(false);
      expect(navigator.clipboard.write).not.toHaveBeenCalled();
    });

    it('returns false when navigator.clipboard is unavailable', async () => {
      const mockBlob = new Blob(['png'], { type: 'image/png' });
      vi.mocked(htmlToImage.toBlob).mockResolvedValue(mockBlob);

      // Remove clipboard
      Object.assign(navigator, { clipboard: undefined });

      const result = await copyBillImageToClipboard(dummyNode);

      expect(result).toBe(false);
    });

    it('returns false when ClipboardItem is undefined in the environment', async () => {
      const mockBlob = new Blob(['png'], { type: 'image/png' });
      vi.mocked(htmlToImage.toBlob).mockResolvedValue(mockBlob);

      delete (globalThis as any).ClipboardItem;

      const result = await copyBillImageToClipboard(dummyNode);

      expect(result).toBe(false);
      expect(navigator.clipboard.write).not.toHaveBeenCalled();
    });

    it('returns false when navigator.clipboard.write rejects', async () => {
      const mockBlob = new Blob(['png'], { type: 'image/png' });
      vi.mocked(htmlToImage.toBlob).mockResolvedValue(mockBlob);
      vi.mocked(navigator.clipboard.write).mockRejectedValue(new Error('Permission denied'));

      const result = await copyBillImageToClipboard(dummyNode);

      expect(result).toBe(false);
    });

    it('returns false when toBlob throws an error', async () => {
      vi.mocked(htmlToImage.toBlob).mockRejectedValue(new Error('DOM conversion error'));

      const result = await copyBillImageToClipboard(dummyNode);

      expect(result).toBe(false);
      expect(navigator.clipboard.write).not.toHaveBeenCalled();
    });
  });
});
