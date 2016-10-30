// Run with command
// eslint **/*.js > out.txt

module.exports = {
    "env": {
        "browser": false,
        "es6": true,
        "node": true
    },
    "globals": {},
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [
        "angular",
        "import"
    ],
    "rules": {
    // ESLint Rules

        // Possible Errors
        "no-console": [
            // Since this is Node, we turn this to warn since it's a helpful tool.
            "warn"
        ],
        "no-dupe-args": [
            "error"
        ],
        "no-dupe-keys": [
            "error"
        ],
        "no-duplicate-case": [
            "error"
        ],
        "no-empty": [
            "error"
        ],
        "no-extra-boolean-cast": [
            "warn"
        ],
        "no-extra-semi": [
            "warn"
        ],
        "no-irregular-whitespace": [
            "error",
            {
                "skipStrings": true,
                "skipComments": true,
                "skipRegExps": true,
                "skipTemplates": true
            }
        ],
        "no-unexpected-multiline": [
            "error"
        ],
        "no-unreachable": [
            "error"
        ],
        "valid-typeof": [
            "error"
        ],

        //Best Practices
        "default-case": [
            "error"
        ],
        "no-alert": [
            "error"
        ],
        "no-eval": [
            "error"
        ],
        "no-fallthrough": [
            "error"
        ],
        "no-native-reassign": [
            "error"
        ],
        "no-octal": [
            "error"
        ],
        "no-redeclare": [
            "error"
        ],
        "no-useless-concat": [
            "warn"
        ],
        "no-warning-comments": [
            "warn"
        ],

        // Strict Mode
        // We need to agree upon how we are treating this first.
        // "strict": [
        //     "error"
        // ],

        // Variables
        "no-undef": [
            "error"
        ],
        "no-unused-vars": [
            "error"
        ],

        // Stylistic Issues
        "comma-dangle": [
            "warn",
            "never"
        ],
        "eol-last": [
            "error"
        ],
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "outerIIFEBody": 0
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-len": [
            "error",
            {
                "code": 100,
                "ignoreUrls": true
            }
        ],
        "max-lines": [
            "error",
            {
                "max": 500,
                "skipBlankLines": true,
                "skipComments": true
            }
        ],
        "no-lonely-if": [
            "error"
        ],
        "no-mixed-spaces-and-tabs": [
            "error"
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "one-var-declaration-per-line": [
            "error",
            "always"
        ],
        "quotes": [
            "warn",
            "single",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "semi": [
            "error",
            "always"
        ],

    // Import rules

        // Static analysis
        "import/no-unresolved": [
            "error"
        ],
        "import/default": [
            "error"
        ],

        // Module systems

        // Style guide
        "import/first": [
            "error"
        ],
        "import/no-duplicates": [
            "error"
        ]
    }
};
