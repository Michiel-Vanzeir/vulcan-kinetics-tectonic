// Shared message contract between content script, background and popup.

export type Message =
  | { type: 'DELETION_BURST'; url: string; deletedChars: number }
  | { type: 'GET_STATUS' };

export interface Status {
  deletionBursts: number;
  lastUrl: string | null;
}
