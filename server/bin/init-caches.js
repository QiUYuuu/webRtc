const Promise = require('promise');
const {RoleModel, HospitalHierarchyModel, AdminDivisionModel, ProcedureModel, GeneralEntityModel, PermissonModel, ApplicationModel} = require('../models/mongoose-models');
const poolCluster = require('../conf/mysql.conf').poolCluster;
const mysqlConfig = require('../conf/mysql.conf').mysqlConfig;
const bootLog = require('../conf/global.conf').isDebug;

function enableCache() {
    return new Promise(outerResolve => {
        bootLog && console.log('###################Initing Caches####################'.yellow);

        function initCacheRole() {
            return new Promise(resolve => {
                RoleModel.deleteMany((err) => {
                    poolCluster.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query('CALL procInitCacheRole();', (err, rs) => {
                            if (err) throw err;
                            rs[0].map(e => e['permissionInfo'] = rs[1].splice(0, e['permissionInfo']));
                            RoleModel.insertMany(rs[0]).then(() => {
                                bootLog && console.log('[Role Info Caches] inited successfully!'.green);
                                resolve();
                            });
                        });
                    });
                });
            });
        }

        function initCacheHospitalHierarchy() {
            return new Promise(resolve => {
                HospitalHierarchyModel.deleteMany(() => {
                    poolCluster.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query('CALL procInitCacheHospitalHierarchy();', (err, rs) => {
                            if (err) throw err;
                            const tmpGroup = new Map();
                            rs[0].forEach(group => {
                                if (tmpGroup.get(group['deptId'])) {
                                    tmpGroup.get(group['deptId']).push(group);
                                } else {
                                    tmpGroup.set(group['deptId'], [group]);
                                }
                            });
                            const tmpDept = new Map();
                            rs[1].forEach(dept => {
                                dept['governs'] = tmpGroup.get(dept['deptId']) || [];
                                if (tmpDept.get(dept['sectionId'])) {
                                    tmpDept.get(dept['sectionId']).push(dept);
                                } else {
                                    tmpDept.set(dept['sectionId'], [dept]);
                                }
                            });
                            const tmpSection = new Map();
                            rs[2].forEach(section => {
                                section['governs'] = tmpDept.get(section['sectionId']) || [];
                                if (tmpSection.get(section['hospitalId'])) {
                                    tmpSection.get(section['hospitalId']).push(section);
                                } else {
                                    tmpSection.set(section['hospitalId'], [section]);
                                }
                            });
                            rs[3].forEach(hospital => {
                                hospital['governs'] = tmpSection.get(hospital['hospitalId']) || [];
                            });
                            HospitalHierarchyModel.insertMany(rs[3]).then(() => {
                                bootLog && console.log('[Hospital Hierarchy Caches] inited successfully!'.green);
                                resolve();
                            });
                        });
                    });
                });
            });
        }

        function initCachePermission() {
            return new Promise(resolve => {
                PermissonModel.deleteMany(() => {
                    poolCluster.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query('CALL procInitCachePermission();', (err, rs) => {
                            if (err) throw err;
                            PermissonModel.insertMany(rs[0]).then(() => {
                                bootLog&&  console.log('[Permission Infos Caches] inited successfully!'.green);
                                resolve();
                            });
                        });
                    });
                });
            });
        }

        function initCacheProcedure() {
            new Promise(resolve => {
                ProcedureModel.deleteMany(() => {
                    poolCluster.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query(`CALL procInitCacheProcedure(?);`, [mysqlConfig.database], (err, rs) => {
                            if (err) throw err;
                            rs[0].forEach(e => e['procParams'] = rs[1].splice(0, e['procParams']));
                            ProcedureModel.insertMany(rs[0]).then(() => {
                                bootLog && console.log('[Procedure Caches] inited successfully!'.green);
                                resolve();
                            });
                        });
                    });
                });
            });
        }

        function initCacheGeneralEntity() {
            return new Promise(resolve => {
                GeneralEntityModel.deleteMany(() => {
                    poolCluster.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query('CALL procInitCacheGeneralEntity();', (err, rs) => {
                            if (err) throw err;
                            GeneralEntityModel.insertMany(rs[0]).then(() => {
                                bootLog && console.log('[General Entity Caches] inited successfully!'.green);
                                resolve();
                            });
                        });
                    });
                });
            });
        }

        function initCacheApplication() {
            new Promise(resolve => {
                ApplicationModel.deleteMany(() => {
                    poolCluster.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query('CALL procInitCacheApplication();', (err, rs) => {
                            if (err) throw err;
                            ApplicationModel.insertMany(rs[0]).then(() => {
                                bootLog && console.log('[Application Infos Caches] inited successfully!'.green);
                                resolve();
                            });
                        });
                    });
                });
            });
        }

        function initCacheAdminDivision() {
            new Promise(resolve => {
                AdminDivisionModel.deleteMany(() => {
                    poolCluster.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query('CALL procInitCacheAdminDivision();', (err, rs) => {
                            if (err) throw err;
                            rs[0].forEach(p => (p['governs'] = rs[1].splice(0, p['governs'])).forEach(c => c['governs'] = rs[2].splice(0, c['governs'])));
                            AdminDivisionModel.insertMany(rs[0]).then(() => {
                                bootLog && console.log('[Admin Division Caches] inited successfully!'.green);
                                resolve();
                            });
                        });
                    });
                });
            });
        }

        Promise.all([initCacheRole(), initCacheHospitalHierarchy(), initCacheProcedure(), initCacheGeneralEntity(), initCachePermission(),
            initCacheApplication(), initCacheAdminDivision()])
            .then(() => {
                bootLog && console.log('#############Caches inited successfully##############\n'.yellow);
                outerResolve();
            });
    });
}
