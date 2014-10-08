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
				if ($('#ageb-content').is(':visible')) $("#ageb-content").hide('clip', {}, 400);
			}
		}).error(function(errors) {});
	}

	function plotAgeb(data) {
		var agebData = [
			['#ageb_pob', [{
				name: 'Poblacion Total',
				data: [data.rows[0].pob_total]
			}]],
			['#ageb_eco', [{
				name: 'Poblacion Economicamente Activa',
				data: [data.rows[0].eco_activa]
			}, {
				name: 'Poblacion Ocupada',
				data: [data.rows[0].eco_ocupada]
			}]],
			['#ageb_edu', [{
				name: 'Escolaridad Promedio',
				data: [data.rows[0].edu_prom_escolaridad]
			}]],
			['#ageb_viv', [{
				name: 'Viviendas Total',
				data: [data.rows[0].viv_total]
			}, {
				name: 'Viviendas con Internet',
				data: [data.rows[0].viv_con_internet]
			}, {
				name: 'Viviendas con celular',
				data: [data.rows[0].viv_con_celular]
			}]]
		];
		document.getElementById("ageb-clave").innerHTML = 'AGEB con clave: ' + data.rows[0].cvegeo;
		document.getElementById("ageb-belong").innerHTML = 'Pertenece a: ' + data.rows[0].nom_mun + ' [FUENTE: <a href ="http://www.inegi.org.mx/sistemas/consulta_resultados/ageb_urb2010.aspx?c=28111" target="_blank"> INEGI </a> Censo 2010]';
		for (var i = 0, j = agebData.length; i < j; i++) {
			$(agebData[i][0]).highcharts({
				chart: {
					type: 'bar'
				},
				title: {
					text: ''
				},
				xAxis: {
					categories: '',
					title: {
						text: null
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: null
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
				series: agebData[i][1]
			});
			if ($(agebData[i][0]).highcharts().series.length === 1) {
				$(agebData[i][0]).highcharts().series[0].update({
					pointWidth: 40
				});
			}
		}
	}

	function drawAgeb(data, viewSource) {
		clearAgebHighlight();
		// DASHED LINE AGEB PERIMETER ON HOME VIEW
		if (viewSource == "home") {
			agebHighlight(data.rows[0].cartodb_id);
		} else if (viewSource == "agebUrbano") {
			// POLYGONS ON AGEB VIEW
			/* document.getElementById("CICCheck").style.display = 'block'; */
			$('.cluster').css('display', 'none');
			$('#ageb-chorodiv').css('display', 'block');
			document.getElementById("upperAgeb").innerHTML = "...";
			document.getElementById("lowerAgeb").innerHTML = "Calculando";
			var ageb_style = "#" + table_ageb + "{polygon-fill:#70A2C2;polygon-opacity:0.7;line-color:#FFF;line-width:1;line-opacity:1;}";
			var q = agebFormQ(data, viewSource);
			//CHOROPLETH TOGGLED
			if (choro) {
				$('#mun-legend-div').css('display', 'none');
				$('#legendAgeb').css('display', 'block');
				callCartoCss();
			} else {
				//ANY MUN FILTER ON?
				var auxMunFilt = false;
				for (var x in mun) {
					if (mun[x]) {
						auxMunFilt = true;
						break;
					}
				}
				//CSS HEX FOR AGEBs BY MUN
				if (auxMunFilt) {
					rmdHexArr = getHexColor();
					$('#mun-legend-div').css('display', 'block');
					var legendPair = [];
					var writeHtml = '';
					ageb_style = '#' + table_ageb + '{polygon-opacity: 0.7;line-color: #FFF;line-width: 1;line-opacity: 1;} ';
					//pair long mun long name from array created on agebformQ with hex color value and create ageb cartocss
					for (var i = 0; i < munNL.length; i++) {
						for (var j = 0; j < munLongName.length; j++) {
							if (munLongName[j] === munNL[i][1]) {
								legendPair.push([munNL[i][1], rmdHexArr[i]]);
							}
						}
						ageb_style += "#" + table_ageb + "[nom_mun = '" + munNL[i][1] + "'] {polygon-fill: " + rmdHexArr[i] + ";}";
					}
					ageb_style += "#" + table_ageb + "{polygon-fill: #FFF;}";
					//write HTML for legend
					for (var n = 0; n < legendPair.length; n++) {
						writeHtml += "<li><span style='background:" + legendPair[n][1] + ";'></span>" + legendPair[n][0] + "</li>"
					}
					$("#mun-legend").html(writeHtml);
				}
				$('#legendAgeb').css('display', 'none');
				layers[1].setOptions({
					query: q,
					tile_style: ageb_style
				});
				layers[1].show();
			}
			layers[1].setInteraction(true);
		}
	}

	function callCartoCss() {
		if (closeDistance) {
			var n = "WITH data AS (" + _geoq + ") SELECT " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id, count(data.*) AS cuenta FROM data, " + table_ageb + " WHERE ST_Intersects(data.the_geom, " + table_ageb + ".the_geom) GROUP BY " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id";
		} else {
			var n = agebFormQ(_geoq, "choropleth");
		}
		var q = "WITH dataBins AS ( WITH data AS (" + _geoq + ") SELECT " + table_ageb + ".the_geom_webmercator, count(data.*) AS cuenta FROM data, " + table_ageb + " WHERE ST_Intersects(data.the_geom, " + table_ageb + ".the_geom) GROUP BY " + table_ageb + ".the_geom_webmercator) SELECT CDB_QuantileBins(array_agg(dataBins.cuenta), 3) FROM dataBins";
		//color intensity from high to low
		var colorArray = ['#F03B20', '#FEB24C', '#FFEDA0'];
		sql.execute(q).done(function(data) {
			cartoCssBins = data.rows[0].cdb_quantilebins;
			cartoCssStyle = "#{{table_name}}{polygon-fill:#FFFFB2;polygon-opacity:0.8;line-color:#000;line-width:1;line-opacity:1;}#{{table_name}}[cuenta<=" + cartoCssBins[2] + "]{polygon-fill:" + colorArray[0] + ";}#{{table_name}}[cuenta<=" + cartoCssBins[1] + "]{polygon-fill:" + colorArray[1] + ";}#{{table_name}}[cuenta<=" + cartoCssBins[0] + "]{polygon-fill:" + colorArray[2] + ";}";
			
			console.log('Query choropleth');
			console.log(n);
			console.log('CSS choropleth');
			console.log(cartoCssStyle);

			document.getElementById("upperAgeb").innerHTML = cartoCssBins[2];
			document.getElementById("lowerAgeb").innerHTML = "<" + cartoCssBins[0];
			layers[1].setOptions({
				query: n,
				tile_style: cartoCssStyle
			});
			layers[1].show();
		}).error(function(errors) {
			console.log("some error occurred: " + errors);
		});
	}

	function agebFormQ(data, source) {
		if (closeDistance && !choro) {
			var q = "WITH data AS (" + _geoq + ") SELECT " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id, count(data.*) AS cuenta FROM data, " + table_ageb + " WHERE ST_Intersects(data.the_geom, " + table_ageb + ".the_geom) GROUP BY " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id";
			map.setZoom(15);
		} else {
			//if 'mun_poly' replace to use ageb geoms instead
			if (data.search(table_area) != -1) {
				munLongName = [];
				// extract st_intersects clause
				var munInter = data.substring(data.search('ST_Intersects'));
				// isolate st_intersects clause until first parenthesis
				var munGeom = munInter.substring(0, munInter.search('\\) AND') + 5);
				// replace st_intersects clause with blanks and remove double spaces
				var qSinInter = data.replace(munGeom, '').replace('  ', ' ');
				// isolate area name IN clause
				var munNom = qSinInter.substring(qSinInter.search(table_area + '.name'));
				// replace area name table with ageb table
				var regex = new RegExp(table_area + '.name', 'g');
				var munAgebLong = munNom.replace(regex, table_ageb + '.nom_mun');
				//TODO: include short names on ageb table to remove this for loop and arrange qSinInter to be data for q
				for (var x in mun) {
					if (mun[x]) {
						var xUp = x.toUpperCase();
						for (var y = 0, z = munNL.length; y < z; y++) {
							if (munNL[y][0] === xUp) {
								long_name = munNL[y][1];
							}
						}
						munAgebLong = munAgebLong.replace(xUp, long_name);
						munLongName.push(long_name);
					}
				}
				//TODO from clause contains mun_poly not ageb table
				data = qSinInter.replace(munNom, munAgebLong);
			}
			//BASE SELECT CLAUSE FOR AGEB Q
			var agebSelect = "SELECT " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id, ";
			if (source === "agebUrbano") agebSelect += table_ageb + ".nom_mun FROM ";
			else if (source == "choropleth") agebSelect += "count(" + table_name + ".*) as cuenta FROM ";
			else if (source === "infowindow") agebSelect = "SELECT " + table_name + ".* FROM ";
			//FROM CLAUSE
			var agebFrom = table_name + ", " + table_ageb + " ";
			//WHERE CLAUSE EXTRACTED (CHECK FOR ORDER BY CLAUSE)
			if (data.search(/where/i) != -1) {
				if (data.search(/order by/i) != -1) {
					var agebWhere = data.substring(data.search(/where/i), data.search(/order by/i));
					var agebOrderby = data.substring(data.search(/order by/i) - 1);
				} else {
					var agebWhere = data.substring(data.search(/where/i));
					var agebOrderby = "";
				}
				agebWhere += " AND ";
			} else {
				if (data.search(/order by/i) != -1) {
					var agebOrderby = data.substring(data.search(/order by/i) - 1);
				} else {
					var agebOrderby = "";
				}
				var agebWhere = "WHERE ";
			}
			agebWhere += "ST_Intersects(" + table_name + ".the_geom, " + table_ageb + ".the_geom)";
			if (source === "infowindow") {
				agebWhere += " AND " + table_ageb + ".cartodb_id = " + selectedAgeb;
			}
			if (source == "choropleth") var agebGroup = " GROUP BY " + table_ageb + ".the_geom_webmercator, " + table_ageb + ".cartodb_id";
			else var agebGroup = "";
			if (data == "SELECT * FROM " + table_name && !choro && source != "infowindow") {
				var q = "SELECT * FROM " + table_ageb;
			} else {
				var q = agebSelect + agebFrom + agebWhere + agebGroup + agebOrderby;
			}
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

	function agebHighlight(ID) {
		var url = "http://cicadmin.cartodb.com/api/v1/sql?q=SELECT cvegeo, cartodb_id, ST_AsGeoJSON(the_geom) as geoj FROM " + table_ageb + " where cartodb_id = " + ID;
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
		if (closeDistance) var n = "with data as (" + _geoq + ") SELECT data.* FROM data, " + table_ageb + " WHERE ST_Intersects(data.the_geom, " + table_ageb + ".the_geom) AND  " + table_ageb + ".cartodb_id = " + selectedAgeb;
		else var n = agebFormQ(_geoq, "infowindow");
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
							if (catColors[x][1] === catMarkers[j][3]) {
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
		hexColors.sort(function() {
			return 0.5 - Math.random()
		});
		return hexColors;
	}