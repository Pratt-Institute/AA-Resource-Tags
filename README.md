This is a simple Wordpress plugin that reads a self-contained CSV, generates a search form to filter that data and displays results on the same page. The server side simply sends over the CSV data and then the client processes it to dynamically generate a search form and process search queries. Created by Aimen Awan, graduate student at Pratt Institute's School of Information.

The plugin can be activated using the shortcode `[aa-resource-tags-search]`

### TODO:
Currently, the plugin requires the CSV file to be manually placed in its directory in the Wordpress plugins directory and named data.csv. It should be modified to allow uploading of CSV files from the admin panel.

## data.csv Format
 
The CSV file should have the first two rows as headers. The first row should be field names.
The second row is used for metadata of each field. Each cell has three values "__-__" separated values
order-type-searchability

1. order: This indicates the order of this field in both the generated search form, and the results table.

2. type: Should be one of {*Text*, *MC*, *Dropdown*}. Text fields are displayed as text fields, and searched as "substring contains". MC is multiple choice. They are displayed as "__|__" separated values and searched as multitags input. Dropdown fields are searched as dropdowns.

3. searchability: Should be one of {*Searchable*, *Passive*, *Hidden*}. Searchable fields are displayed in results and a field is also created for them on the search form. Passive fields are displayed but no field is created on the search form. Hidden fields are neither displayed nor searched. The are completely ignored.

An example CSV file is included.
