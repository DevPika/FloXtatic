class WhiteNoiseModifiedProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const output = outputs[0];
      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i++) {
          channel[i] = Math.random() * 0.5 - 1;
        }
      });
      return true;
    }
  }
  
registerProcessor("WhiteNoiseModifiedProcessor", WhiteNoiseModifiedProcessor);