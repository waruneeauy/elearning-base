class HttpSuccess {
  /**
   * HTTP Status Code
   */
  status: string;
  result?: any;

  constructor(result?: any) {
    this.status = "success";
    this.result = result;
  }
}
export default HttpSuccess;
