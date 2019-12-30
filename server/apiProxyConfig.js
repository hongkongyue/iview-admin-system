/*
 * @Author: anytao
 * @Description: 后端api代理配置
 * @Last Modified by: anytao
 */

var apiProxyConfig = {

    dev: [
        '^/eop-node/(.*)$ http://eopsit.eptison.com/eop-node/$1 [P]',
        // '^/eop-node/(.*)$ http://127.0.0.1:8360/eop-node/$1 [P]',
        '^/eop/(.*)$ http://eopsit.eptison.com:8080/eop/$1 [P]',
        '^/WebReport/(.*)$ http://192.168.30.202:8080/WebReport/$1 [P]',
        '^/local_api/(.*)$ http://127.0.0.1:8081/$1 [P]',
        '^/uploadFile_api/(.*)$ http://localhost:8081/$1 [P]'
    ],
    cit: [
        //'^/eop-node/(.*)$ http://eopsit.eptison.com/eop-node/$1 [P]',
         '^/eop-node/(.*)$ http://127.0.0.1:8360/eop-node/$1 [P]',
        '^/eop/(.*)$ http://eopsit.eptison.com:8080/eop/$1 [P]',
        '^/WebReport/(.*)$ http://eopsit.eptison.com/WebReport/$1 [P]',
        '^/local_api/(.*)$ http://127.0.0.1:8081/$1 [P]'
    ],
    uat: [
        '^/eop-node/(.*)$ http://eopuat.eptison.com/eop-node/$1 [P]',
        '^/eop/(.*)$ http://eopuat.eptison.com/eop/$1 [P]',
        '^/WebReport/(.*)$ http://eop.eptison.com/WebReport/$1 [P]',
        '^/local_api/(.*)$ http://127.0.0.1:8081/$1 [P]',
    ],
    pro: [
        '^/eop-node/(.*)$ http://eop.quanshangtech.com:888/eop-node/$1 [P]',
        '^/eop/(.*)$ http://eop.quanshangtech.com:888/eop/$1 [P]',
        '^/WebReport/(.*)$ http://eop.quanshangtech.com:888/WebReport/$1 [P]',
        '^/local_api/(.*)$ http://127.0.0.1:8081/$1 [P]'
    ],
};

module.exports = apiProxyConfig;
