import events from 'events';

interface NReadlineInputParams {
  filepath: string;
  encoding?: 'utf8';
  start?: number;
  limit?: number;
  skipEmptyLines?: boolean;
}

class NReadline extends events.EventEmitter {
  constructor(params: NReadlineInputParams);

  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
}

export default NReadline;
