import NumControl from "../controls/NumControl.js";

export default class OscComponent extends Rete.Component {

  constructor(socketType, audioContext) {
    super("Oscillator");
    this.socketType = socketType;
    this.audioContext = audioContext;
  }

  builder(node) {
    const inp1 = new Rete.Input('oscFreqIn', "Osc Freq In", this.socketType);
    const out1 = new Rete.Output('oscOut', "Osc Out", this.socketType);

    if (!node.data.freq) node.data.freq = 440;
    node.data.oscNode = this.audioContext.createOscillator();
    node.data.oscNode[node.data.oscNode.start ? 'start' : 'noteOn'](0);
    return node
      .addControl(new NumControl(this.editor, 'freq'))
      .addInput(inp1)
      .addOutput(out1)
      ;
  }

  worker(node, inputs, outputs) {
    const input = inputs['oscFreqIn'].length ? inputs['oscFreqIn'][0] : null;
    if (input && !node.data.inputNode) {
      node.data.inputNode = input;
      input.connect(node.data.oscNode.frequency);
    } else if (!input) {
      // No freq input, so use value from control
      node.data.oscNode.frequency.value = node.data.freq; // TODO Better place?
      if (node.data.inputNode) {
        node.data.inputNode.disconnect(node.data.oscNode.frequency);
        node.data.inputNode = null;
      }
    }

    outputs['oscOut'] = node.data.oscNode;
  }
}