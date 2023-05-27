import TextControl from "../controls/TextControl.js";
import { ProcessorsBasePath, ProcessorsList } from "../processors/Processors.js";

export default class ProcComponent extends Rete.Component {

  constructor(socketType, audioContext) {
    super("Processor");
    this.socketType = socketType;
    this.audioContext = audioContext;
    // TODO import name string from associated file?
    this.processorsList = ProcessorsList;
    this.audioWorkletNodes = [];
    this.currentProcessorTypeIndex = 0;
    this.isProcessorInit = this.initProcessors();
  }

  async initProcessors() {
    this.processorsList.forEach(async (procName) => {
      await this.audioContext.audioWorklet.addModule(ProcessorsBasePath + procName + ".js");
    });
  }

  async builder(node) {
    await this.isProcessorInit;
    const out1 = new Rete.Output('procOut', "Proc Out", this.socketType);

    if (!node.data.procType) node.data.procType = this.processorsList[this.currentProcessorTypeIndex];
    node.data.procNode = this.getAudioWorkletNode(this.processorsList[this.currentProcessorTypeIndex]);
    this.audioWorkletNodes.push(node.data.procNode);
    return node
      .addControl(new TextControl(this.editor, 'procType'))
      .addOutput(out1)
      ;
  }

  worker(node, inputs, outputs) {
    if (this.isValidType(node.data.procType) && this.isChangedType(node.data.procType)) {
      node.data.procNode = this.getAudioWorkletNode(node.data.procType);
    }
    outputs['procOut'] = node.data.procNode;
  }

  isValidType(value) {
    return this.processorsList.includes(value);
  }

  isChangedType(value) {
    return this.processorsList[this.currentProcessorTypeIndex] !== value;
  }

  getAudioWorkletNode(value) {
    // return cached node if available
    // TODO is it better to create nodes each time instead of caching? (performance)
    let node = this.audioWorkletNodes[value];
    if (node) return node;
    node = new AudioWorkletNode(
      this.audioContext,
      value
    );
    this.audioWorkletNodes[value] = node;
    return node;
  }
}