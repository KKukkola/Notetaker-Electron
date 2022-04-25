// var Delta = Quill.import('delta');
// let Break = Quill.import('blots/break');
// let Embed = Quill.import('blots/embed');
let BlockEmbed = Quill.import('blots/block/embed');
let Block = Quill.import('blots/block');

class DividerBlot extends BlockEmbed {
	static create() {
        let node = super.create();

        return node;
    }
}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

class PageBreakBlot extends Block {
    static create() {
        let node = super.create();

        return node;
    }
}
PageBreakBlot.blotName = 'pagebreak';
PageBreakBlot.tagName = 'div';

Quill.register(DividerBlot);
Quill.register(PageBreakBlot);