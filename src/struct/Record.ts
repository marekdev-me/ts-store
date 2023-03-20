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
   * Row creation date
   *
   * @private
   */
  private readonly createdAt: Date;

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
   * @param createdAt
   * @param updatedAt
   */
  constructor(rowId: string, columnValues: Map<string, any>, createdAt: Date, updatedAt: Date) {
    this.rowId = rowId;
    this.columnValues = columnValues;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
  public setColumnValuesMap(columnValues: Map<string, any>) {
    this.columnValues = columnValues;
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
   * Set/update row update date
   *
   * @param updatedAt {Date} Row update date
   */
  public setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }
}
