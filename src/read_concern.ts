import type { Document } from "./bson";

/** @public */
export enum ReadConcernLevel {
  local = 'local',
  majority = 'majority',
  linearizable = 'linearizable',
  available = 'available',
  snapshot = 'snapshot'
}

/** @public */
export type ReadConcernLevelLike = ReadConcernLevel | keyof typeof ReadConcernLevel;

/** @public */
export type ReadConcernLike = ReadConcern | { level: ReadConcernLevelLike } | ReadConcernLevelLike;

/**
 * The MongoDB ReadConcern, which allows for control of the consistency and isolation properties
 * of the data read from replica sets and replica set shards.
 * @public
 *
 * @see https://docs.mongodb.com/manual/reference/read-concern/index.html
 */
export class ReadConcern {
  level: ReadConcernLevel | string;

  /** Constructs a ReadConcern from the read concern level.*/
  constructor(level: ReadConcernLevelLike) {
    /**
     * A spec test exists that allows level to be any string.
     * "invalid readConcern with out stage"
     * @see ./test/spec/crud/v2/aggregate-out-readConcern.json
     * @see https://github.com/mongodb/specifications/blob/master/source/read-write-concern/read-write-concern.rst#unknown-levels-and-additional-options-for-string-based-readconcerns
     */
    this.level = ReadConcernLevel[level] || level;
  }

  /**
   * Construct a ReadConcern given an options object.
   *
   * @param options - The options object from which to extract the write concern.
   */
  static fromOptions(options?: {
    readConcern?: ReadConcernLike;
    level?: ReadConcernLevelLike;
  }): ReadConcern | undefined {
    if (options == null) {
      return;
    }

    if (options.readConcern) {
      const { readConcern } = options;
      if (readConcern instanceof ReadConcern) {
        return readConcern;
      } else if (typeof readConcern === 'string') {
        return new ReadConcern(readConcern);
      } else if ('level' in readConcern && readConcern.level) {
        return new ReadConcern(readConcern.level);
      }
    }

    if (options.level) {
      return new ReadConcern(options.level);
    }
  }

  static get MAJORITY(): string {
    return ReadConcernLevel.majority;
  }

  static get AVAILABLE(): string {
    return ReadConcernLevel.available;
  }

  static get LINEARIZABLE(): string {
    return ReadConcernLevel.linearizable;
  }

  static get SNAPSHOT(): string {
    return ReadConcernLevel.snapshot;
  }

  toJSON(): Document {
    return { level: this.level };
  }
}
