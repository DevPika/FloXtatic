import OscComponent from "./src/components/OscComponent.js"
import GainComponent from "./src/components/GainComponent.js"
import DestComponent from "./src/components/DestComponent.js"

// Start off by initializing a new context.
var context = new (window.AudioContext || window.webkitAudioContext)();

if (context.state === 'suspended') {
  const overlay = document.getElementById('overlay');
  overlay.style.display = "block";
  document.addEventListener('click', () => {
    context.resume().then(() => {
      overlay.style.display = "none";
    });
  }, {once: true});
}



var audioSocket = new Rete.Socket('Audio socket');

(async () => {
    var container = document.querySelector('#rete');
    var components = [
      new OscComponent(audioSocket, context),
      new GainComponent(audioSocket, context),
      new DestComponent(audioSocket, context)
    ];
    
    var editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin.default);
    editor.use(VueRenderPlugin.default);    
    editor.use(ContextMenuPlugin.default);
    // editor.use(AreaPlugin);
    // editor.use(CommentPlugin.default);
    // editor.use(HistoryPlugin);
    // editor.use(ConnectionMasteryPlugin.default);
    // editor.use(DockPlugin.default, {
    //     container: document.querySelector('.dock'),
    //     itemClass: 'item', // default: dock-item 
    //     plugins: [VueRenderPlugin]
    // });

    var engine = new Rete.Engine('demo@0.1.0');
    
    components.map(c => {
        editor.register(c);
        engine.register(c);
    });

    const osc = await components[0].createNode({freq: 220});
    const gain = await components[1].createNode({gainValue: 0.01});
    const dest = await components[2].createNode();

    osc.position = [100, 200];
    gain.position = [350, 120];
    dest.position = [600, 100];
 

    editor.addNode(osc);
    editor.addNode(gain);
    editor.addNode(dest);

    editor.connect(osc.outputs.get('oscOut'), gain.inputs.get('gainIn'));
    editor.connect(gain.outputs.get('gainOut'), dest.inputs.get('audioNodeIn'));


    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
      console.log('process');
        await engine.abort();
        await engine.process(editor.toJSON());
    });

    editor.view.resize();
    // AreaPlugin.zoomAt(editor);
    editor.trigger('process');
})();