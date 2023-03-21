export default class Record {
  /**
   * Current row ID
   *
   * @private
   */
  private readonly rowId: string;

  /**
   * Record data
   *
   * @private
   */
  private columnValues: Map<string, any>;

  /**
   * Whether to set timestampData
   */
  readonly timestampData: boolean;

  /**
   * Row creation date
   *
   * @private
   */
  private createdAt: Date;

  /**
   * Row update date
   *
   * @private
   */
  private updatedAt: Date;

  /**
   * Record Constructor
   *
   * @param rowId
   * @param columnValues
   * @param timeStamps
   */
  constructor(rowId: string, columnValues: Map<string, any>, timeStamps: boolean = false) {
    this.rowId = rowId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.timestampData = timeStamps;
    this.columnValues = columnValues;

    if (timeStamps) {
      columnValues.set('createdAt', new Date());
      columnValues.set('updatedAt', new Date());
    }
  }

  /**
   * Get column values map
   *
   * @returns {Map<string, any>} Column data map
   */
  public getColumnValuesMap = (): Map<string, any> => this.columnValues;

  /**
   * Set/update column values map
   *
   * @param columnValues {Map<string, any>} Updated column values map
   */
  public setColumnValuesMap(columnValues: Map<string, any>): this {
    this.columnValues = columnValues;
    this.createdAt = new Date();
    this.updatedAt = new Date();

    if (this.timestampData) {
      this.columnValues.set('createdAt', new Date());
      this.columnValues.set('updatedAt', new Date());
    }

    return this;
  }

  /**
   * Get row ID
   *
   * @returns {string} Current row ID
   */
  public getRowId(): string {
    return this.rowId;
  }

  /**
   * Get row creation date
   *
   * @returns {Date} Row creation date
   */
  public getCreatedAt = (): Date => this.createdAt;

  /**
   * Get row update date
   *
   * @returns {Date} Row update date
   */
  public getUpdatedAt = (): Date => this.updatedAt;

  /**
   * Get record as an object
   */
  public toObject = (): any => Object.fromEntries(this.columnValues);

  /**
   * Set/update row update date
   *
   */
  public setUpdatedAt() {
    this.updatedAt = new Date();
    if (this.timestampData) {
      this.columnValues.set('updatedAt', new Date());
    }
  }
}
