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

// Load JavaScript for reactive components
function bootcamp_schedule_assets() {
    wp_enqueue_script(								// WP function to load scripts
        'planner',									// Script unique handle (tag)
        plugin_dir_url(__FILE__) . 'js/planner2.js', // Path to the script in plugin
        array('jquery'),							// Load jquery as dependecy
        null,										// No version specified
        true										// Load in footer (apparently improves performance)
    );
}
add_action('wp_enqueue_scripts', 'bootcamp_schedule_assets'); // tells WP to load the function with the scripts on a page

// Shortcode Function
function bootcamp_schedule_shortcode() {
    ob_start();
    ?>

    <div id="bootcamp-scheduler">
        <h2>Customize Your Bootcamp Week</h2>
        
        <!-- Activity Selection -->
        <div id="activity-selection">
            <h3>Select Your Activities:</h3>
            <form id="activity-form">
                <div class="activity-category">
                    <h4>Wellness</h4>
                    <label><input type="checkbox" class="activity-checkbox" value="Yoga"> Yoga ($15)</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="Morning Stretch"> Morning Stretch (Daily, $40)</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="Dance Class"> Dance Class ($30)</label><br>
                </div>

                <div class="activity-category">
                    <h4>Education</h4>
                    <label><input type="checkbox" class="activity-checkbox" value="Coding Bootcamp"> Coding Bootcamp ($50)</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="Machine Learning Workshop"> Machine Learning Workshop ($60)</label><br>
                </div>

                <div class="activity-category">
                    <h4>Sports</h4>
                    <label><input type="checkbox" class="activity-checkbox" value="Swimming"> Swimming ($20)</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="Boxing"> Boxing ($25)</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="Running"> Running ($10)</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="Weightlifting"> Weightlifting ($22)</label><br>
                </div>

                <div class="activity-category">
                    <h4>Arts</h4>
                    <label><input type="checkbox" class="activity-checkbox" value="Painting Class"> Painting Class ($18)</label><br>
                    <label><input type="checkbox" class="activity-checkbox" value="Photography Class"> Photography Class ($20)</label><br>
                </div>

                <!-- Meal Plan -->
                <h3>Add Meal Plan:</h3>
                <label><input type="checkbox" id="meal-checkbox"> Include Meals for the Week ($50)</label><br>
            </form>
        </div>

        <!-- Warning Message -->
        <p id="warning-message" style="color: red;"></p>

        <!-- Schedule Table -->
        <h3>Your Weekly Schedule:</h3>
        <table id="schedule-table" border="1">
            <thead>
                <tr>
                    <th>Day</th>
                    <?php for ($i = 10; $i < 20; $i++) { ?>
                        <th><?php echo $i . ":00"; ?></th>
                    <?php } ?>
                </tr>
            </thead>
            <tbody id="schedule-body">
                <?php
                $days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                foreach ($days as $day) {
                    echo "<tr><td>$day</td>";
                    for ($i = 10; $i < 20; $i++) {
                        echo "<td></td>";
                    }
                    echo "</tr>";
                }
                ?>
            </tbody>
        </table>

        <!-- Price Details -->
        <h3>Price Breakdown:</h3>
        <ul id="price-details"></ul>
        <h4 id="total-price">Total Price: $0</h4>
    </div>

    <?php
    return ob_get_clean();
}



add_shortcode('bootcamp_schedule', 'bootcamp_schedule_shortcode');
