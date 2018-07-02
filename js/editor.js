let schema;
let editor;
let startval;
function go() {
	if(window.location.href.match('[?&]value=([^&]+)')) {
        try {
            startval = JSON.parse(LZString.decompressFromBase64(window.location.href.match('[?&]value=([^&]+)')[1]));
        }
        catch(e) {
            console.log('invalid starting schema');
        }
    }

	$.getJSON('./js/schema.json', function (data) {
		schema = data.schema;
		$.getJSON('./js/poems.json', function (poems) {
			if (!startval) {
				console.log("here");
				startval = poems;
			}

			editor = new JSONEditor(document.getElementById("editor_holder"),{
				schema: schema,
				startval: startval,
				disable_array_reorder: true,
				disable_collapse: true,
				disable_edit_json: true,
				disable_properties: true,
				prompt_before_delete: false,
				theme: 'bootstrap3'
			});


			editor.on('change',function() {
			    var json = editor.getValue();

			    document.getElementById('output').value = JSON.stringify(json,null,2);
			    updateDirectLink();

			    // Materialize extra.
			    if (window.Materialize) window.Materialize.updateTextFields();

			});
			updateDirectLink();
		});
		$('#write').click(function(){
			$.ajax({
				type: "POST",
				url: "test.php",
				data: {data: document.getElementById('output').value},
				success: function(msg){
					console.log(msg);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("Some error occured");
				}
			});
		});
	});
}


updateDirectLink = function() {
	var url = window.location.href.replace(/\?.*/,'');

	url += '&value='+LZString.compressToBase64(JSON.stringify(editor.getValue()));

    for(var i in JSONEditor.defaults.options) {
        if(!JSONEditor.defaults.options.hasOwnProperty(i)) continue;
        if(JSONEditor.defaults.options[i]===false) continue;
        else if(JSONEditor.defaults.options[i]===true) {
            url += '&'+i;
        }
        else {
            url += '&'+i+'='+JSONEditor.defaults.options[i];
        }
    }

    document.getElementById('direct_link').href = url;
    url = url.replace("editor.html", "index.html?");
    document.getElementById('visualize').href = url;
};

function download() {
	var element = document.createElement('a');
	var poems = document.getElementById('output').value;
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(poems));
	element.setAttribute('download', "poems.json");

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}



