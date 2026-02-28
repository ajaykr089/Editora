import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow } from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getApiUrl, getApiHeaders, getDocumentManagerConfig } from './constants';

/**
 * Standalone Document Manager utilities for import/export operations
 */

/**
 * Import content from Word document
 */
export async function importFromWord(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(new Error(`Failed to import Word document: ${error}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export content to Word document
 * 
 * This function attempts to export using a backend API first (if configured).
 * If the API is unavailable or fails, it falls back to client-side generation
 * using the docx library (if useClientSideFallback is enabled in config).
 * 
 * @param htmlContent - HTML content to export
 * @param filename - Output filename (default: 'document.docx')
 */
export async function exportToWord(
  htmlContent: string, 
  filename: string = 'document.docx'
): Promise<void> {
  const config = getDocumentManagerConfig();
  const useClientSideFallback = config.useClientSideFallback ?? true;
  
  try {
    // Try API export first (if configured)
    const apiUrl = getApiUrl('exportWord');
    const headers = getApiHeaders();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        htmlContent,
        filename
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to export document');
    }

    // Create blob from response and download
    const blob = await response.blob();
    downloadBlob(blob, filename);
    
  } catch (apiError) {
    // If API fails and fallback is enabled, use client-side generation
    if (useClientSideFallback) {
      console.warn('API export failed, falling back to client-side generation:', apiError);
      
      try {
        // Use client-side docx generation as fallback
        const doc = htmlToDocx(htmlContent);
        const blob = await Packer.toBlob(doc);
        downloadBlob(blob, filename);
        
        console.info('✅ Document exported successfully using client-side generation');
      } catch (fallbackError) {
        throw new Error(`Failed to export to Word (both API and client-side): ${fallbackError}`);
      }
    } else {
      // If fallback is disabled, throw the original API error
      throw new Error(`Failed to export to Word via API: ${apiError}`);
    }
  }
}

/**
 * Export content to PDF with proper multi-page support
 */
export async function exportToPdf(
  htmlContent: string,
  filename: string = 'document.pdf',
  element?: HTMLElement
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    if (element) {
      // Ensure the element is fully visible and rendered
      const originalPosition = element.style.position;
      const originalOverflow = element.style.overflow;
      const originalHeight = element.style.height;
      const originalMaxHeight = element.style.maxHeight;

      // Temporarily make the element fully visible for rendering
      element.style.position = 'relative';
      element.style.overflow = 'visible';
      element.style.height = 'auto';
      element.style.maxHeight = 'none';

      // Force a reflow to ensure rendering is complete
      element.offsetHeight;

      try {
        // Render the entire content as one high-quality canvas
        const canvas = await html2canvas(element, {
          scale: 2, // High quality rendering
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: element.scrollWidth,
          height: element.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        });

        // Restore original styles
        element.style.position = originalPosition;
        element.style.overflow = originalOverflow;
        element.style.height = originalHeight;
        element.style.maxHeight = originalMaxHeight;

        const imgData = canvas.toDataURL('image/png');

        // Calculate the scaled dimensions to fit the page width
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if content fits on one page
        if (imgHeight <= contentHeight) {
          // Single page - easy case
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        } else {
          // Multi-page: split the canvas into page-sized chunks
          // Calculate pixels per mm in the rendered image
          const pixelsPerMm = canvas.height / imgHeight;
          // Calculate how many pixels fit on one page
          const pixelsPerPage = pixelsPerMm * contentHeight;
          // Calculate total pages needed
          const pagesNeeded = Math.ceil(canvas.height / pixelsPerPage);

          for (let page = 0; page < pagesNeeded; page++) {
            if (page > 0) {
              pdf.addPage();
            }

            // Create a temporary canvas for this page
            const pageCanvas = document.createElement('canvas');
            const pageCtx = pageCanvas.getContext('2d')!;
            pageCanvas.width = canvas.width;

            // Calculate the height for this page in pixels
            const startY = page * pixelsPerPage;
            const remainingHeight = canvas.height - startY;
            const pagePixelHeight = Math.min(pixelsPerPage, remainingHeight);

            pageCanvas.height = pagePixelHeight;

            // Draw the portion of the original canvas for this page
            pageCtx.drawImage(
              canvas,
              0, startY, canvas.width, pagePixelHeight,
              0, 0, canvas.width, pagePixelHeight
            );

            // Convert to image and add to PDF
            const pageImgData = pageCanvas.toDataURL('image/png');
            const pageImgHeight = (pagePixelHeight / pixelsPerMm); // Convert back to mm

            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, Math.min(pageImgHeight, contentHeight));
          }
        }
      } catch (canvasError) {
        // Restore styles even if canvas fails
        element.style.position = originalPosition;
        element.style.overflow = originalOverflow;
        element.style.height = originalHeight;
        element.style.maxHeight = originalMaxHeight;
        throw canvasError;
      }
    } else {
      // Fallback to basic text rendering
      const lines = htmlToPlainText(htmlContent).split('\n');
      let y = margin;

      lines.forEach((line) => {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += 7; // Line height
      });
    }

    pdf.save(filename);
  } catch (error) {
    throw new Error(`Failed to export to PDF: ${error}`);
  }
}

/**
 * Convert HTML content to DOCX document
 * Exported for advanced use cases where direct Document object manipulation is needed
 */
export function htmlToDocx(htmlContent: string): Document {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const children: (Paragraph | Table)[] = [];

  // Process each child element
  Array.from(tempDiv.children).forEach((element) => {
    const tagName = element.tagName;
    
    // Handle headings (H1-H6)
    if (tagName.match(/^H[1-6]$/)) {
      children.push(createHeadingFromElement(element));
    }
    // Handle paragraphs
    else if (tagName === 'P') {
      children.push(createParagraphFromElement(element));
    }
    // Handle tables
    else if (tagName === 'TABLE') {
      children.push(createTableFromElement(element));
    }
    // Handle lists
    else if (tagName === 'UL' || tagName === 'OL') {
      children.push(...createListFromElement(element, tagName === 'OL'));
    }
    // Handle blockquotes
    else if (tagName === 'BLOCKQUOTE') {
      children.push(createBlockquoteFromElement(element));
    }
    // Handle pre/code blocks
    else if (tagName === 'PRE' || tagName === 'CODE') {
      children.push(createCodeBlockFromElement(element));
    }
    // Handle horizontal rules
    else if (tagName === 'HR') {
      children.push(createHorizontalRule());
    }
    // Handle divs and other block elements
    else if (element.textContent?.trim()) {
      children.push(createParagraphFromElement(element));
    }
  });

  // If no children were created, add an empty paragraph
  if (children.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
  }

  return new Document({
    sections: [{
      properties: {},
      children
    }]
  });
}

/**
 * Create a heading from HTML heading element (H1-H6)
 */
function createHeadingFromElement(element: Element): Paragraph {
  const level = parseInt(element.tagName.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
  const textRuns = extractTextRuns(element);
  const alignment = getAlignment(element);
  
  // Map heading levels to sizes (in half-points)
  const headingSizes: Record<number, number> = {
    1: 32, // 16pt
    2: 28, // 14pt
    3: 26, // 13pt
    4: 24, // 12pt
    5: 22, // 11pt
    6: 20, // 10pt
  };

  return new Paragraph({
    children: textRuns.map(run => {
      const textRun = new TextRun({
        text: run.text,
        bold: run.bold || level <= 3, // H1-H3 are bold by default
        italics: run.italic,
        underline: run.underline ? {} : undefined,
        color: run.color,
        size: headingSizes[level],
        font: run.font
      });
      
      // Add hyperlink if present
      if (run.link) {
        return new TextRun({
          ...textRun,
          style: 'Hyperlink'
        });
      }
      
      return textRun;
    }),
    heading: `Heading${level}` as any,
    alignment: alignment as any,
    spacing: { before: 240, after: 120 }
  });
}

/**
 * Create a paragraph from HTML element with proper formatting
 */
function createParagraphFromElement(element: Element): Paragraph {
  const textRuns = extractTextRuns(element);
  const alignment = getAlignment(element);
  const indent = getIndent(element);
  
  return new Paragraph({
    children: textRuns.map(run => {
      const textRunProps: any = {
        text: run.text,
        bold: run.bold,
        italics: run.italic,
        underline: run.underline ? {} : undefined,
        strike: run.strike,
        color: run.color,
        size: run.size,
        font: run.font,
        highlight: run.highlight
      };
      
      // Add hyperlink if present
      if (run.link) {
        textRunProps.style = 'Hyperlink';
      }
      
      return new TextRun(textRunProps);
    }),
    alignment: alignment as any,
    indent: indent
  });
}

/**
 * Create a blockquote paragraph
 */
function createBlockquoteFromElement(element: Element): Paragraph {
  const textRuns = extractTextRuns(element);
  
  return new Paragraph({
    children: textRuns.map(run => new TextRun({
      text: run.text,
      bold: run.bold,
      italics: run.italic || true, // Blockquotes are italic by default
      underline: run.underline ? {} : undefined,
      color: run.color || '666666',
      size: run.size
    })),
    indent: { left: 720 }, // 0.5 inch indent
    border: {
      left: {
        color: 'CCCCCC',
        space: 1,
        style: 'single' as any,
        size: 6
      }
    }
  });
}

/**
 * Create a code block paragraph
 */
function createCodeBlockFromElement(element: Element): Paragraph {
  const textContent = element.textContent || '';
  
  return new Paragraph({
    children: [
      new TextRun({
        text: textContent,
        font: 'Courier New',
        size: 20 // 10pt
      })
    ],
    shading: {
      fill: 'F5F5F5', // Light gray background
      type: 'solid' as any
    },
    indent: { left: 360 }, // 0.25 inch indent
    spacing: { before: 120, after: 120 }
  });
}

/**
 * Create a horizontal rule
 */
function createHorizontalRule(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '' })],
    border: {
      bottom: {
        color: 'CCCCCC',
        space: 1,
        style: 'single' as any,
        size: 6
      }
    },
    spacing: { before: 120, after: 120 }
  });
}

/**
 * Extract text runs with formatting from an element
 */
interface TextRunInfo {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  size?: number;
  font?: string;
  highlight?: string;
  link?: string; // URL for hyperlinks
}

function extractTextRuns(element: Element): TextRunInfo[] {
  const runs: TextRunInfo[] = [];
  
  function processNode(node: Node, inheritedStyle: Partial<TextRunInfo> = {}): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim() || text.includes(' ')) { // Include spaces
        runs.push({
          text: text,
          ...inheritedStyle
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const elem = node as HTMLElement;
      const newStyle = { ...inheritedStyle };
      
      // Check for formatting tags
      const tagName = elem.tagName;
      if (tagName === 'STRONG' || tagName === 'B') newStyle.bold = true;
      if (tagName === 'EM' || tagName === 'I') newStyle.italic = true;
      if (tagName === 'U') newStyle.underline = true;
      if (tagName === 'S' || tagName === 'STRIKE' || tagName === 'DEL') newStyle.strike = true;
      
      // Handle links
      if (tagName === 'A') {
        const href = (elem as HTMLAnchorElement).href;
        if (href) {
          newStyle.link = href;
          newStyle.color = '0563C1'; // Standard link blue
          newStyle.underline = true;
        }
      }
      
      // Handle line breaks
      if (tagName === 'BR') {
        runs.push({ text: '\n', ...inheritedStyle });
        return;
      }
      
      // Handle code elements
      if (tagName === 'CODE') {
        newStyle.font = 'Courier New';
        if (!elem.closest('pre')) { // Inline code only
          newStyle.highlight = 'F5F5F5';
        }
      }
      
      // Handle mark/highlight elements
      if (tagName === 'MARK') {
        newStyle.highlight = 'FFFF00'; // Yellow highlight
      }
      
      // Handle subscript and superscript
      if (tagName === 'SUB' || tagName === 'SUP') {
        newStyle.size = (newStyle.size || 24) * 0.7; // 70% of current size
      }
      
      // Check inline styles
      const style = elem.style;
      if (style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 600) {
        newStyle.bold = true;
      }
      if (style.fontStyle === 'italic') {
        newStyle.italic = true;
      }
      if (style.textDecoration?.includes('underline')) {
        newStyle.underline = true;
      }
      if (style.textDecoration?.includes('line-through')) {
        newStyle.strike = true;
      }
      
      // Extract color
      if (style.color) {
        newStyle.color = rgbToHex(style.color);
      }
      
      // Extract background color (highlight)
      if (style.backgroundColor) {
        newStyle.highlight = rgbToHex(style.backgroundColor);
      }
      
      // Extract font size (convert px to half-points)
      if (style.fontSize) {
        const pxSize = parseInt(style.fontSize);
        if (!isNaN(pxSize)) {
          newStyle.size = Math.round(pxSize * 1.33); // Convert px to half-points
        }
      }
      
      // Extract font family
      if (style.fontFamily) {
        newStyle.font = style.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
      }
      
      // Process child nodes
      Array.from(elem.childNodes).forEach(child => processNode(child, newStyle));
    }
  }
  
  Array.from(element.childNodes).forEach(child => processNode(child));
  
  // If no text runs found, use plain text content
  if (runs.length === 0 && element.textContent?.trim()) {
    runs.push({ text: element.textContent.trim() });
  }
  
  return runs;
}

/**
 * Get text alignment from element
 */
function getAlignment(element: Element): 'left' | 'center' | 'right' | 'justify' | undefined {
  const htmlElement = element as HTMLElement;
  const textAlign = htmlElement.style.textAlign;
  
  if (textAlign === 'center') return 'center';
  if (textAlign === 'right') return 'right';
  if (textAlign === 'justify') return 'justify';
  if (textAlign === 'left') return 'left';
  
  return undefined;
}

/**
 * Get indentation from element
 */
function getIndent(element: Element): { left?: number; right?: number } | undefined {
  const htmlElement = element as HTMLElement;
  const style = htmlElement.style;
  const indent: { left?: number; right?: number } = {};
  
  // Convert CSS pixels to twips (1/20 of a point, 1440 twips = 1 inch)
  if (style.marginLeft || style.paddingLeft) {
    const leftPx = parseInt(style.marginLeft || style.paddingLeft);
    if (!isNaN(leftPx) && leftPx > 0) {
      indent.left = Math.round(leftPx * 14.4); // Convert px to twips
    }
  }
  
  if (style.marginRight || style.paddingRight) {
    const rightPx = parseInt(style.marginRight || style.paddingRight);
    if (!isNaN(rightPx) && rightPx > 0) {
      indent.right = Math.round(rightPx * 14.4);
    }
  }
  
  return Object.keys(indent).length > 0 ? indent : undefined;
}

/**
 * Convert RGB color to hex
 */
function rgbToHex(rgb: string): string {
  // If already hex, return it without #
  if (rgb.startsWith('#')) {
    return rgb.substring(1).toUpperCase();
  }
  
  // Parse rgb(r, g, b) or rgba(r, g, b, a)
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase();
  }
  
  // Named colors - handle common ones
  const namedColors: Record<string, string> = {
    'black': '000000',
    'white': 'FFFFFF',
    'red': 'FF0000',
    'green': '008000',
    'blue': '0000FF',
    'yellow': 'FFFF00',
    'cyan': '00FFFF',
    'magenta': 'FF00FF',
    'gray': '808080',
    'grey': '808080'
  };
  
  return namedColors[rgb.toLowerCase()] || '000000';
}

/**
 * Create a table from HTML table element
 */
function createTableFromElement(tableElement: Element): Table {
  const rows: TableRow[] = [];
  const htmlRows = tableElement.querySelectorAll('tr');

  htmlRows.forEach((htmlRow) => {
    const cells: TableCell[] = [];
    const htmlCells = htmlRow.querySelectorAll('td, th');

    htmlCells.forEach((htmlCell) => {
      const textRuns = extractTextRuns(htmlCell);
      const isHeader = htmlCell.tagName === 'TH';
      
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: textRuns.map(run => {
                const textRunProps: any = {
                  text: run.text,
                  bold: run.bold || isHeader, // Table headers are bold
                  italics: run.italic,
                  underline: run.underline ? {} : undefined,
                  strike: run.strike,
                  color: run.color,
                  size: run.size,
                  font: run.font,
                  highlight: run.highlight
                };
                
                if (run.link) {
                  textRunProps.style = 'Hyperlink';
                }
                
                return new TextRun(textRunProps);
              })
            })
          ],
          shading: isHeader ? {
            fill: 'E0E0E0', // Light gray for headers
            type: 'solid' as any
          } : undefined
        })
      );
    });

    rows.push(new TableRow({ children: cells }));
  });

  return new Table({
    rows,
    width: {
      size: 100,
      type: 'pct' as any // 100% width
    }
  });
}

/**
 * Create list items from HTML list element
 */
function createListFromElement(listElement: Element, isOrdered: boolean = false): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const items = listElement.querySelectorAll('li');

  items.forEach((item, index) => {
    const textRuns = extractTextRuns(item);
    const bullet = isOrdered ? `${index + 1}.` : '•';
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${bullet} `,
            bold: false
          }),
          ...textRuns.map(run => {
            const textRunProps: any = {
              text: run.text,
              bold: run.bold,
              italics: run.italic,
              underline: run.underline ? {} : undefined,
              strike: run.strike,
              color: run.color,
              size: run.size,
              font: run.font,
              highlight: run.highlight
            };
            
            if (run.link) {
              textRunProps.style = 'Hyperlink';
            }
            
            return new TextRun(textRunProps);
          })
        ],
        indent: { left: 720 }, // 0.5 inch indent
        spacing: { after: 120 }
      })
    );
  });

  return paragraphs;
}

/**
 * Convert HTML to plain text for PDF fallback
 */
function htmlToPlainText(htmlContent: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || '';
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
