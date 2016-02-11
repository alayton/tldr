var m = require('mithril');
var _ = require('underscore');

module.exports = function(vm) {
    if (vm.sifter) {
        if (vm.search().length > 0) {
            var result = vm.sifter.search(vm.search(), {
                fields: ['name'],
                sort: [{ field: 'name', direction: 'asc' }]
            });

            var filtered = [], children = vm.children();
            _.each(result.items, function(r) {
                filtered.push(children[r.id]);
            });
            vm.filteredChildren(filtered);
        } else {
            vm.filteredChildren(vm.children());
        }
    }

    return m('div', { style: { display: 'inline' } }, [
        m('a.tag.multiple', {
            href: 'javascript:;',
            onclick: _.partial(vm.showChildren, vm)
        }, m('span', [m('i.fa.fa-chevron-down'), vm.tag.name])),
        m('.popover.popover-bottom', { style: { display: 'none', position: 'absolute', top: 'auto', left: 'auto' } }, [
            m('.popover-arrow', { style: { left: '20px' } }),
            m('.popover-content', {
                style: { maxHeight: '200px', 'overflow-x': 'auto', 'overflow-y': 'scroll' }
            }, [
                m('input', { type: 'text', placeholder: 'Search', oninput: m.withAttr('value', vm.search), value: vm.search(), style: { width: '140px' } }),
                vm.children() ?
                    _.map(vm.filteredChildren(), function(tag) {
                        return m('div', m('a.tag', {
                            href: vm.onclick ? 'javascript:;' : vm.addTag(tag),
                            config: vm.onclick ? undefined : m.route,
                            onclick: vm.onclick ? vm.addTag(tag) : undefined
                        }, [
                            m('i.fa.fa-plus'), tag.name
                        ]));
                    }) :
                    m('span.fa.fa-spinner.fa-pulse')
            ])
        ])
    ]);
};