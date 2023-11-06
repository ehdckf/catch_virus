const NodeClam = require("clamscan");
const path = require("path");
const options = {
        removeInfected: false, // If true, removes infected files
        quarantineInfected: false, // False: Don't quarantine, Path: Moves files to this place.
        scanLog: null, // Path to a writeable log file to write scan results into
        debugMode: false, // Whether or not to log info/debug/error msgs to the console
        fileList: null, // path to file containing list of files to scan (for scanFiles method)
        scanRecursively: true, // If true, deep scan folders recursively
        clamscan: {
                path: "/usr/bin/clamscan",
                db: null,
                scanArchives: true,
                active: true,
        },

        preference: "clamdscan", // If clamdscan is found and active, it will be used by default
};

(async () => {
        // const getClamScan = () =>
        //         new Promise(async (resolve) => {
        //                 return new NodeClam()
        //                         .init(options)
        //                         .then((value) => {
        //                                 resolve(value);
        //                         })
        //                         .catch((reason) => {
        //                                 console.error(reason);
        //                                 process.exit(1);
        //                         });
        //         });

        // const ClamScan = await getClamScan();
        const ClamScan = await new NodeClam().init(options);
        const { file, isInfected, viruses } = await ClamScan.isInfected(
                path.join(
                        process.cwd(),
                        "sample",
                        "98538f62bda2689e6105863fe3346b15db9072d49d1ce354412773623824b85f.elf",
                ),
        );
        console.log(file);
        console.log(isInfected);
        console.log(viruses);
})();
