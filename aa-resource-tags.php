<?php
/**
 * Plugin Name: AA Resource Tags Plugin
 * Description: Reads from CSV file and provides search functionality on the frontend
 * Version: 1.0
 * Author: Aimen Awan
 * Author URI: http://www.aimenawan.com
 * 
 * data.csv format
 * 
 * The CSV file should have the first two rows as headers. The first row should be field names.
 * The second row is used for metadata of each field. Each cell has three values "-" separated values
 * order-type-searchability
 * 
 * order: This indicates the order of this field in both the generated search form, and the results table
 * 
 * type: Should be one of {Text, MC, Dropdown}. Text fields are displayed as text fields, and searched as
 * "substring contains". MC is multiple choice. They are displayed as "|" separated values and searched
 * as multitags input. Dropdown fields are searched as dropdowns.
 * 
 * searchability: Should be one of {Searchable, Passive, Hidden}. Searchable fields are displayed in results
 * and a field is also created for them on the search form. Passive fields are displayed but no field is
 * created on the search form. Hidden fields are neither displayed nor searched. The are completely ignored.
 * 
 * An example CSV file is included.
 * 
 */

add_shortcode('aa-resource-tags-search', 'aa_render_search_form');

function aa_render_search_form() {
	wp_enqueue_style('tagify-css', plugins_url( 'css/tagify.css', __FILE__ ) );
    wp_enqueue_script('jquery', plugins_url('js/jquery.min.js', __FILE__));
    wp_enqueue_script('jq-csv', plugins_url('js/jquery.csv.min.js', __FILE__));
    wp_enqueue_script('tagify', plugins_url('js/tagify.min.js', __FILE__));

    wp_enqueue_script('resource-tags', plugins_url('js/resource-tags.js', __FILE__), array('jquery', 'jq-csv', 'tagify'));
    wp_localize_script('resource-tags', 'csv_file', file_get_contents(plugin_dir_path(__FILE__) . '/data.csv' ));
    $output = '<table id="aa-resource-form"></table>';
    $output .= '<div id="aa-resource-results"></div>';
    return $output;

}
