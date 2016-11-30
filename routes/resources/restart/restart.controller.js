const AbstractController = require('../../abstract/AbstractController.js');
const child_process = require('child_process');
const path = require('path');
class RestartController extends AbstractController {
    restart(req, res) {
        if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev') {
            child_process.exec('.exit && npm run dev:back', (error, stdout, stderr) => {
                console.log(stdout);
                res.sendStatus(200);
            });
        } else {
            child_process.exec(
                path.join(__dirname, 'windows-services/restart_service_beastie.exe'),
                (error, stdout, stderr) => {
                    console.log(stdout);
                    res.sendStatus(200);
                });
        }
    }
}

module.exports = RestartController;
