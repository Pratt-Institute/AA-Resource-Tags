var $ = jQuery;
var PREFIX = "aa-";
var INPUT_PREFIX = PREFIX + "input-";

String.prototype.format = function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

function append_search_field(field, container) {
    if (field.searchability != "Searchable")
        return;
    var html;
    switch (field.type) {
        case "Text":
            html = '<tr><td>{field_name}</td><td><input type="text" name="{name}" id="{name}"></td></tr>'.format({
                name: INPUT_PREFIX + field.name,
                field_name: field.name
            });
            break;
        case "MC":
            html = '<tr><td>{field_name}</td><td><input type="text" name="{name}" id="{name}"></td></tr>'.format({
                name: INPUT_PREFIX + field.name,
                field_name: field.name
            });
            break;
        case "Dropdown":
            html = '<tr><td>{field_name}</td><td><select name="{name}" id="{name}" ></td></tr>'.format({
                name: INPUT_PREFIX + field.name,
                field_name: field.name
            });
            break;
    }
    container.append(html);
}

function tagify_all(fields) {
    for (var i = 0; i < fields.length; i++) {
        switch (fields[i].type) {
            case 'MC':
                new Tagify($('#' + INPUT_PREFIX + fields[i].name).get(0), { whitelist: Array.from(fields[i].options) });
                break;
            case 'Dropdown':
                var ops_html = '<option value="">Any</option>';
                var options = Array.from(fields[i].options).sort();
                for (var o of options)
                    ops_html += '<option value="{0}">{0}</option>'.format(o);

                $('#' + INPUT_PREFIX + fields[i].name).append(ops_html);
        }
    }
}


function get_results_html(fields, data, results) {
    function should_display(field) {
        return !(field.type == 'Dropdown' || field.searchability == 'Hidden');
    }
    function get_link_field() {
        for (var i = 0; i < fields.length; i++)
            if (fields[i].name == 'Link')
                return i;
        return -1;
    }

    var html = '<p>{0} Results</p><table style="width: 100%;">'.format(results.length);
    for (var i = 0; i < fields.length; i++) {
        html += '<col style="width: 10%">';
    }
    html += '<thead><tr>';
    for (var i = 0; i < fields.length; i++) {
        if (should_display(fields[i]))
            html += '<th>' + fields[i].name + '</th>';
    }
    html += '</tr></thead><tbody>';
    link_field = get_link_field();

    results.forEach(function (index) {
        html += '<tr>';
        for (var j = 0; j < fields.length; j++) {
            if (should_display(fields[j])) {
                if (fields[j].name == 'Name') {
                    if (data[index][link_field])
                        html += '<td><a href="{0}">{1}</td>'.format(data[index][link_field], data[index][j]);
                    continue;
                }
                switch (fields[j].type) {
                    case 'MC':
                        html += '<td>' + data[index][j].join(' | ') + '</td>';
                        break;
                    case 'Text':
                        html += '<td>' + data[index][j] + '</td>';
                        break;
                }
            }
        }
        html += '</tr>';

    });

    html += '</tbody></table>';
    return html;
}

function filter_for_field(field, data, included) {
    included_ = [];
    var input = $('#' + INPUT_PREFIX + field.name).val();
    if (input == '')
        return included;
    if (field.type == 'MC') {
        input = JSON.parse(input);
    }
    included.forEach(function (index) {
        switch (field.type) {
            case 'MC':
                var subset = input.every(function (val) { return data[index][field.index].indexOf(val.value) >= 0; });
                if (subset)
                    included_.push(index);
                break;
            case 'Text':
                input = input.toLowerCase();
                if (data[index][field.index].toLowerCase().includes(input))
                    included_.push(index);
                break;
            case 'Dropdown':
                if (data[index][field.index].includes(input))
                    included_.push(index);
                break;
        }
    });
    return included_;
}

$(document).ready(function () {
    var container = $('#aa-resource-form');
    var data = $.csv.toArrays(csv_file);
    var fields = [];

    for (var i = 0; i < data[0].length; i++) {
        var attrs = data[1][i].split('-');
        fields.push({ index: i, name: data[0][i], search_order: attrs[0], type: attrs[1], searchability: attrs[2] });
    }
    data = data.splice(2);
    for (var i = 0; i < fields.length; i++) {
        if (['MC', 'Dropdown'].includes(fields[i].type)) {
            var options = new Set();
            for (var j = 0; j < data.length; j++) {
                data[j][i] = data[j][i].split('|');
                data[j][i].forEach(function (option) {
                    options.add(option);
                })
            }
            options.delete('');
            fields[i].options = options;
        }
    }

    var search_order = fields.slice().sort(function (a, b) {
        return a.search_order - b.search_order;
    });
    for (var i = 0; i < search_order.length; i++)
        append_search_field(search_order[i], container);

    var button = '<button type="button" id="{0}">Search</button>'.format(INPUT_PREFIX + 'submit');
    container.append(button);
    tagify_all(fields);

    $('#' + INPUT_PREFIX + 'submit').click(function () {
        var results = [...Array(data.length).keys()];
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].searchability == "Searchable")
                results = filter_for_field(fields[i], data, results);
        }
        $('#aa-resource-results').html(get_results_html(fields, data, results));
    });
});