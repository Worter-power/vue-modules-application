let _styles = {
    td: 'text-align: center;',
    th: 'text-align: center;font-weight: bold;'
};

/**
 * 解析表格上的download-options属性
 * @author Say
 * @date 2017年11月15日
 * @return
 */
function parseOptions(tableNode, _opt) {
    let _options = {},
        _s = tableNode.getAttribute('data-download-options') ? tableNode.getAttribute('data-download-options').replace(/^\s+|\s+$/g, '') : '';
    if (_s) {
        if (_s.substring(0, 1) != '{') {
            _s = '{' + _s + '}';
        }
        _options = (new Function('return ' + _s))();
    }
    
    console.log(_options,_opt)
    return Object.assign({}, _options, _opt);
}

/**
 * 解析表格Html代码
 * @author Say
 * @date 2017年11月15日
 * @return
 */
function parseHtml(tableNode, _opt) {
    let _options = parseOptions(tableNode, _opt);
    var title
    if (_options && typeof _options.title != 'undefined') {
        title = _options.title;
    }
    if (_opt && _opt.title) {
        title = _opt.title
    }
    
    var htmlNode = tableNode.cloneNode(true)
    var maxColspan = 0
    // 表内容
    for (let r = 0; r < htmlNode.getElementsByTagName('tr').length; r++) {
        let str = ''
        var colspanNum = 0
        for (let i = 0; i < htmlNode.getElementsByTagName('tr')[r].children.length; i++) {
            let _node = htmlNode.getElementsByTagName('tr')[r].children[i],
                _nodeName = _node.tagName.toLocaleLowerCase();
            _node.setAttribute('colspan', parseInt(_node.getAttribute('colspan') || 1))
            _node.setAttribute('rowspan', parseInt(_node.getAttribute('rowspan') || 1))
            str += '<'
                + _nodeName
                + ' colspan=' + _node.getAttribute('colspan')
                + ' rowspan=' + _node.getAttribute('rowspan')
                + ' style="' + _styles[_nodeName]
                + '">'
                + _node.innerText
                + '</' + _nodeName + '>'
            colspanNum += parseInt(_node.getAttribute('colspan') || 1)
        }
        if (colspanNum > maxColspan) {
            maxColspan = colspanNum
        }
        htmlNode.getElementsByTagName('tr')[r].innerHTML = str
    }
    // 表标题(data-download-options中的title可以设置多级表头，一个可以用字符串传，多级表头使用数组来传)
    if (title) {
        let _title = title
        if (Object.prototype.toString.call(title) != '[object Array]') {
            _title = [title]
        }
        for (let t = _title.length - 1; t >= 0; t--) {
            if (htmlNode.getElementsByTagName('thead').length > 0) {
                let newItem = document.createElement("TR")
                newItem.innerHTML = '<th' + ' colspan=' + maxColspan + ' style="' + _styles.th + '">' + _title[t] + '</th>'
                htmlNode.getElementsByTagName('thead')[0].insertBefore(newItem, htmlNode.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0])
            } else {
                let newItem= '<thead><tr><th' + ' colspan=' + maxColspan + ' style="' + _styles.th + '">' + _title[t] + '</tr></th></thead>'
                htmlNode.innerHTML = newItem + htmlNode.innerHTML
            }
        }
    }
    return {
        html: '<table>' + htmlNode.innerHTML + '</table>',
        fileName: _options.fileName
    };
}

export default (_opt = {}) => {
    let tablesNode = document.getElementsByTagName('table'),
        _fileName,
        _html = '';
    // 指令传入配置项
    
    if (_opt.tables && _opt.refs) {
        _opt.tables.forEach(e => {
            let id,
                title;
            if (Object.prototype.toString.call(e) == '[object Object]') {
                id = e.id;
                title = e.title;
            }
            let table = _opt.refs[id];
            if (!table) {
                return true;
            }
            let obj = parseHtml(table, Object.assign({}, _opt, {
                title
            }));
            _html += obj.html;
            _fileName = obj.fileName;
        })
    } else {
        for (let i = 0; i < tablesNode.length; i++) {
            if (tablesNode[i].hasAttribute('data-download-options')) {
                let obj = parseHtml(tablesNode[i], _opt);
                _html += obj.html;
                _fileName = obj.fileName;
            }
        }
    } 
    _opt.fileName = _fileName;
    _opt.submit(_opt, _html);
};