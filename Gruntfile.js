module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['clean:js', 'tslint', 'typescript', 'uglify', 'clean:css', 'less', 'cssmin']);
    grunt.registerTask('quick', ['newer:tslint', 'newer:typescript', 'newer:uglify', 'newer:less', 'cssmin']);
    grunt.registerTask('cleanup', ['clean:js', 'clean:css']);

    var tsFiles = [
        'game/RandomNumberPool.ts',
        'game/Point.ts',
        'game/Utils.ts',
        'game/GameManager.ts',
        'game/GameObject.ts',
        'game/GameMessage.ts',
        'game/HexagonGeometry.ts',
        'game/EntangledHexagonGeometry.ts',
        'game/SVGGameObject.ts',
        'game/Hexagon.ts',
        'game/Line.ts',
        'game/EntangledHexagon.ts',
        'game/HexMap.ts',
        'game/Keyboard.ts',
        'game/TouchControl.ts',
        'game/ScoreDisplay.ts',
        'game/FinishedDisplay.ts',
        'game/PathFollowingPoint.ts',
        'game/AudioPlayer.ts',
        'game/GameLogic.ts',
        'game/Game.ts'
    ];

    grunt.initConfig({
        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 5,
                title: 'EntangledClone',
                success: true,
                duration: 3
            }
        },
        typescript: {
            base: {
                src: tsFiles,
                dest: 'js/compiled.js',
                target: 'ES5',
                options: {
                    'module': 'commonjs',
                    'sourceMap': true
                }
            }
        },
        tslint: {
            options: {
                configuration: {
                    "rules": {
                        "ban": [true, ["_", "extend"],
                            ["_", "isNull"],
                            ["_", "isDefined"]
                        ],
                        "class-name": true,
                        "curly": true,
                        "forin": true,
                        "indent": [true, 4],
                        "jsdoc-format": true,
                        "label-position": true,
                        "label-undefined": true,
                        "max-line-length": [true, 140],
                        "member-ordering": [true,
                            "private-before-public",
                            "static-before-instance",
                            "variables-before-functions"
                        ],
                        "no-arg": true,
                        "no-bitwise": true,
                        "no-console": [true,
                            "debug",
                            "info",
                            "time",
                            "timeEnd",
                            "trace"
                        ],
                        "no-construct": true,
                        "no-constructor-vars": false,
                        "no-debugger": true,
                        "no-duplicate-key": true,
                        "no-duplicate-variable": true,
                        "no-empty": true,
                        "no-eval": true,
                        "no-string-literal": true,
                        "no-switch-case-fall-through": true,
                        "no-trailing-comma": true,
                        "no-trailing-whitespace": true,
                        "no-unused-expression": true,
                        "no-unused-variable": true,
                        "no-unreachable": true,
                        "no-use-before-declare": true,
                        "no-var-requires": true,
                        // "no-any": true, // ts lint is not ts 1.4 compatible
                        "one-line": [true,
                            "check-open-brace",
                            "check-catch",
                            "check-else",
                            "check-whitespace"
                        ],
                        "quotemark": [true, "single"],
                        "radix": true,
                        "semicolon": true,
                        "triple-equals": [true, "allow-null-check"],
                        "typedef": [true,
                            "callSignature",
                            "indexSignature",
                            "parameter",
                            "propertySignature",
                            "variableDeclarator",
                            "memberVariableDeclarator"
                        ],
                        "typedef-whitespace": [true, ["callSignature", "noSpace"],
                            ["catchClause", "noSpace"],
                            ["indexSignature", "space"]
                        ],
                        "use-strict": [true,
                            "check-module",
                            "check-function"
                        ],
                        "variable-name": false,
                        "whitespace": [true,
                            "check-branch",
                            "check-decl",
                            "check-operator",
                            "check-separator",
                            "check-type"
                        ]
                    }
                }
            },
            files: {
                src: tsFiles
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'game/*.ts'],
                tasks: ['quick']
            },
            options: {
                reload: true,
                livereload: true,
                atBegin: true
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: '',
                src: ['style/*.css', 'style/!*.min.css'],
                dest: '',
                ext: '.min.css'
            }
        },
        less: {
            production: {
                options: {
                    paths: ["style"]
                },
                files: {
                    "style/hex.css": "style/hex.less",
                    "style/page.css": "style/page.less"
                }
            }
        },
        uglify: {
            options: {
                wrap: true,
                sourceMapIn: 'js/compiled.js.map',
                sourceMap: true,
                report: 'min',
                banner: '/* EntangledClone */'
            },
            my_target: {
                files: {
                    'js/compiled.min.js': ['js/compiled.js']
                }
            }
        },
        clean: {
            css: ["style/*.css", "!style/*.less"],
            js: ["js/*.js", "js/*.js.map"]
        }
    });
};