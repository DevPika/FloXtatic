export default class DestComponent extends Rete.Component {
    constructor(socketType, audioContext){
        super("Destination");
        this.socketType = socketType;
        this.audioContext = audioContext;
    }

    builder(node) {
        var inp1 = new Rete.Input('audioNodeIn',"Audio Node In", this.socketType);

        node.data.audioNode = this.audioContext.destination;
        return node.addInput(inp1);      ;
    }

    worker(node, inputs, outputs) {
        var input = inputs['audioNodeIn'].length?inputs['audioNodeIn'][0]:null;
        if (input && !node.data.inputNode) {
          // console.log(input);
          node.data.inputNode = input;
          input.connect(node.data.audioNode);
        } else if (!input && node.data.inputNode) {
          node.data.inputNode.disconnect(node.data.audioNode);
          node.data.inputNode = null;
        }
    }
}