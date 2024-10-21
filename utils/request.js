import axios from "axios";

class RequestController {
  maxSize = 6;
  waitQueue = [];
  requestQueue = new Set();

  post(...args) {
    return new Promise((resolve, reject) => {
      const fn = () => {
        const res = axios.post(...args);
        res.finally(() => {
          this.requestQueue.delete(fn);
          if (this.requestQueue.size === 0 && this.waitQueue.length === 0) resolve();
          if (this.waitQueue.length > 0) {
            const request = this.waitQueue.shift();
            this.requestQueue.add(request);
            request();
          }
        });
      };
      this.waitQueue.push(fn);
      if (this.requestQueue.size < this.maxSize) {
        const request = this.waitQueue.shift();
        this.requestQueue.add(request);
        request();
      }
    });
  }
}
const requestController = new RequestController();
export const post = requestController.post.bind(requestController);
