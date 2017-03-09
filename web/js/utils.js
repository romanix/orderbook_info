// _.templateSettings = {
//     interpolate: /\{\{(.+?)\}\}/g,      // print value: {{ value_name }}
//     evaluate: /\{%([\s\S]+?)%\}/g,   // excute code: {% code_to_execute %}
//     escape: /\{%-([\s\S]+?)%\}/g
// }; // excape HTML: {%- <script> %} prints &lt;script&gt;


//-- Template  Loader 

tpl = {

    // Hash of preloaded templates for the app
    templates: {},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates: function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            //console.log('Loading template: ' + name);
            $.get('tpl/' + name + '.html?v=1.3', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });

            //console.log("Templates Loaded ....");
        };
        
        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function (name) {
        return this.templates[name];
    }

};

//-- End of template Loader 

