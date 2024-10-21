self.importScripts("/spark-md5.min.js");
self.onmessage = ({ data: { chunkList } }) => {
  const spark = new self.SparkMD5.ArrayBuffer();
  let count = 0;
  const next = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunkList[index]);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result);
      if (count === chunkList.length) {
        self.postMessage({ value: spark.end(), progress: 100 });
        self.close();
      } else {
        self.postMessage({ value: "", progress: Math.ceil((index / chunkList.length) * 100) });
        next(count);
      }
    };
  };
  next(count);
};
