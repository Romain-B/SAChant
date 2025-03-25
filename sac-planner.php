<?php
/**
 * Plugin Name: SAChant
 * Description: Plugin pour plannifier sa semaine Allez'Chant.
 * Plugin URI: https://github.com/Romain-B/SAChant
 * Version:     0.5
 * Author:      Romain B, Lucas, Bathilde
 * License:     GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

// Enqueue dependencies and custom script
function edt_assets() {
	// what this does (per asset):
	// 	WP function to load scripts
	// 	Script unique handle (tag)
	//  Path to the script in plugin directory
	//  Load file dependencies if necessary (e.g. jquery or calendar)
    
    // FullCalendar JS (for the interactive calendar)
    wp_enqueue_script(
        'fullcalendar-js',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js',
        array(), null, true
    );
	
	// jsPDF (for generating the pdf)
    wp_enqueue_script(
        'jspdf-js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        array(), null, true
    );
	// html2canvas (for generating the pdf)
    wp_enqueue_script(
        'html2canvas-js',
        'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        array(), null, true
    );
	
    // Our custom JS script to handle the schedule
    wp_enqueue_script(
        'edt-js',
        plugin_dir_url(__FILE__) . 'js/planner.js',
        array('jquery', 'fullcalendar-js', 'jspdf-js', 'html2canvas-js'), // call the dependencies
        filemtime(plugin_dir_url(__FILE__) . 'js/planner.js'),
        true
    );
	// Our custom JS script to handle the form tabs
	wp_enqueue_script(
        'tab-js',
        plugin_dir_url(__FILE__) . 'js/tab_handling.js',
        array('jquery'), // call the dependencies
        filemtime(plugin_dir_url(__FILE__) . 'js/tab_handling.js'),
        true
    );

    // Custom CSS for styling
    wp_enqueue_style(
        'edt-css',
        plugin_dir_url(__FILE__) . 'css/edt-style.css',
        array(),
        filemtime(plugin_dir_url(__FILE__) . 'css/edt-style.css'),
    );
}
add_action('wp_enqueue_scripts', 'edt_assets', 99); // tells WP to load the function with the scripts on a page

function edt_shortcode() {
/* Function that defines the form & interactive area, 
   as a shortcode to integrate within a WP page using '[edt_shortcode]'
*/
    ob_start();
    ?>
    
    <div id="edt">
        <h2>Organise ta semaine Allez'Chante !</h2>
        <div id="activity-selection">
            <h4>Sélection des activités</h4>
			
		<!-- Tab Navigation -->
			<div class="tab-container">
				<button class="tab-button active" onclick="openTab('stages')">Stages à la semaine</button>
				<button class="tab-button" onclick="openTab('cours')">Ateliers ponctuels</button>
				<button class="tab-button" onclick="openTab('repas')">Repas / Logement</button>
			</div>

            <form id="activity-form">
			
		<!-- Tab Activités à la semaine -->
				<div id="stages" class="tab-content active">
					<div class="activity-category">
					
						<h5>Stages à la semaine</h5>
						
						<label><input type="checkbox" class="activity-checkbox" value="diapason">Diapa'Son (180€)</label>
						<label><input type="checkbox" class="activity-checkbox" value="generason">Généra'Son (60€)* </label>
						<label><input type="checkbox" class="activity-checkbox" value="enchantillages">Enchantillages (80€)**</label>
						<label><input type="checkbox" class="activity-checkbox" value="ahcompagnons">Ah'Compagnons - 2 séances coachées + travail en autonomie (90€)</label>
					</div>
					<div style="font-style: italic; font-size:8pt; line-height:8pt">
						*: ouvert aux enfants (30€) 
						<br>
						**: réservé aux enfants
					</div>
                </div>

		<!-- Tab Atelier ponctuels -->
				<div id="cours" class="tab-content">
					<div class="activity-category">
					
						<h5>Cours de technique vocale et ateliers</h5>
                    
						<div class="c-dropdown">
							Progres'Son Individuel - Créneau de 45min (50€)
							<div class="c-dropdown-content">
								<table class="c-table">
									<thead>
										<tr>
											<th style="width:25%;"></th>
											<th>Dim.</th>
											<th>Lun.</th>
											<th>Mar.</th>
											<th>Mer.</th>
											<th>Jeu.</th>
											<th>Ven.</th>
										</tr>
									</thead>
									<tbody>
										<tr><td>Matin (10:00-11:30)</td>
											<td></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_luam"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_maam"></label></td>
											<td></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_jeam"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_veam"></label></td>
										</tr>
										<tr><td>Après-midi (14:00-16:30)</td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_dipm"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_lupm"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_mapm"></label></td>
											<td></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_solo_jepm"></label></td>
											<td></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
            
						<br style="margin:12px">
						
						<div class="c-dropdown">
							Progres'Son Collectif (25€)
						
							<div class="c-dropdown-content">
								<table class="c-table">
									<thead>
										<tr>
											<th style="width:25%;"></th>
											<th>Dim.</th>
											<th>Lun.</th>
											<th>Mar.</th>
											<th>Mer.</th>
											<th>Jeu.</th>
											<th>Ven.</th>
										</tr>
									</thead>
									<tbody>
										<tr><td>Matin (11:40-12:30)</td>
											<td></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_luam"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_maam"></label></td>
											<td></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_jeam"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_veam"></label></td>
										</tr>
										<tr><td>Après-midi (16:30-17:15)</td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_dipm"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_lupm"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_mapm"></label></td>
											<td></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="prog_coll_jepm"></label></td>
											<td></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<br style="margin:12px">
						
						<div class="c-dropdown">
							Explora'Sons (30€)
						
							<div class="c-dropdown-content">
								<table class="c-table">
									<thead>
										<tr>
											<th style="width:20%;"></th>
											<th>Dim.</th>
											<th>Lun.</th>
											<th>Mar.</th>
											<th>Mer.</th>
											<th>Jeu.</th>
											<th>Ven.</th>
										</tr>
									</thead>
									<tbody>
										<tr><td>16:15-18:15</td>
											<td><label><input type="checkbox" class="activity-checkbox" value="explo_di"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="explo_lu"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="explo_ma"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="explo_me"></label></td>
											<td><label><input type="checkbox" class="activity-checkbox" value="explo_je"></label></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<br>
					</div>
				</div>
        
		<!-- Tab Repas/logements -->
				<div id="repas" class="tab-content">
 
					<h5>Repas pour la semaine:</h5>

					<label><input type="radio" class="other-radio" name="repas" value="none" checked>Aucun</label>
					<label><input type="radio" class="other-radio" name="repas" value="repas_midi">Forfait midi (49€)</label>
					<label><input type="radio" class="other-radio" name="repas" value="repas_total">Forfait complet (107€)</label>
					
					<h5>Logement pour la semaine:</h5>
					
					<label><input type="radio" class="other-radio" name="logement" value="none" checked>Aucun</label>
					<label><input type="radio" class="other-radio" name="logement" value="logement_camping">Camping (30€)</label>
					<label><input type="radio" class="other-radio" name="logement" value="logement_habitant">Chez l'habitant (30€)</label>
                </div>
                
            </form>

        <!-- Warning Messages -->
        <p id="warning-singtime" class="warn-msg"></p>
		<p id="warning-overlap" class="warn-msg"></p>

        <!-- FullCalendar Schedule Display -->
        <h4>Emploi du temps de la sélection</h4>
        <div id="edt-display"></div>

        <!-- Price Details -->
		<div id="price-section">
			<h5>Détail:</h5>
			<ul id="price-details"></ul>
			<h4 id="total-price">Prix total indicatif : €0</h4>
		</div>
		<br>
		<button id="save-pdf">Enregistrer le détail de la simulation (PDF)</button>

    </div>

    <?php
    return ob_get_clean();
}
add_shortcode('edt', 'edt_shortcode');
