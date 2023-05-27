import NumControl from "../controls/NumControl.js";

export default class GainComponent extends Rete.Component {

  constructor(socketType, audioContext) {
    super("Gain");
    this.socketType = socketType;
    this.audioContext = audioContext;
  }

  builder(node) {
    const inp1 = new Rete.Input('gainIn', "Gain In", this.socketType);
    const out1 = new Rete.Output('gainOut', "Gain Out", this.socketType);

    if (!node.data.gainValue) node.data.gainValue = 0.01;

    node.data.gainNode = this.audioContext.createGain();
    node.data.gainNode.gain.value = node.data.gainValue ? node.data.gainValue : 0.01;
    return node
      .addControl(new NumControl(this.editor, 'gainValue'))
      .addInput(inp1)
      .addOutput(out1)
      ;
  }

  worker(node, inputs, outputs) {
    node.data.gainNode.gain.value = node.data.gainValue;
    // TODO Make this audioparam input node too?

    const input = inputs['gainIn'].length ? inputs['gainIn'][0] : null;
    if (input && !node.data.inputNode) {
      // First time connected
      console.log(input);
      node.data.inputNode = input;
      input.connect(node.data.gainNode);
    } else if (!input && node.data.inputNode) {
      // No input so need to disconnect previous node
      node.data.inputNode.disconnect(node.data.gainNode);
      node.data.inputNode = null;
    }

    outputs['gainOut'] = node.data.gainNode;
  }
}