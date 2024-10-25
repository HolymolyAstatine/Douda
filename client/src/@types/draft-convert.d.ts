declare module 'draft-convert' {
    import { ContentState } from 'draft-js';
  
    export function convertFromHTML(html: string): ContentState;
  }
  