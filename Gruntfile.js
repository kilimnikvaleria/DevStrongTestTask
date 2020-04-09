module.exports = function(grunt) {
    const sass = require('node-sass');
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({

        clean: {
            build: ["build"]
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    src: [
                        "fonts/**/*.{woff,woff2}",
                        "images/**",
                        "js/**",
                        "*.html"
                    ],
                    dest: "build"
                }]
            },
            html:{
                files:[{
                    expand: true,
                    src: ["*.html"],
                    dest: "build"
                }]
            }

        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    "build/css/style.css": "sass/style.scss"
                }
            }
        },
        postcss: {
            style:{
                options: {
                    processors: [
                        require("autoprefixer")({
                            browsers: [
                                "last 1 version",
                                "last 2 Chrome versions",
                                "last 2 Firefox versions",
                                "last 2 Opera versions",
                                "last 2 Edge versions"
                            ]
                        }),
                        require("css-mqpacker")({
                            sort: true
                        })
                    ]


                },
                src: "build/css/*.css"
            }

        },
        svgstore:{
            options:{
                svg:{
                    style: "display: none"
                }
            },
            symbols:{
                files:{
                    "build/images/symbols.svg":["images/*.svg"]
                }
            }
        },
        csso: {
            style: {
                options: {
                    report: "gzip"
                },
                files: {           "build/css/style.min.css": ["build/css/style.css"]
                }
            }
        },
        imagemin: {
            images: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    src: ["build/images/**/*.{png,jpg,gif}"]
                }]
            }

        },
        browserSync: {
            server: {
                bsFiles: {
                    src: ["build/*.html", "build/css/*.css"]
                },
                options: {
                    server: "build",
                    watchTask: true
                }
            }
        },
        watch: {
            html:{
                files: ["*.html"],
                tasks: ["copy:html"]
            },
            style: {
                files: ["sass/**/*.scss"],
                tasks: ["sass", "postcss","csso"]
            }
        },
    });
    grunt.registerTask("serve",["browserSync","watch"]);
    grunt.registerTask("build",[
        "clean",
        "copy",
        "sass",
        "postcss",
        "csso",
        "imagemin"
    ]);
};