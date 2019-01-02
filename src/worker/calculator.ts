self.onmessage = (message) => {
  console.log(`worker received: ${message.data}`);
  setTimeout(() => {
    // @ts-ignore
    self.postMessage(`${message.data} : ${Math.random().toFixed(16)}`);
  }, 5000);
};
