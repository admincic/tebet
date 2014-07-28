var reports = {
	monterrey_closed: [],
	monterrey_open: [],
	monterrey_days: [],
	monterrey_vias: [],
	sanpedro_closed: [],
	sanpedro_open: [],
	sanpedro_days: [],
	sanpedro_vias: [],
	guadalupe_closed: [],
	guadalupe_open: [],
	guadalupe_days: [],
	guadalupe_vias: [],
	sannico_closed: [],
	sannico_open: [],
	sannico_days: [],
	sannico_vias: [],
	santacat_closed: [],
	santacat_open: [],
	santacat_days: [],
	santacat_vias: [],
	apodaca_closed: [],
	apodaca_open: [],
	apodaca_days: [],
	apodaca_vias: [],
	cadereyta_closed: [],
	cadereyta_open: [],
	cadereyta_days: [],
	cadereyta_vias: [],
	juarez_closed: [],
	juarez_open: [],
	juarez_days: [],
	juarez_vias: [],
	escobedo_closed: [],
	escobedo_open: [],
	escobedo_days: [],
	escobedo_vias: []
};
var counter_cat = 0;
var counter_mun = 0;
var counter_vias = 0;
var categories = ['ALCANTARILLAS', 'ALUMBRADO PUBLICO', 'FUGA', 'PARQUES DESCUIDADOS', 'RECOLECCION DE BASURA', 'SEMAFORO DESCOMPUESTO', 'BACHE O VIA DAÑADA'];
var municipalities = ['Monterrey', 'San Pedro Garza García', 'Guadalupe', 'San Nicolás de los Garza', 'Santa Catarina', 'Apodaca', 'Cadereyta Jiménez', 'Juárez', 'General Escobedo'];
var vias =['Redes Sociales','Sitio Web','Tehuan APP','CIC CRM','Email','SMS'];
var or_sp = " and (post_cat ilike '%25ALCAN%25' or post_cat ilike '%25ALUMBR%25' or post_cat ilike '%25FUGA%25' or post_cat ilike '%25PARQUES%25' or post_cat ilike '%25BASURA%25' or post_cat ilike '%25SEMAFORO%25' or post_cat ilike '%25BACHE%25') and (status = 'closed' or status = 'read') ";
var chart0, chart1, chart11, chart12, chart13;

function loadData(status) {
	status = typeof status !== 'undefined' ? status : 'days';
	var index, sql, via;
	var county = municipalities[counter_mun];
	var category = categories[counter_cat];
		if (status =='vias'){
	//console.log(vias[counter_vias]);
		switch (vias[counter_vias]){
			case 'Redes Sociales': 
				via = 'length(origin) = 18';
				break;
			case 'Sitio Web': 
			 	via = "origin ilike '%25http://tehuan.cic.mx/new-report%25'";
				break;
			case 'Tehuan APP':  
				via = "origin ilike '%25http://api.nl.cic.mx/ushahidi/nl/api%25'";
				break;
			case 'CIC CRM': 
				via = "origin ilike 'web://nl%25'";
				break;
			case 'Email': 
				via = "origin ilike 'mail:[%25'";
				break;
			case 'SMS': 
				via = 'length(origin) = 10';
				break;
			default: break;
		}
		via += or_sp;	
	}
	
	switch (county) {
		case 'Monterrey':
			index = county.toLowerCase() + "_" + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25MTY-%25' or formatted_address ilike '%25Monterrey%25') ) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25MTY-%25' or formatted_address ilike '%25Monterrey%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25MTY-%25' or formatted_address ilike '%25Monterrey%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25MTY-%25' or formatted_address ilike '%25Monterrey%25')";
			break;
		case 'San Pedro Garza García':
			index = 'sanpedro_' + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25SP-%25' or formatted_address ilike '%25San Pedro%25') ) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25SP-%25' or formatted_address ilike '%25San Pedro%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25SP-%25' or formatted_address ilike '%25San Pedro%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25SP-%25' or formatted_address ilike '%25San Pedro%25')"
			break;
		case 'Guadalupe':
			index = county.toLowerCase() + "_" + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25GPE-%25' or formatted_address ilike '%25Guadalupe%25') ) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25GPE-%25' or formatted_address ilike '%25Guadalupe%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25GPE-%25' or formatted_address ilike '%25Guadalupe%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or post_title ilike'%25GPE-%25' or formatted_address ilike '%25Guadalupe%25')"
			break;
		case 'San Nicolás de los Garza':
			index = 'sannico_' + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Nico%25' or post_title ilike'%25SN-%25' or formatted_address ilike '%25San Nico%25') ) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Nico%25' or post_title ilike'%25SN-%25' or formatted_address ilike '%25San Nico%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Nico%25' or post_title ilike'%25SN-%25' or formatted_address ilike '%25San Nico%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Nico%25' or post_title ilike'%25SN-%25' or formatted_address ilike '%25San Nico%25')"
			break;
		case 'Santa Catarina':
			index = 'santacat_' + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Catarina%25' or formatted_address ilike '%25Catarina%25')) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Catarina%25' or formatted_address ilike '%25Catarina%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Catarina%25' or formatted_address ilike '%25Catarina%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Catarina%25' or formatted_address ilike '%25Catarina%25')"
			break;
		case 'Apodaca':
			index = county.toLowerCase() + "_" + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Apodaca%25' or post_title ilike'%25APO-%25' or formatted_address ilike '%25Apodaca%25')) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Apodaca%25' or post_title ilike'%25APO-%25' or formatted_address ilike '%25Apodaca%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Apodaca%25' or post_title ilike'%25APO-%25' or formatted_address ilike '%25Apodaca%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Apodaca%25' or post_title ilike'%25APO-%25' or formatted_address ilike '%25Apodaca%25')"
			break;
		case 'Cadereyta Jiménez':
			index = 'cadereyta_' + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Cadereyta%25' or post_title ilike'%25CAD-%25' or formatted_address ilike '%25Cadereyta%25')) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Cadereyta%25' or post_title ilike'%25CAD-%25' or formatted_address ilike '%25Cadereyta%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Cadereyta%25' or post_title ilike'%25CAD-%25' or formatted_address ilike '%25Cadereyta%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Cadereyta%25' or post_title ilike'%25CAD-%25' or formatted_address ilike '%25Cadereyta%25')"
			break;
		case 'Juárez':
			index = 'juarez_' + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Juárez%25' or post_title ilike'%25JUA-%25')) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Juárez%25' or post_title ilike'%25JUA-%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Juárez%25' or post_title ilike'%25JUA-%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Juárez%25' or post_title ilike'%25JUA-%25')"
			break;
		case 'General Escobedo':
			index = 'escobedo_' + status;
			if (status == 'days') sql = "SELECT avg(trimestre) FROM (select date_part('days',(last_mod-created_at)) as trimestre FROM cic_reports where post_cat ='" + category + "' and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Escobedo%25' or post_title ilike'%25ESC-%25' or formatted_address ilike '%25Escobedo%25')) as tri";
			else if (status == 'closed') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='closed' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Escobedo%25' or post_title ilike'%25ESC-%25' or formatted_address ilike '%25Escobedo%25')";
			else if (status == 'open') sql = "SELECT count(post_id) FROM cic_reports where post_cat ='" + category + "'and status='read' and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Escobedo%25' or post_title ilike'%25ESC-%25' or formatted_address ilike '%25Escobedo%25')";
			else if (status == 'vias') sql = "SELECT count(origin) FROM cic_reports where " + via + " and (now()-created_at) < INTERVAL '90 day' and (county ilike '%25" + county + "%25' or county ilike '%25Escobedo%25' or post_title ilike'%25ESC-%25' or formatted_address ilike '%25Escobedo%25')"
			break;
		default:
			break;
	}
	$.ajax({
		url: 'http://cicadmin.cartodb.com/api/v2/sql/?q=' + sql,
		dataType: 'json',
		success: function(data) {
			if (status == 'days') {
				if (data.rows[0].avg != null) {
					reports[index][counter_cat++] = parseInt(data.rows[0].avg.toFixed(0));
				} else {
					reports[index][counter_cat++] = 0;
				}
			} else if (status == 'open' || status == 'closed'){
				if (data.rows[0].count != null) {
					reports[index][counter_cat++] = parseInt(data.rows[0].count.toFixed(0));
				} else {
					reports[index][counter_cat++] = 0;
				}
			}
			else {
				if (data.rows[0].count != null) {
					reports[index][counter_vias++] = parseInt(data.rows[0].count.toFixed(0));
				} else {
					reports[index][counter_vias++] = 0;
				}

			}
		}
	}).done(function(data) {
		if (counter_cat == 1 && counter_mun == 0 && status == 'days') {
			chart0 = new Highcharts.Chart({
				chart: {
					renderTo: 'chart_0',
					type: 'column',
					height: 350,
				},
				title: {
					text: 'Comparacion de Efectividad Municipal (Últimos 90 días)'
				},
				xAxis: {
					categories: ['Alcantarillas', 'Alumbrado Publico', 'Fuga', 'Parques Descuidados', 'Recoleccion de Basura', 'Semaforos Descompuestos', 'Baches o Vias Danadas']
				},
				yAxis: {
					title: {
						text: 'Promedio para cerrar reporte (días)'
					},
					minorGridLineWidth: 0,
					lineColor: 'transparent'
				},
				loading:   {
					style: {
						fontSize: '50px',
						opacity: .75
					},
					labelStyle: {
						top: '1.5em'
					}
				},
				plotOptions: {
					series: {
						animation: {
							duration: 2000
						}
					},
				}
			});
			chart0.showLoading('Recopilando la información, por favor espere...');
		}
		if ((counter_cat == 7 && counter_mun < 8 && status != 'vias') || (counter_vias == 6 && counter_mun < 8 && status == 'vias')) {
			counter_mun++;
			counter_cat = 0;
			counter_vias = 0;
			loadData(status);
			if (status == 'days') chart0.addSeries({
				name: county,
				data: reports[index]
			});
			else if (status == 'vias') {
				console.log(county + ' is ready');
				$('#accordion #' + county.replace(/\s/g, '')).text('Detalle del Municipio: ' + county).css("opacity", "1");;
				if (counter_mun == 8) $('#accordion #GeneralEscobedo').text('Detalle del Municipio: General Escobedo').css("opacity", "1");;
			} else if (status == 'open'){
				$('#accordion #' + county.replace(/\s/g, '')).text('Detalle del Municipio: ' + county + ' [cargando, por favor espere...]');
				if (counter_mun == 8) $('#accordion #GeneralEscobedo').text('Detalle del Municipio: General Escobedo  ' + ' [cargando, por favor espere...]');
			} else if (status == 'closed'){
				$('#accordion #' + county.replace(/\s/g, '')).text('Detalle del Municipio: ' + county + ' [ajustando gráficos...]');
				if (counter_mun == 8) $('#accordion #GeneralEscobedo').text('Detalle del Municipio: General Escobedo  ' + ' [ajustando gráficos...]');
			}
		} else if (counter_cat != 7 && counter_mun != 9 && counter_vias != 6) {
			
			loadData(status);
		} else if ((counter_cat == 7 && counter_mun == 8) || (counter_vias == 6 && counter_mun == 8)) {
			counter_cat = 0;
			counter_mun = 0;
			counter_vias = 0;
			if (status == 'days') {
				plotComparison();
				loadData('open');
				$('.actions').css("opacity", "1");
			} else if (status == 'open') {
				loadData('closed');
			} else if (status == 'closed') {
				loadData('vias');
			}else {
				console.log('huzzaah!');
				$("#accordion").accordion({
					disabled: false
				});
				$('.ui-accordion .ui-accordion-header').css("opacity", "1");
			}
		}
	});
}

function plotComparison() {
	chart0 = new Highcharts.Chart({
		chart: {
			renderTo: 'chart_0',
			type: 'column',
			height: 350,
		},
		title: {
			text: 'Comparacion de Efectividad Municipal (Últimos 90 días)'
		},
		xAxis: {
			categories: ['Alcantarillas', 'Alumbrado Publico', 'Fuga', 'Parques Descuidados', 'Recoleccion de Basura', 'Semaforos Descompuestos', 'Baches o Vias Danadas']
		},
		yAxis: {
			title: {
				text: 'Tiempo promedio para cerrar reporte (días)'
			},
			minorGridLineWidth: 0,
			lineColor: 'transparent'
		},
		plotOptions: {
			series: {
				animation: {
					duration: 2000
				}
			}
		},
		series: [{
			name: 'Monterrey',
			data: reports['monterrey_days']
		}, {
			name: 'San Pedro',
			data: reports['sanpedro_days']
		}, {
			name: 'San Nicolás',
			data: reports['sannico_days']
		}, {
			name: 'Guadalupe',
			data: reports['guadalupe_days']
		}, {
			name: 'Escobedo',
			data: reports['escobedo_days']
		}, {
			name: 'Apodaca',
			data: reports['apodaca_days']
		}, {
			name: 'Santa Catarina',
			data: reports['santacat_days']
		}, {
			name: 'Juárez',
			data: reports['juarez_days']
		}, {
			name: 'Cadereyta',
			data: reports['cadereyta_days']
		}]
	});
}

function plotCounty(county, index_closed, index_open, index_vias, chartID) {
	var total = reports[index_closed][0] + reports[index_open][0] + reports[index_closed][1] + reports[index_open][1] + reports[index_closed][2] + reports[index_open][2] + reports[index_closed][3] + reports[index_open][3] + reports[index_closed][4] + reports[index_open][4] + reports[index_closed][5] + reports[index_open][5] + reports[index_closed][6] + reports[index_open][6];
	chart1 = new Highcharts.Chart({
		chart: {
			renderTo: chartID,
			height: 350
		},
		title: {
			text: county + ' (Últimos 90 días)'
		},
		subtitle: {
			text: 'Flujo de Reportes por Categoría (Total de Reportes: ' + total + ')'
		},
		tooltip: {
			formatter: function() {
				return '<b style="color: {series.color}">' + this.point.name + '</b>: ' + this.y + ' (' + Math.round(this.percentage) + ' %)';
			}
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false,
					color: '#000000',
					connectorColor: '#000000',
					formatter: function() {
						return '<b>' + this.point.percentage;
					}
				},
				showInLegend: true
			}
		},
		series: [{
			type: 'pie',
			name: 'Reportes',
			data: [
				['Alcantarillas', reports[index_closed][0] + reports[index_open][0]],
				['Alumbrado', reports[index_closed][1] + reports[index_open][1]],
				['Fuga', reports[index_closed][2] + reports[index_open][2]],
				['Parques', reports[index_closed][3] + reports[index_open][3]],
				['Basura', reports[index_closed][4] + reports[index_open][4]],
				['Semáforos', reports[index_closed][5] + reports[index_open][5]],
				['Baches', reports[index_closed][6] + reports[index_open][6]], ]
		}]
	});
	chart11 = new Highcharts.Chart({
		chart: {
			type: 'waterfall',
			renderTo: chartID + '1',
			height: 350
		},
		title: {
			text: county + ' (Últimos 90 días)'
		},
		subtitle: {
			text: 'Balance de Reportes Abiertos/Cerrados (Total de Reportes: ' + total + ')'
		},
		xAxis: {
			title: {
				text: 'Reportes Abiertos y Cerrados por Categoría'
			}
		},
		yAxis: {
			title: {
				text: 'Cantidad de Reportes'
			},
			minorGridLineWidth: 0,
			lineColor: 'transparent'
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '<b>{point.y}</b> Reportes'
		},
		series: [{
			upColor: Highcharts.getOptions().colors[1],
			color: Highcharts.getOptions().colors[3],
			data: [{
				name: 'Alcantarillas',
				y: reports[index_open][0]
			}, {
				name: 'Alumbrado',
				y: reports[index_open][1]
			}, {
				name: 'Fuga',
				y: reports[index_open][2]
			}, {
				name: 'Parques',
				y: reports[index_open][3]
			}, {
				name: 'Basura',
				y: reports[index_open][4]
			}, {
				name: 'Semáforos',
				y: reports[index_open][5]
			}, {
				name: 'Baches',
				y: reports[index_open][6]
			}, {
				name: 'Total Reportado',
				isIntermediateSum: true,
				color: Highcharts.getOptions().colors[0]
			}, {
				name: 'Cerrados Alcantarillas',
				y: -reports[index_closed][0]
			}, {
				name: 'Cerrados Alumbrado',
				y: -reports[index_closed][1]
			}, {
				name: 'Cerrados Fuga',
				y: -reports[index_closed][2]
			}, {
				name: 'Cerrados Parques',
				y: -reports[index_closed][3]
			}, {
				name: 'Cerrados Basura',
				y: -reports[index_closed][4]
			}, {
				name: 'Cerrados Semáforos',
				y: -reports[index_closed][5]
			}, {
				name: 'Cerrados Baches',
				y: -reports[index_closed][6]
			}, {
				name: 'Total Pendientes',
				isSum: true,
				color: Highcharts.getOptions().colors[2]
			}],
			dataLabels: {
				enabled: true,
				formatter: function() {
					return Highcharts.numberFormat(this.y, 0, ',');
				},
				style: {
					color: '#FFFFFF',
					fontWeight: 'bold'
				}
			},
			pointPadding: 0
		}]
	});
	chart12 = new Highcharts.Chart({
		chart: {
			polar: true,
			type: 'column',
			renderTo: chartID + '2',
			height: 450
		},
		title: {
			text: county + ' (Últimos 90 días)'
		},
		subtitle: {
			text: 'Balance de Reportes Abiertos/Cerrados (Total de Reportes: ' + total + ')'
		},
		pane: {
			size: '75%'
		},
		legend: {
			reversed: true
		},
		xAxis: {
			categories: ['Alcantarillas', 'Alumbrado Público', 'Fuga', 'Parques Descuidados', 'Recolección de Basura', 'Semáforos Descompuestos', 'Baches o Vías Dañadas']
		},
		yAxis: {
			min: 0,
			endOnTick: false,
			showLastLabel: true,
			title: {
				text: ''
			},
			labels: {
				formatter: function() {
					return this.value;
				}
			}
		},
		tooltip: {
			followPointer: true
		},
		plotOptions: {
			series: {
				stacking: 'normal',
				shadow: true,
				groupPadding: 0,
				pointPlacement: 'on'
			}
		},
		series: [{
			name: 'Total Pendientes',
			data: [reports[index_open][0], reports[index_open][1], reports[index_open][2], reports[index_open][3], reports[index_open][4], reports[index_open][5], reports[index_open][6]],
			color: Highcharts.getOptions().colors[2]
		}, {
			name: 'Cerrados a destiempo',
			data: [reports[index_closed][0], reports[index_closed][1], reports[index_closed][2], reports[index_closed][3], reports[index_closed][4], reports[index_closed][5], reports[index_closed][6]],
			color: Highcharts.getOptions().colors[3]
		}, {
			name: 'Cerrados en tiempo',
			data: [0, 0, 0, 0, 0, 0, 0],
			color: Highcharts.getOptions().colors[1]
		}, {
			name: 'Total de Reportes',
			data: [reports[index_closed][0] + reports[index_open][0], reports[index_closed][1] + reports[index_open][1], reports[index_closed][2] + reports[index_open][2], reports[index_closed][3] + reports[index_open][3], reports[index_closed][4] + reports[index_open][4], reports[index_closed][5] + reports[index_open][5], reports[index_closed][6] + reports[index_open][6]],
			color: Highcharts.getOptions().colors[0]
		}]
	});
	chart13 = new Highcharts.Chart({
		chart: {
			type: 'funnel',
			renderTo: chartID + '3',
			height: 350
		},
		title: {
			text: county + ' (Últimos 90 días)'
		},
		subtitle: {
			text: 'Vía del Reporte (Total de Reportes: ' + total + ')'
		},
		plotOptions: {
			series: {
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b> ({point.y:,.0f})',
					color: 'black',
					softConnector: true
				},
				width: '60%',
				height: '98%'
			}
		},
		legend: {
			enabled: false
		},
		series: [{
			name: 'Reportes',
			data: [
				['Redes Sociales', reports[index_vias][0]],
				['Sitio Web', reports[index_vias][1]],
				['Tehuan APP', reports[index_vias][2]],
				['CIC CRM', reports[index_vias][3]],
				['Email', reports[index_vias][4]],
				['SMS', reports[index_vias][5]]
			]
		}]
	});
}

function ChangeChartType(chart, series, newType) {
	newType = newType.toLowerCase();
	for (var i = 0; i < series.length; i++) {
		if (newType == 'column') series[i].update({
			type: newType
		});
		else series[i].update({
			type: newType,
			animation: true
		});
	}
}