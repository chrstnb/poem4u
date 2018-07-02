let poems;
function go() {
	let url_pieces = window.location.href.match('[?&]value=([^&]+)');
	if (url_pieces) {
		poems = JSON.parse(LZString.decompressFromBase64(url_pieces[1]));
		document.getElementById('editor').href = "editor.html?&value=" + window.location.href.match('[?&]value=([^&]+)')[1];
		listTags(printTags);
	}
	if (!poems) {
		jQuery.getJSON('./js/poems.json', function (data) {
			poems = data;
			listTags(printTags);
		});
	}
}

function listTags(pT) {
	let tags = [];
	for (var i = 0; i < poems.length; i++) {
		let poem = poems[i];
		let t = poem["tags"];
		for (var j = 0; j < t.length; j++) {
			if (tags.indexOf(t[j]) == -1) {
				tags.push(t[j]);
			}
		}
	}
	pT(tags);
}

function printTags(tags) {
	let h = "";
	for (var i = 0; i < tags.length; i++) {
		var button = "<button class=\"tag_button\" id=\""+tags[i]+"\">"+tags[i]+"</button>";
		h += button;
	}
	document.getElementById("links").innerHTML = h;
	buttons = document.getElementById("links").getElementsByTagName( 'button' );
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].onclick = function() {
			sortByTags(this.id);
		}
	}
}

function sortByTags(tag) {
	let poem_list = poems.filter(function(poem) {
        return poem["tags"].indexOf(tag) != -1;
    });
    let h = "";
    poem_list.forEach(function(poem) {
    	var a = "";
    	if (poem.link != null) {
    		a = poem.link;
    	} else {
    		a = "./poems/" + poem.title + ".txt";
    	}
    	var atag = "<p id=\"poem\"><a href=\""+a+"\" target=\"blank\"><button class=\"poem_button\" id=\""+poem.title+"\">"+poem.title+"</button></a> by " + poem.author + "</p>";
    	h += atag; 
    });
    document.getElementById("poem_list").innerHTML = h;
    buttons = document.getElementById("poem_list").getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
    	buttons[i].onclick = function() {
    		removeBackgroundColor();
    		this.setAttribute("style", "background-color: lavender");
    	}
    }
}

function removeBackgroundColor() {
    buttons = document.getElementById("poem_list").getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
    	buttons[i].setAttribute("style", "background-color: none");
    }
}
