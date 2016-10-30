'use strict';

import gulp from 'gulp';
import path from 'path';
import rename from 'gulp-rename';
import template from 'gulp-template';
import yargs from 'yargs';

// helper method for resolving paths
let resolveToRoutes = (glob = '') => {
    return path.join(__dirname, 'routes', glob); // app/{glob}
};

let resolveToComponents = (glob = '') => {
    return path.join(__dirname, 'client/src/app', glob); // app/components/{glob}
};
let resolveToModules = (glob = '') => {
    return path.join(__dirname, 'client/src/app', glob); // app/components/{glob}
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
