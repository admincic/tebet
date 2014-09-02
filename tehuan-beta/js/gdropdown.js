	/************Classes to set up the drop-down control************/

	function checkBox(options) {
		var dropDownContainer = document.createElement('DIV');
		dropDownContainer.className = "checkboxContainer";
		dropDownContainer.title = options.title;
		var span = document.createElement('SPAN');
		span.role = "checkbox";
		span.className = "checkboxSpan";
		var bDiv = document.createElement('DIV');
		bDiv.className = "blankDiv";
		bDiv.id = options.id;
		var image = document.createElement('IMG');
		image.className = "blankImg";
		image.src = "http://maps.gstatic.com/mapfiles/mv/imgs8.png";
		var label = document.createElement('LABEL');
		label.className = "checkboxLabel";
		label.innerHTML = options.label;
		bDiv.appendChild(image);
		span.appendChild(bDiv);
		dropDownContainer.appendChild(span);
		dropDownContainer.appendChild(label);
		google.maps.event.addDomListener(dropDownContainer, 'click', function() {
			if (document.getElementById(bDiv.id).style.display == 'block') {
				document.getElementById(bDiv.id).style.display = 'none';
				if (options.layer == "carto") {
					if (activeView == 'home') layers[0].hide();
					else if (activeView == 'agebUrbano') layers[1].hide();
				
				} else {
					options.layer.setMap(null);
				}
			} else {
				document.getElementById(bDiv.id).style.display = 'block';
				if (options.layer == "carto") {
					if (activeView == 'home') layers[0].show();
					else if (activeView == 'agebUrbano') layers[1].show();
				} else {
					options.layer.setMap(map);
				}
			}
		})
		return dropDownContainer;
	}
	function dropDownOptionsDiv(options) {
		var dropDownContainer = document.createElement('DIV');
		dropDownContainer.className = "dropDownOptionsDiv";
		dropDownContainer.id = options.id;
		for (i = 0; i < options.items.length; i++) {
			dropDownContainer.appendChild(options.items[i]);
		}
		return dropDownContainer;
	}
	function dropDownControl(options) {
		var dropDownContainer = document.createElement('DIV');
		dropDownContainer.className = 'dropDownContainer';
		var control = document.createElement('DIV');
		control.className = 'dropDownControl';
		control.innerHTML = options.name;
		control.id = options.id;
		var arrow = document.createElement('IMG');
		arrow.src = "http://maps.gstatic.com/mapfiles/arrow-down.png";
		arrow.className = 'dropDownArrow';
		control.appendChild(arrow);
		dropDownContainer.appendChild(control);
		dropDownContainer.appendChild(options.dropDown);
		options.gmap.controls[options.position].push(dropDownContainer);
		google.maps.event.addDomListener(dropDownContainer, 'click', function() {
			cicCheck++;
			(document.getElementById('myddOptsDiv').style.display == 'block') ? document.getElementById('myddOptsDiv').style.display = 'none' : document.getElementById('myddOptsDiv').style.display = 'block';
			if(cicCheck==1){ 
			    document.getElementById("CICCheck").style.display = 'block';
			}
		})

	}