'use strict';

import gulp from 'gulp';
import path from 'path';
import rename from 'gulp-rename';
import template from 'gulp-template';
import yargs from 'yargs';
import prompt from 'gulp-prompt';
import replace from 'gulp-replace';

// helper method for resolving paths
let resolveToRoutes = (glob = '') => {
    return path.join(__dirname, 'routes', glob); // app/{glob}
};

let resolveToComponents = (glob = '') => {
    return path.join(__dirname, 'client/src', glob); // app/components/{glob}
};
let resolveToModules = (glob = '') => {
    return path.join(__dirname, 'client/src', glob); // app/components/{glob}
};

// map of all paths
let paths = {
    blankTemplatesForRoute: path.join(__dirname, 'generator', 'route/**/*.**'),
    blankTemplatesForComponent: path.join(__dirname, 'generator', 'component/**/*.**'),
    blankTemplatesForModule: path.join(__dirname, 'generator', 'module/**/*.**')
};

gulp.task('route', () => {
    const cap = (val) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    const name = yargs.argv.name;
    const parentPath = yargs.argv.parent || '';
    const destPath = path.join(resolveToRoutes(), parentPath, name);

    return gulp.src(paths.blankTemplatesForRoute)
        .pipe(template({
            name: name,
            upCaseName: cap(name)
        }))
        .pipe(rename((path) => {
            path.basename = path.basename.replace('temp', name);
        }))
        .pipe(gulp.dest(destPath));
});

gulp.task('component', () => {
    const cap = (val) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    const name = yargs.argv.name;
    const parentPath = yargs.argv.parent || '';
    const destPath = path.join(resolveToComponents(), parentPath, name);

    return gulp.src(paths.blankTemplatesForComponent)
        .pipe(template({
            name: name,
            upCaseName: cap(name)
        }))
        .pipe(rename((path) => {
            path.basename = path.basename.replace('temp', name);
        }))
        .pipe(gulp.dest(destPath));
});

gulp.task('module', () => {
    const cap = (val) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    const name = yargs.argv.name;
    const parentPath = yargs.argv.parent || '';
    const destPath = path.join(resolveToModules(), parentPath, name);

    return gulp.src(paths.blankTemplatesForModule)
        .pipe(template({
            name: name,
            upCaseName: cap(name)
        }))
        .pipe(rename((path) => {
            path.basename = path.basename.replace('temp', name);
        }))
        .pipe(gulp.dest(destPath));
});

gulp.task('init', () => {
    return gulp.src('server.js')
        .pipe(prompt.prompt([
            {
                type: 'input',
                name: 'env_static_ip',
                message: 'Static IP - http://'
            },
            {
                type: 'input',
                name: 'env_port',
                message: 'PORT: '
            },
            {
                type: 'input',
                name: 'env_BACKUP_PATH',
                message: 'env_BACKUP_PATH: '
            }
            // {
            //     type: 'input',
            //     name: 'env_MONGODB_URI',
            //     message: 'env_MONGODB_URI: '
            // },
            // {
            //     type: 'input',
            //     name: 'env_MONGOLAB_URI',
            //     message: 'env_MONGOLAB_URI: '
            // },
            // {
            //     type: 'input',
            //     name: 'env_TWILIO_ACCOUNT_SID',
            //     message: 'env_TWILIO_ACCOUNT_SID: '
            // },
            // {
            //     type: 'input',
            //     name: 'env_TWILIO_AUTH_TOKEN',
            //     message: 'env_TWILIO_AUTH_TOKEN: '
            // },
            // {
            //     type: 'input',
            //     name: 'env_TWILIO_PHONE_NUMBER',
            //     message: 'env_TWILIO_PHONE_NUMBER: '
            // },
            // {
            //     type: 'input',
            //     name: 'env_TWILIO_ACCOUNT_SID_TEST',
            //     message: 'env_TWILIO_ACCOUNT_SID_TEST: '
            // },
            // {
            //     type: 'input',
            //     name: 'env_TWILIO_AUTH_TOKEN_TEST',
            //     message: 'env_TWILIO_AUTH_TOKEN_TEST: '
            // },
            // {
            //     type: 'checkbox',
            //     name: 'third',
            //     message: 'Second question?',
            //     choices: ['patch', 'minor', 'major']
            // }
        ], (res) => {
            gulp.src(['generator/.env.file'])
                .pipe(replace('env_port', res.env_port))
                .pipe(replace('env_static_ip', res.env_static_ip))
                .pipe(replace('env_BACKUP_PATH', res.env_BACKUP_PATH))
                // .pipe(replace('env_MONGODB_URI', res.env_MONGODB_URI))
                // .pipe(replace('env_MONGOLAB_URI', res.env_MONGOLAB_URI))
                // .pipe(replace('env_TWILIO_ACCOUNT_SID_TEST', res.TWILIO_ACCOUNT_SID_TEST))
                // .pipe(replace('env_TWILIO_AUTH_TOKEN_TEST', res.TWILIO_AUTH_TOKEN_TEST))
                // .pipe(replace('env_TWILIO_ACCOUNT_SID', res.env_TWILIO_ACCOUNT_SID))
                // .pipe(replace('env_TWILIO_AUTH_TOKEN', res.env_TWILIO_AUTH_TOKEN))
                // .pipe(replace('env_TWILIO_PHONE_NUMBER', res.env_TWILIO_PHONE_NUMBER))
                .pipe(gulp.dest('./'));
            gulp.src(['generator/main.js'])
                .pipe(replace('env_port', res.env_port))
                .pipe(replace('env_static_ip', res.env_static_ip))
                .pipe(gulp.dest('./app'));


        }))
        .pipe(gulp.dest('./'));

});
