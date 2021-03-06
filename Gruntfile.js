var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    cssmin: {
      tox_webfont: {
        files: {
          'fonts/tox-webfont.min.css': ['fonts/*.css']
        }
      }
    },

    'string-replace': {
      fix_demo_font_path: {
        files: [ { 'fonts/tox-webfont.html': 'fonts/tox-webfont.html' } ],
        options: {
          replacements: [{
            pattern: /(tox-webfont\.(eot|svg|ttf|woff))/g,
            replacement: 'fonts/$1'
          }]
        }
      },
      fix_css_font_path: {
        files: [ { 'fonts/tox-webfont.css': 'fonts/tox-webfont.css' } ],
        options: {
          replacements: [{
            pattern: /(tox-webfont\.(eot|svg|ttf|woff))/g,
            replacement: '../fonts/$1'
          }]
        }
      }
    },

    copy: {
      main: {
        files: [
          { expand: true, cwd: 'fonts/', src: ['*.css'], dest: 'css/', filter: 'isFile' },
          {
            expand: true, cwd: 'fonts/', src: ['tox-webfont.html'], dest: './', filter: 'isFile',
            rename: function(dest, src) {
              return 'demo.html';
            }
          }
        ]
      }
    },

    _clean: {
      after_copy: ['fonts/*.css', 'fonts/*.html'],
      build: ['css/', 'demo.html', 'fonts/']
    },

    webfont: {
      icons: {
        src: 'submodules/Tox-UI/**/*.svg',
        dest: 'fonts',
        options: {
          font: 'tox-webfont',
          hashes: false,
          rename: function(name){
            return path.basename(name).replace(/_/g, '-');
          },
          templateOptions: {
            baseClass: 'tox-font',
            classPrefix: 'tox-font-',
            mixinPrefix: 'tox_font_'
          },
          types: ['eot','woff','ttf','svg']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-webfont');

  grunt.renameTask('clean', '_clean');

  grunt.registerTask('fix_font_paths', ['string-replace']);

  grunt.registerTask('default',
    ['webfont', 'string-replace', 'cssmin', 'copy:main', '_clean:after_copy']);

  grunt.registerTask('clean', ['_clean:build']);
};
