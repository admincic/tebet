	function agebClick() {
		layers[1].on('featureClick', function(e, latlng, pos, data) {
			selectedAgeb = data.cartodb_id;
			getAgebInfo(selectedAgeb);
			agebHighlight(selectedAgeb);
			layers[1].infowindow.set('template', $('#infowindow_ageb').html());
		});
	}

	function getAgebInfo(ID) {
		var n = "SELECT " + table_ageb + ".* FROM " + table_ageb;
		if (activeView != "agebUrbano") n += ", " + table_name + " WHERE ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom) AND " + table_name + ".cartodb_id = " + ID;
		else n += " WHERE " + table_ageb + ".cartodb_id = " + ID;
		sql.execute(n).done(function(data) {
			if (data.total_rows) {
				document.getElementById("buttonAgeb").disabled = false;
				plotAgeb(data);
				if (activeView != "agebUrbano") drawAgeb(data, "home");
			} else {
				document.getElementById("buttonAgeb").disabled = true;
				layers[1].hide();
				if ($('#ageb-content').is(':visible')) $("#ageb-content").hide('clip', {}, 400);
			}
		}).error(function(errors) {});
	}

	function plotAgeb(data) {
		var pobCatArray = [];
		var eduCatArray = [];
		var ecoCatArray = [];
		var vivCatArray = [];
		var noneCat = [];
		for (x in data.rows[0]) {
			if (x.search(/_/) != -1) {
				var n = x.substring(0, x.search(/_/) + 1);
				switch (n) {
				case 'pob_':
					pobCatArray.push(x);
					break;
				case 'eco_':
					ecoCatArray.push(x);
					break;
				case 'edu_':
					eduCatArray.push(x);
					break;
				case 'viv_':
					vivCatArray.push(x);
					break;
				default:
					noneCat.push(n);
					break;
				}
			} else var n = "";
		}
/*
		document.getElementById('ageb-clave').innerHTML='AGEB con clave: '+data.rows[0].cvegeo;
		document.getElementById('ageb-belong').innerHTML='Pertenece a: '+data.rows[0].nom_mun;
*/
		$('#ageb_pob').highcharts({
			chart: {
				type: 'bar',
			},
			title: {
				text: 'AGEB con clave: ' + data.rows[0].cvegeo
			},
			subtitle: {
				text: 'Pertenece a: ' + data.rows[0].nom_mun + " [FUENTE: INEGI Censo 2010]"
			},
			xAxis: {
				categories: " ",
				title: {
					text: null
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: null,
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				formatter: function() {
					return this.series.name + ": " + this.y;
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				name: 'Poblacion Total',
				data: [data.rows[0].pob_total]
			}]
		});
		$('#ageb_eco').highcharts({
			chart: {
				type: 'bar',
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: " ",
				title: {
					text: null
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: null,
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				formatter: function() {
					return this.series.name + ": " + this.y;
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				name: 'Poblacion Economicamente Activa',
				data: [data.rows[0].eco_activa]
			}, {
				name: 'Poblacion Ocupada',
				data: [data.rows[0].eco_ocupada]
			}]
		});
		$('#ageb_edu').highcharts({
			chart: {
				type: 'bar',
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: " ",
				title: {
					text: null
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: null,
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				formatter: function() {
					return this.series.name + ": " + this.y;
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				name: 'Escolaridad Promedio',
				data: [data.rows[0].edu_prom_escolaridad]
			}]
		});
		$('#ageb_viv').highcharts({
			chart: {
				type: 'bar',
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: " ",
				title: {
					text: null
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: null,
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				formatter: function() {
					return this.series.name + ": " + this.y;
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				name: 'Viviendas Total',
				data: [data.rows[0].viv_total]
			}, {
				name: 'Viviendas con Internet',
				data: [data.rows[0].viv_con_internet]
			}, {
				name: 'Viviendas con celular',
				data: [data.rows[0].viv_con_celular]
			}]
		});
	}

	function drawAgeb(data, viewSource) {
		clearAgebHighlight();
		if (viewSource == "home") { // DASHED LINE AGEB PERIMETER ON REPORT VIEW
			var ageb_style = "#" + table_ageb + "{line-color:#f50238;line-dasharray:10,3,2,3;line-width:1.5;line-opacity:1;}";
			var q = "SELECT * FROM " + table_ageb + " WHERE cartodb_id = " + data.rows[0].cartodb_id;
			layers[1].setOptions({
				query: q,
				tile_style: ageb_style,
			});
			layers[1].show();
		} else if (viewSource == "agebUrbano") { // POLYGONS ON AGEB VIEW
			document.getElementById("CICCheck").style.display = 'block';
			rmdHexArr = getHexColor();
			$('.cluster').css('display', 'none');
			$('#ageb-chorodiv').css('display', 'block');
			document.getElementById("upperAgeb").innerHTML = "...";
			document.getElementById("lowerAgeb").innerHTML = "Calculando";
			var ageb_style = "#" + table_ageb + "{polygon-fill:#70A2C2;polygon-opacity:0.7;line-color:#FFF;line-width:1;line-opacity:1;}";
			var q = agebFormQ(data, "view");
			if (choro) { //CHOROPLETH TOGGLED
				$('#mun-legend-div').css('display', 'none');
				$('#legendAgeb').css('display', 'block');
				callCartoCss(q);
			} else { //NO CHOROPLETH
				var auxMunFilt = false;
				for (var x in mun) { //ANY MUN FILTER ON?
					if (mun[x]) {
						auxMunFilt = true;
						break;
					}
				}
				if (auxMunFilt) { //CSS HEX FOR AGEBs BY MUN
					$('#mun-legend-div').css('display', 'block');
					var legendPair = [];
					var writeHtml = "";
					ageb_style = "#" + table_ageb + "{polygon-opacity: 0.7;line-color: #FFF;line-width: 1;line-opacity: 1;} ";
					for (var i = 0; i < munNL.length; i++) {
						for(var j=0;j < munLongName.length;j++){
							if(munLongName[j]==munNL[i]){
								legendPair.push([munNL[i],rmdHexArr[i]]);
							}	
						}
						ageb_style += "#" + table_ageb + "[nom_mun = '" + munNL[i] + "'] {polygon-fill: " + rmdHexArr[i] + ";}";
					}
					ageb_style += "#" + table_ageb + "{polygon-fill: #FFF;}";
					for(var n=0;n<legendPair.length;n++){
						writeHtml+="<li><span style='background:"+legendPair[n][1]+";'></span>"+legendPair[n][0]+"</li>"
					}
					$("#mun-legend").html(writeHtml);
				}
				$('#legendAgeb').css('display', 'none');
				layers[1].setOptions({
					query: q,
					tile_style: ageb_style,
				});
				layers[1].show();
			}
			layers[1].setInteraction(true);
		}
	}	
	
	function callCartoCss(agebQ) {
		var n = agebFormQ(_geoq, "choropleth");
		var q = "WITH data AS (" + n + ") SELECT CDB_QuantileBins(array_agg(data.cuenta), 3) FROM data";
		sql.execute(q).done(function(data) {
			cartoCssBins = data.rows[0].cdb_quantilebins;
			cartoCssStyle = "#{{table_name}}{polygon-fill:#FFFFB2;polygon-opacity:0.8;line-color:#000;line-width:1;line-opacity:1;}#{{table_name}}[cuenta<=" + cartoCssBins[2] + "]{polygon-fill:#F03B20;}#{{table_name}}[cuenta<=" + cartoCssBins[1] + "]{polygon-fill:#FEB24C;}#{{table_name}}[cuenta<=" + cartoCssBins[0] + "]{polygon-fill:#FFEDA0;}";
			document.getElementById("upperAgeb").innerHTML = cartoCssBins[2];
			document.getElementById("lowerAgeb").innerHTML = "<" + cartoCssBins[0];
			layers[1].setOptions({
				query: n,
				tile_style: cartoCssStyle,
			});
			layers[1].show();
		}).error(function(errors) {alert("some error occurred: " + errors);});
	}

	function agebFormQ(data, source) {
		if (data.search(area_name) != -1) {
			munLongName=[];
			var munInter = data.substring(data.search("ST_Intersects"));
			var munGeom = munInter.substring(0, munInter.search("\\) AND") + 5);
			var qSinInter = data.replace(munGeom, "").replace("  ", " ");
			var munNom = qSinInter.substring(qSinInter.search("\\(" + area_name + ".name"));
			var munNoms = munNom.substring(0, munNom.search("\\)") + 1);
			var regex = new RegExp(area_name + ".name", "g");
			var munAgebLong = munNoms.replace(regex, table_ageb + ".nom_mun");
			for (x in mun) {
				if (mun[x]) {
					var xUp = x.toUpperCase();
					switch (xUp) {
						case 'ABA':
							long_name = 'Abasolo';
							break;
						case 'AGU':
							long_name = 'Agualeguas';
							break;
						case 'ADE':
							long_name = 'Allende';
							break;
						case 'ANC':
							long_name = 'Anáhuac';
							break;
						case 'APO':
							long_name = 'Apodaca';
							break;
						case 'ARA':
							long_name = 'Aramberri';
							break;
						case 'BTE':
							long_name = 'Bustamante';
							break;
						case 'CAD':
							long_name = 'Cadereyta Jiménez';
							break;
						case 'CAR':
							long_name = 'Carmen';
							break;
						case 'CER':
							long_name = 'Cerralvo';
							break;
						case 'CHI':
							long_name = 'China';
							break;
						case 'CFL':
							long_name = 'Ciénega de Flores';
							break;
						case 'DAR':
							long_name = 'Dr. Arroyo';
							break;
						case 'DCS':
							long_name = 'Dr. Coss';
							break;
						case 'DGZ':
							long_name = 'Dr. González';
							break;
						case 'GAL':
							long_name = 'Galeana';
							break;
						case 'GAR':
							long_name = 'García';
							break;
						case 'BRO':
							long_name = 'Gral. Bravo';
							break;
						case 'ESC':
							long_name = 'Gral. Escobedo';
							break;
						case 'TER':
							long_name = 'Gral. Terán';
							break;
						case 'GTR':
							long_name = 'Gral. Treviño';
							break;
						case 'ZAR':
							long_name = 'Gral. Zaragoza';
							break;
						case 'ZUA':
							long_name = 'Gral. Zuazua';
							break;
						case 'GPE':
							long_name = 'Guadalupe';
							break;
						case 'HID':
							long_name = 'Hidalgo';
							break;
						case 'HIG':
							long_name = 'Higueras';
							break;
						case 'HUA':
							long_name = 'Hualahuises';
							break;
						case 'ITU':
							long_name = 'Iturbide';
							break;
						case 'JUA':
							long_name = 'Juárez';
							break;
						case 'LAM':
							long_name = 'Lampazos de Naranjo';
							break;
						case 'LIN':
							long_name = 'Linares';
							break;
						case 'ALD':
							long_name = 'Los Aldamas';
							break;
						case 'HER':
							long_name = 'Los Herreras';
							break;
						case 'RAM':
							long_name = 'Los Ramones';
							break;
						case 'MAR':
							long_name = 'Marín';
							break;
						case 'MOC':
							long_name = 'Melchor Ocampo';
							break;
						case 'MYN':
							long_name = 'Mier y Noriega';
							break;
						case 'MIN':
							long_name = 'Mina';
							break;
						case 'MON':
							long_name = 'Montemorelos';
							break;
						case 'MTY':
							long_name = 'Monterrey';
							break;
						case 'PAR':
							long_name = 'Parás';
							break;
						case 'PES':
							long_name = 'Pesquería';
							break;
						case 'RAY':
							long_name = 'Rayones';
							break;
						case 'SAB':
							long_name = 'Sabinas Hidalgo';
							break;
						case 'SAL':
							long_name = 'Salinas Victoria';
							break;
						case 'SN':
							long_name = 'San Nicolás de los Garza';
							break;
						case 'SP':
							long_name = 'San Pedro Garza García';
							break;
						case 'SC':
							long_name = 'Santa Catarina';
							break;
						case 'STG':
							long_name = 'Santiago';
							break;
						case 'VLO':
							long_name = 'Vallecillo';
							break;
						case 'VAL':
							long_name = 'Villaldama';
							break;
						default:
							break;
					}
					munAgebLong = munAgebLong.replace(xUp, long_name);
					munLongName.push(long_name);
				}
			}
			data = qSinInter.replace(munNoms, munAgebLong);
		}
		//BASE SELECT FOR AGEB Q
		if (source == "view") var agebSelect = "SELECT " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id, " + table_ageb + ".nom_mun FROM ";
		else if (source == "choropleth") var agebSelect = "SELECT " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id, count(" + table_name + ".*) as cuenta FROM ";
		else if (source == "infowindow") var agebSelect = "SELECT " + table_name + ".* FROM ";
		//FROM CLAUSE
		var agebFrom = table_name + ", " + table_ageb + " ";
		//WHERE CLAUSE EXTRACTED (CHECK FOR ORDER BY CLAUSE)
		if (data.search(/where/i) != -1) {
			if (data.search(/order by/i) != -1) {
				if (source != "infowindow") {
					var agebWhere = data.substring(data.search(/where/i), data.search(/order by/i)) + " AND ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom)";
				} else {
					var agebWhere = data.substring(data.search(/where/i), data.search(/order by/i)) + " AND ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom) AND " + table_ageb + ".cartodb_id = " + selectedAgeb;
				}
				var agebOrderby = data.substring(data.search(/order by/i) - 1);
			} else {
				if (source != "infowindow") {
					var agebWhere = data.substring(data.search(/where/i)) + " AND ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom)";
				} else {
					var agebWhere = data.substring(data.search(/where/i)) + " AND ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom) AND " + table_ageb + ".cartodb_id = " + selectedAgeb;
				}
				var agebOrderby = "";
			}
		} else {
			if (data.search(/order by/i) != -1) {
				var agebOrderby = data.substring(data.search(/order by/i) - 1);
			} else {
				var agebOrderby = "";
			}
			if (source != "infowindow") {
				var agebWhere = "WHERE ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom)";
			} else {
				var agebWhere = "WHERE ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom) AND " + table_ageb + ".cartodb_id = " + selectedAgeb;
			}
		}
		if (source != "infowindow") var agebGroup = " GROUP BY " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id";
		else var agebGroup = "";
		if (source == "choropleth") agebGroup += ", " + table_ageb + ".nom_mun";
		if(data == "SELECT * FROM "+table_name && !choro && source !="infowindow"){
			var q = "SELECT * FROM "+table_ageb;
		}else{
			var q = agebSelect + agebFrom + agebWhere + agebGroup + agebOrderby;
		}
		return q;
	}
	
	function clearAgebHighlight() {
		if (typeof newBorder != "undefined") newBorder.setMap(null);
	}

	function drawHighlight(agebPath) {
		clearAgebHighlight();
		var options = {
			path: agebPath,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		};
		newBorder = new google.maps.Polyline(options);
		newBorder.setMap(map);
	}

	function agebHighlight() {
		var url = "http://cicadmin.cartodb.com/api/v1/sql?q=SELECT cvegeo, cartodb_id, ST_AsGeoJSON(the_geom) as geoj FROM " + table_ageb + " where cartodb_id = " + selectedAgeb;
		$.getJSON(url, function(response) {
			for (i in response.rows) {
				var coords = JSON.parse(response.rows[i].geoj).coordinates[0][0],
					agebCoords = new Array();
				for (j in coords) {
					agebCoords.push(new google.maps.LatLng(coords[j][1], coords[j][0]))
				}
				drawHighlight(agebCoords);
			}
		}).fail(function() {});
	}

	function agebInfowindow() {
		var writeHtml = "";
		var n = agebFormQ(_geoq, "infowindow");
		var infowAgebStyle = "";
		var infowAgebImg = "";
		sql.execute(n).done(function(data) {
			document.getElementById("agebReportcount").innerHTML = "Total de reportes: " + data.total_rows;
			var agebDiv = document.getElementById("agebReportDetail");
			for (var i = 0; i < data.total_rows; i++) {
				for (var j = 0; j < catMarkers.length; j++) {
					if (data.rows[i].post_cat === catMarkers[j][0]) {
						infowAgebImg = sourceurl + "cat/" + catMarkers[j][1];
						for (var x = 0; x < catColors.length; x++) {
							if (catColors[x][1] === catMarkers[j][2]) {
								infowAgebStyle = catColors[x][0];
							}
						}
					}
				}				
				var url = window.location.href.split('?')[0] + '?ticket=' + data.rows[i].ticket + '&table_name=' + table_name;
				var agebReportContent = data.rows[i].post_title || data.rows[i].post_content;
				writeHtml += "<br><div><a href='" + url + "' target= _blank> <img width='40' height='40' src=" + infowAgebImg + "></a> <div class='ageb-infowindow' style='background-color:" + infowAgebStyle + ";'>" + agebReportContent + " <a href='" + url + "' target= _blank>>></a></div></div>";
			}
			$("#agebReportDetail").html(writeHtml);
		}).error(function(errors) {});
	}
	
	function getHexColor() {
		var hexColors = ['#E62E44', '#E62E59', '#E62E6F', '#E62E84', '#E62E9A', '#E62EB0', '#E62EC5', '#E62EDB', '#DB2EE6', '#C52EE6', '#B02EE6', '#9A2EE6', '#842EE6', '#6F2EE6', '#592EE6', '#442EE6', '#2E2EE6', '#2E43E6', '#2E59E6', '#2E6FE6', '#2E84E6', '#2E9AE6', '#2EB0E6', '#2EC5E6', '#2EDBE6', '#2EE6DB', '#2EE6C5', '#2EE6AF', '#2EE69A', '#2EE684', '#2EE66F', '#2EE659', '#2EE643', '#2EE62E', '#43E62E', '#59E62E', '#6FE62E', '#84E62E', '#9AE62E', '#B0E62E', '#C5E62E', '#DBE62E', '#E6DB2E', '#E6C52E', '#E6B02E', '#E69A2E', '#E6842E', '#E66F2E', '#E6592E', '#E6432E', '#E62E2E'];
		hexColors.sort(function() {return 0.5 - Math.random()});
		return hexColors;
	}	