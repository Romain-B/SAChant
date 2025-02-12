<?php
/**
 * Plugin Name: SAL Planner
 * Plugin URI:  n/a
 * Description: Allows users to plan and calculate activities dynamically.
 * Version:     0.1
 * Author:      RoB, Lucas, Bathilde
 * Author URI:  n/a
 * License:     GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

// Enqueue JavaScript
function bootcamp_schedule_assets() {
    wp_enqueue_script(
        'schedule-planner',
        plugin_dir_url(__FILE__) . 'js/planner.js',
        array('jquery'),
        null,
        true
    );
}
add_action('wp_enqueue_scripts', 'bootcamp_schedule_assets');

// Shortcode Function
function bootcamp_schedule_shortcode() {
    ob_start();
    ?>
    <div>
        <h2>Bootcamp Planner</h2>

        <!-- Activity Selection -->
        <label>Select Activities:</label>
        <select id="activity-select">
            <option value="">-- Choose an Activity --</option>
            <option value="Yoga">Yoga (Mon 10:00 - 11:00)</option>
            <option value="Coding Bootcamp">Coding Bootcamp (Mon 11:30 - 13:30)</option>
            <option value="Swimming">Swimming (Tue 14:00 - 15:00)</option>
            <option value="Boxing">Boxing (Wed 16:00 - 17:00)</option>
            <option value="Running">Running (Mon 09:00 - 10:30)</option>
            <option value="Painting Class">Painting Class (Tue 15:00 - 16:00)</option>
            <option value="Weightlifting">Weightlifting (Wed 15:30 - 16:30)</option>
            <option value="Machine Learning Workshop">Machine Learning Workshop (Mon 14:00 - 16:00)</option>
            <option value="Dance Class">Dance Class (Tue 16:00 - 17:30)</option>
            <option value="Photography Class">Photography Class (Wed 17:00 - 18:00)</option>
            <option value="Morning Stretch">Morning Stretch (Daily 08:00 - 09:00) [Recurring]</option>
        </select>

        <!-- Weekly Schedule Display -->
        <h2>Week Schedule</h2>
        <table border="1">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>08:00 - 10:00</th>
                    <th>10:00 - 12:00</th>
                    <th>12:00 - 14:00</th>
                    <th>14:00 - 16:00</th>
                    <th>16:00 - 18:00</th>
                </tr>
            </thead>
            <tbody id="schedule-body">
                <tr><td>Monday</td><td colspan="5"></td></tr>
                <tr><td>Tuesday</td><td colspan="5"></td></tr>
                <tr><td>Wednesday</td><td colspan="5"></td></tr>
                <tr><td>Thursday</td><td colspan="5"></td></tr>
                <tr><td>Friday</td><td colspan="5"></td></tr>
                <tr><td>Saturday</td><td colspan="5"></td></tr>
                <tr><td>Sunday</td><td colspan="5"></td></tr>
            </tbody>
        </table>

        <!-- Selected Activities -->
        <h2>Selected Activities</h2>
        <ul id="selected-activities"></ul>

        <!-- Price Details -->
        <h3>Price Breakdown</h3>
        <ul id="price-details"></ul>
        <h3 id="total-price">Total Price: $0</h3>

        <!-- Warnings -->
        <p id="warning-message" style="color: red; font-weight: bold;"></p>
    </div>
    <?php
    return ob_get_clean();
}



add_shortcode('bootcamp_schedule', 'bootcamp_schedule_shortcode');
