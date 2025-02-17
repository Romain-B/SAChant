<?php
/**
 * Plugin Name: SAChant
 * Description: Allows users to plan and calculate activities dynamically.
 * Version:     0.1
 * Author:      Romain B, Lucas, Bathilde
 * License:     GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

// Enqueue FullCalendar.js and custom script
function edt_assets() {
	// what this does (per asset):
	// 	WP function to load scripts
	// 	Script unique handle (tag)
	//  Path to the script in plugin
	//  Load jquery as dependency if necessary
    
    // FullCalendar JS (for the interactive calendar)
    wp_enqueue_script(
        'fullcalendar-js',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js',
        array(),
        null,
        true
    );
	
	// jsPDF (for generating the pdf)
    wp_enqueue_script(
        'jspdf-js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        array(),
        null,
        true
    );
	
    // Custom JS for handling the schedule
    wp_enqueue_script(
        'edt-js',
        plugin_dir_url(__FILE__) . 'js/planner.js',
        array('jquery', 'fullcalendar-js', 'jspdf-js'), // call the dependencies
        filemtime(plugin_dir_url(__FILE__) . 'js/planner.js'),
        true
    );

    // Custom CSS for styling
    wp_enqueue_style(
        'edt-css',
        plugin_dir_url(__FILE__) . 'css/edt-style.css',
        array(),
        filemtime(plugin_dir_url(__FILE__) . 'css/edt-style.css')
    );
}

add_action('wp_enqueue_scripts', 'edt_assets'); // tells WP to load the function with the scripts on a page

function edt_shortcode() {
    ob_start();
    ?>
    
    <div id="edt">
        <h2>Organise ta semaine Allez'Chante !</h2>

        <!-- Activity Selection -->
        <div id="activity-selection">
            <h3>Sélection des activités:</h3>
			
            <form id="activity-form">
                <div class="activity-category">
                    <h4>Stages à la semaine</h4>
                    <label><input type="checkbox" class="activity-checkbox" value="diapason">Diapa'Son (50€ (prix test))</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="generason">Généra'Son (45€)</label><br>
					<label><input type="checkbox" class="activity-checkbox" value="enchantillages">Enchantillages (40€)</label><br>
                </div>

                <div class="activity-category">
                    <h4>Cours de technique vocale</h4>
                    <label><input type="checkbox" class="activity-checkbox" value="prog_solo">Cours de technique vocale solo</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="prog_coll">Cours de technique vocale en groupe</label><br>
                </div>

                <!-- Meal Plan -->
                <h3>Repas pour la semaine:</h3>
                <label><input type="checkbox" id="meal-checkbox"> Include Meals for the Week ($50)</label><br>
            </form>
        </div>

        <!-- Warning Message -->
        <p id="warning-message" style="color: red;"></p>

        <!-- FullCalendar Schedule Display -->
        <h3>Ton emploi du temps:</h3>
        <div id="edt-display"></div>

        <!-- Price Details -->
		<div id="price-section">
			<h4>Détail:</h3>
			<ul id="price-details"></ul>
			<h4 id="total-price">Total: €0</h4>
		</div>
    </div>

    <?php
    return ob_get_clean();
}
add_shortcode('edt', 'edt_shortcode');
