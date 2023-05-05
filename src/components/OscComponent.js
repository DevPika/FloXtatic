import NumControl from "../controls/NumControl.js";

export default class OscComponent extends Rete.Component {

    constructor(socketType, audioContext){
        super("Oscillator");
        this.socketType = socketType;
        this.audioContext = audioContext;
    }

    builder(node) {
        var out1 = new Rete.Output('oscOut', "Osc Out", this.socketType);

        if (!node.data.freq) node.data.freq = 440;
        node.data.oscNode = this.audioContext.createOscillator();
        node.data.oscNode[node.data.oscNode.start ? 'start' : 'noteOn'](0);
        return node
          .addControl(new NumControl(this.editor, 'freq'))
          .addOutput(out1);
    }

    worker(node, inputs, outputs) {
        node.data.oscNode.frequency.value = node.data.freq; // TODO Better place?
        outputs['oscOut'] = node.data.oscNode;
    }
}