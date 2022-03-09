// var Delta = Quill.import('delta');
// let Break = Quill.import('blots/break');
// let Embed = Quill.import('blots/embed');
let BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
	static create() {
        let node = super.create();

        return node;
    }
}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

Quill.register(DividerBlot);