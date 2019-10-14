		function myCharacterEffect(cell, combatant, index) {
			var myname = "YOU";
			if (myname == combatant["name"]) {
				$(cell).parents("tr").addClass("mc");
			}
		}

		function jobColorEffect(cell, combatant, index) {
			$(cell).parents("tr").addClass(combatant["Job"]);
		}

		function insertCommaEffect(cell) {
			cell.innerText = cell.innerText.replace( /(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
		}		
/*
 * This function is used to highlight the DPS from the other data
 */
		function redTextEffect(cell) {
			var num = parseInt(cell.innerText)
			if (num >= 1000) {
				$(cell).addClass("textred");
			}
			else
			{
			if(num >= 700)
				{
					$(cell).addClass("textreder");
				}
				else
					if(num > 500){
						$(cell).addClass("textpurp");
					}
					else
					if(num < 499 ){
						$(cell).addClass("textpur");
					} 
			}
		}
			
		function deathTextEffect(cell) {
			var num = parseInt(cell.innerText)
			if (num >= 1) {
				$(cell).addClass("textdeath");
			}
		}

		function graphEffect(cell) {
			$(cell).addClass("graphCell");
		}

		function dpsBarEffect(cell, combatant, index) {
    		var tank = ["Gla", "Pld", "Mrd", "War", "Drk"]
			var melee = ["Pgl", "Mnk", "Lnc", "Drg", "Rog", "Nin", "Sam"]
			var caster = ["Acn", "Smn", "Thm", "Blm", "Rdm"]
			var range = ["Arc", "Brd","Mch"]
    		var healer = ["Cnj", "Whm", "Sch", "Ast"]

    		if (index == 0 || typeof dpsBarEffect.topdeeps == 'undefined') {
        		dpsBarEffect.topdeeps = combatant["encdps"];
    		}
    		var deeps = combatant["encdps"];

    		var job = combatant["Job"];
    		if (melee.indexOf(job) > -1){
    		    var color = "rgba(174,5,5,0.7)";
    		} else if (tank.indexOf(job) > -1){
    		    var color = "rgba(19,77,159,0.7)";
    		} else if (caster.indexOf(job) > -1){
    		    var color = "rgba(93,7,149,0.7)";
    		} else if (range.indexOf(job) > -1){
    		    var color = "rgba(103,33,6,0.7)";
    		} else if (healer.indexOf(job) > -1){
    		    var color = "rgba(7, 98, 14,0.7)";
    		} else {
    		    var color = "rgba(128,0,255,0.7)";
    		}
    
    		var tableRow = cell.parentNode;
    		tableRow.style.background = "-webkit-gradient(linear, left top,right top, color-stop(0.95,"+ color + "), to(rgba(24,24,24,0.0)))";
    		tableRow.style.backgroundSize = (parseInt(deeps) * 100 / parseInt(dpsBarEffect.topdeeps)) + "% 100%";
    		tableRow.style.backgroundAttachment = "fixed";
   		tableRow.style.backgroundRepeat = "no-repeat";
		}

		function graphRendering(table) {
			$("tr:eq(0) > td.graphCell", table).each(function(){
				var max = 0;
				$("tr > td:nth-child("+($("tr:eq(0) td", table).index($(this))+1)+")", table).each(function(){
					max = (max < parseInt($(this).text().replace(/[^\d]/g,""))) ? parseInt($(this).text().replace(/[^\d]/g,"")) : max;
				});
				$("tr > td:nth-child("+($("tr:eq(0) td", table).index($(this))+1)+")", table).each(function(){
					p = (max == 0) ? "0%" : (parseInt($(this).text().replace(/[^\d]/g,"")) / max *100) + "%";
					$(this).css("background-size", p+" 100%, 100% 100%");
				});
			});
		}

		// onOverlayDataUpdate 
		document.addEventListener("onOverlayDataUpdate", function (e) {
			update(e.detail);
		});
		
		function update(data) {
			updateEncounter(data);
			if (document.getElementById("combatantTableHeader") == null) {
				updateCombatantListHeader();
			}
			updateCombatantList(data);
		}

		function updateEncounter(data) {
			
			var encounterElem = document.getElementById('encounter');
			
			var elementText;
			if (typeof encounterDefine === 'function') {
				elementText = encounterDefine(data.Encounter);
				if (typeof elementText !== 'string') {
                    		console.log("updateEncounter: 'encounterDefine' is declared as function but not returns a value as string.");
                   	 	return;
                		}
			} else if (typeof encounterDefine === 'string') {
				elementText = parseActFormat(encounterDefine, data.Encounter);
			} else {
				console.log("updateEncounter: Could not update the encounter element due to invalid type.");
				return;
			}
			
			if (!useHTMLEncounterDefine) {
				encounterElem.innerText = parseActFormat(encounterDefine, data.Encounter);
			} else {
				encounterElem.innerHTML = parseActFormat(encounterDefine, data.Encounter);
			}
		}
		
		function updateCombatantListHeader() {
			
		}
		
		function updateCombatantList(data) {
			var table = document.getElementById('combatantTable');
			var oldTableBody = table.tBodies.namedItem('combatantTableBody');
			var newTableBody = document.createElement("tbody");
			newTableBody.id = "combatantTableBody";

			var combatantIndex = 0;
			for (var combatantName in data.Combatant) {
				var combatant = data.Combatant[combatantName];
				 combatant.JobOrName = combatant.Job || combatantName;
                		var egiSearch = combatant.JobOrName.indexOf("-Egi (");
                		if (egiSearch != -1) {
                    		combatant.JobOrName = combatant.JobOrName.substring(0, egiSearch);
                		}
                		else if (combatant.JobOrName.indexOf("Eos (") == 0) {
                    		combatant.JobOrName = "Eos";
                		}
                		else if (combatant.JobOrName.indexOf("Selene (") == 0) {
                    		combatant.JobOrName = "Selene";
                		}
                		else if (combatant.JobOrName.indexOf("Carbuncle (") != -1) {
                    		// currently no carbuncle pics
                		}
                		else if (combatant.JobOrName.indexOf(" (") != -1) {
                    		combatant.JobOrName = "choco";
                		}
                			
                			var tableRow = newTableBody.insertRow(newTableBody.rows.length);
                			for (var i = 0; i < bodyDefine.length; i++)
				{
					var cell = tableRow.insertCell(i);

					if (typeof bodyDefine[i].text !== 'undefined') {
						var cellText;
						if (typeof bodyDefine[i].text === 'function') {
							cellText = bodyDefine[i].text(combatant, combatantIndex);
						} else {
							cellText = parseActFormat(bodyDefine[i].text, combatant);
						}
						cell.innerText = cellText;
					} else if (typeof bodyDefine[i].html !== 'undefined') {
						var cellHTML;
						if (typeof bodyDefine[i].html === 'function') {
							cellHTML = bodyDefine[i].html(combatant, combatantIndex);
						} else {
							cellHTML = parseActFormat(bodyDefine[i].html, combatant);
						}
						cell.innerHTML = cellHTML;
					}

					cell.style.width = bodyDefine[i].width;
					cell.style.maxWidth = bodyDefine[i].width;

					if (typeof(bodyDefine[i].align) !== 'undefined') {
						cell.style.textAlign = bodyDefine[i].align;
					}

					if (typeof bodyDefine[i].effect === 'function') {
						bodyDefine[i].effect(cell, combatant, combatantIndex);
					}
				}
				combatantIndex++;
			}

			graphRendering(newTableBody);


			if (oldTableBody != void(0)) {
				table.replaceChild(newTableBody, oldTableBody);
			}
			else {
				table.appendChild(newTableBody);
			}
		}

		// Miniparse
		function parseActFormat(str, dictionary)
		{
			var result = "";

			var currentIndex = 0;
			do {
				var openBraceIndex = str.indexOf('{', currentIndex);
				if (openBraceIndex < 0) {
					result += str.slice(currentIndex);
					break;
				}
				else {
					result += str.slice(currentIndex, openBraceIndex);
					var closeBraceIndex = str.indexOf('}', openBraceIndex);
					if (closeBraceIndex < 0) {
						// parse error!
						console.log("parseActFormat: Parse error: missing close-brace for " + openBraceIndex.toString() + ".");
						return "ERROR";
					}
					else {
						var tag = str.slice(openBraceIndex + 1, closeBraceIndex);
						if (typeof dictionary[tag] !== 'undefined') {
							result += dictionary[tag];
						} else {
							console.log("parseActFormat: Unknown tag: " + tag);
							result += "ERROR";
						}
						currentIndex = closeBraceIndex + 1;
					}
				}
			} while (currentIndex < str.length);

			return result;
		}
